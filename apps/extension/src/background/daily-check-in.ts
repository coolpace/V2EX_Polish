import { StorageKey, V2EX } from '../constants'
import { getRuntime } from '../runtime'
import type {
  CheckInErrorCode,
  CheckInHttpResponse,
  CheckInResult,
  CheckInStage,
  CheckInTrigger,
} from '../types'
import { getStorage, setStorage } from '../utils'
import { createSerialQueue } from '../utils/async'
import {
  type CheckInPageSession,
  openCheckInPageSession,
  openCheckInTemporaryTabSession,
} from './check-in-page-fetch'
import {
  buildDailyInfoAfterAttempt,
  createCheckInStateForMember,
  getCheckInScheduleDecision,
  isCheckInAttemptStillCurrent,
  isCheckInStateForMember,
  isSameCheckInState,
  normalizeCheckInState,
  normalizeMemberName,
} from './check-in-scheduler'
import {
  CHECK_IN_CHALLENGE_COPY,
  hasClaimedReward,
  parseCheckInDays,
  parseCheckInPage,
  RECLICK_TEXT,
} from './check-in-utils'

/** 直接请求的最长等待时间。 */
const checkInTimeout = 15 * 1000

/** 同一时间只允许一个签到任务，避免 alarm 与 popup 触发并发请求。 */
let inFlight = false

/** 账号每次切换都会递增，用于丢弃绑定到旧账号的异步签到结果。 */
let accountRevision = 0

/** 串行执行账号观察和签到状态写入，避免并发请求读取到同一份旧状态。 */
const enqueueStateTransition = createSerialQueue()

/** 是否有签到任务正在执行。 */
export function isCheckInInFlight(): boolean {
  return inFlight
}

/** 后台直接请求签到接口，没有可用的页面上下文时使用。 */
async function fetchCheckInDirect(path: string): Promise<CheckInHttpResponse> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), checkInTimeout)

  try {
    const res = await fetch(`${V2EX.Origin}${path}`, {
      headers: {
        Referer: `${V2EX.Origin}/mission/daily`,
      },
      credentials: 'include',
      cache: 'no-store',
      signal: controller.signal,
    })

    return {
      status: res.status,
      finalUrl: res.url,
      text: await res.text(),
      retryAfter: res.headers.get('retry-after'),
      challenge: res.headers.get('cf-mitigated')?.toLowerCase() === 'challenge',
    }
  }
  finally {
    clearTimeout(timeoutId)
  }
}

/** 一次签到请求的结果：成功时带回响应，失败时给出可直接落库的错误。 */
type CheckInResourceResult
  = | { ok: true, response: CheckInHttpResponse }
    | { ok: false, code: 'timeout' | 'network', message: string }

/**
 * 请求签到接口。
 *
 * 浏览器扩展优先通过页面会话通道发送请求，让领取凭证与页面会话保持一致；
 * 页面通道不可用时回退到后台请求。
 */
async function requestCheckInResource(
  path: string,
  session: CheckInPageSession | undefined,
): Promise<CheckInResourceResult> {
  if (session) {
    const pageResult = await session.fetch(path)

    if (pageResult) {
      return pageResult
    }
  }

  try {
    return { ok: true, response: await fetchCheckInDirect(path) }
  }
  catch (error) {
    const { code, message } = getErrorInfo(error)

    return { ok: false, code: code === 'timeout' ? 'timeout' : 'network', message }
  }
}

function getErrorInfo(error: unknown): { code: CheckInErrorCode, message: string } {
  if (error instanceof Error) {
    return error.name === 'AbortError'
      ? { code: 'timeout', message: '请求超时' }
      : { code: 'network', message: error.message }
  }

  return { code: 'unknown', message: '未知错误' }
}

function createUnknownCheckInFailure(error: unknown): CheckInResult {
  const { message } = getErrorInfo(error)

  return { status: 'failed', code: 'unknown', reason: `签到失败：${message}` }
}

/** 提取响应最终地址的路径，避免把查询串（可能含 once 凭证）写入存储。 */
function getUrlPath(url: string): string | undefined {
  try {
    return new URL(url).pathname
  }
  catch {
    return undefined
  }
}

/** 根据 HTTP 状态码补充失败说明。 */
function describeHttpFailure(status: number): string {
  if (status === 429) {
    return '请求过于频繁，已被 V2EX 限流'
  }

  if (status === 403) {
    return '请求被拒绝，可能触发了风控'
  }

  if (status >= 500) {
    return 'V2EX 服务器异常'
  }

  return '请求失败'
}

/** 失败结果附带的响应元数据。 */
type CheckInResponseMeta = Pick<CheckInResult, 'httpStatus' | 'finalUrlPath' | 'retryAfterMs'>

/** 从响应中提取可写入状态机的元数据。 */
function createResponseMeta(response: CheckInHttpResponse): CheckInResponseMeta {
  return {
    httpStatus: response.status,
    finalUrlPath: getUrlPath(response.finalUrl),
    retryAfterMs:
      response.status === 429 ? parseRetryAfter(response.retryAfter) : undefined,
  }
}

/** 判断响应是否成功。 */
function isSuccessfulStatus(status: number): boolean {
  return status >= 200 && status < 300
}

/** 构造结构一致的失败结果，避免各分支重复拼装字段。 */
function fail(
  code: CheckInErrorCode,
  stage: CheckInStage,
  reason: string,
  meta?: CheckInResponseMeta,
): CheckInResult {
  return { status: 'failed', code, stage, reason, ...meta }
}

/**
 * 解析 Retry-After，并将不可用或过大的值交给后续策略回退到默认等待时间。
 */
export function parseRetryAfter(value: string | null, now = Date.now()): number | undefined {
  if (!value) {
    return undefined
  }

  const seconds = Number(value)
  const delayMs = Number.isFinite(seconds) ? seconds * 1000 : Date.parse(value) - now

  if (!Number.isFinite(delayMs) || delayMs < 60 * 1000 || delayMs > 24 * 60 * 60 * 1000) {
    return undefined
  }

  return delayMs
}

/** 签到页请求结果：成功时返回可解析的 HTML，失败时直接给出结果。 */
type DailyPageOutcome
  = | { ok: true, text: string, meta: CheckInResponseMeta }
    | { ok: false, result: CheckInResult }

/** 请求签到页并读取 HTML。 */
async function fetchDailyPage(session: CheckInPageSession | undefined): Promise<DailyPageOutcome> {
  const fetched = await requestCheckInResource('/mission/daily', session)

  if (!fetched.ok) {
    return {
      ok: false,
      result: fail(fetched.code, 'request-page', `无法访问 V2EX：${fetched.message}`),
    }
  }

  const { response } = fetched
  const meta = createResponseMeta(response)

  // Cloudflare 人机验证会在响应头标记，需要先于状态码判断。
  if (response.challenge) {
    return {
      ok: false,
      result: fail('challenge', 'request-page', CHECK_IN_CHALLENGE_COPY.failureReason, meta),
    }
  }

  if (!isSuccessfulStatus(response.status)) {
    return {
      ok: false,
      result: fail(
        'http',
        'request-page',
        `获取签到页面失败：${describeHttpFailure(response.status)}（HTTP ${response.status}）`,
        meta,
      ),
    }
  }

  return { ok: true, text: response.text, meta }
}

/** 领取结果，附带 V2EX 是否要求再点一次。 */
type RedeemOutcome = {
  result: CheckInResult
  needsReclick: boolean
}

/** 发起一次领取请求，并根据结果页判断是否真正到账。 */
async function redeemReward(
  path: string,
  session: CheckInPageSession | undefined,
): Promise<RedeemOutcome> {
  const fetched = await requestCheckInResource(path, session)

  if (!fetched.ok) {
    return {
      result: fail(fetched.code, 'redeem', `领取请求失败：${fetched.message}`),
      needsReclick: false,
    }
  }

  const { response } = fetched
  const meta = createResponseMeta(response)

  if (!isSuccessfulStatus(response.status)) {
    return {
      result: fail(
        'http',
        'redeem',
        `领取请求失败：${describeHttpFailure(response.status)}（HTTP ${response.status}）`,
        meta,
      ),
      needsReclick: false,
    }
  }

  if (hasClaimedReward(response.text)) {
    return {
      result: { status: 'success', checkInDays: parseCheckInDays(response.text), ...meta },
      needsReclick: false,
    }
  }

  return {
    result: fail('redeem-failed', 'parse-redeem', '领取接口未返回成功提示', meta),
    needsReclick: response.text.includes(RECLICK_TEXT),
  }
}

/**
 * 请求签到页面并完成领取。
 */
async function requestCheckInInner(
  session: CheckInPageSession | undefined,
): Promise<CheckInResult> {
  const page = await fetchDailyPage(session)

  if (!page.ok) {
    return page.result
  }

  const parsed = parseCheckInPage(page.text, page.meta.finalUrlPath)

  if (parsed.type === 'already') {
    return { status: 'already', checkInDays: parsed.checkInDays, ...page.meta }
  }

  if (parsed.type === 'unauthenticated') {
    return fail('unauthenticated', 'parse-page', '未登录或登录状态已失效', page.meta)
  }

  if (parsed.type === 'challenge') {
    return fail('challenge', 'parse-page', CHECK_IN_CHALLENGE_COPY.failureReason, page.meta)
  }

  if (parsed.type === 'unknown') {
    return fail('unexpected-page', 'parse-page', '签到页面无法识别，V2EX 可能已改版', page.meta)
  }

  let outcome = await redeemReward(parsed.path, session)

  // V2EX 偶发要求「再点一次」才真正入账：重新打开签到页拿到新的入口后再领一次。
  if (outcome.needsReclick) {
    const refreshed = await fetchDailyPage(session)

    if (refreshed.ok) {
      const next = parseCheckInPage(refreshed.text, refreshed.meta.finalUrlPath)

      if (next.type === 'redeem') {
        outcome = await redeemReward(next.path, session)
      }
    }
  }

  if (outcome.result.status === 'success') {
    return outcome.result
  }

  const unconfirmed
    = outcome.result.code === 'redeem-failed'
      || outcome.result.code === 'network'
      || outcome.result.code === 'timeout'

  if (!unconfirmed) {
    return outcome.result
  }

  // 领取结果不明确时以签到页实际状态为准，避免站点省略提示文案导致误报失败。
  const verify = await fetchDailyPage(session)

  if (verify.ok) {
    const verified = parseCheckInPage(verify.text, verify.meta.finalUrlPath)

    if (verified.type === 'already') {
      return {
        status: 'success',
        checkInDays: verified.checkInDays,
        httpStatus: outcome.result.httpStatus,
        finalUrlPath: outcome.result.finalUrlPath,
      }
    }
  }

  return outcome.result
}

/**
 * 后台请求无法确认领取结果时，才值得再用临时标签页重试一次。
 *
 * 网络类错误、限流、人机验证换到页面上下文也不会改善，反而会多开一个标签页。
 */
export function shouldRetryInTemporaryTab(result: CheckInResult): boolean {
  return (
    result.status === 'failed'
    && (result.code === 'redeem-failed' || result.code === 'unexpected-page')
  )
}

/** 在页面通道上执行一次完整签到，并确保释放标签页资源。 */
async function runWithPageSession(
  session: CheckInPageSession | undefined,
): Promise<CheckInResult> {
  try {
    return await requestCheckInInner(session)
  }
  finally {
    await session?.close()
  }
}

/** 在失败结果上补充本次请求耗时，便于区分超时与快速失败。 */
async function requestCheckIn(): Promise<CheckInResult> {
  const startedAt = Date.now()
  const isExtension = getRuntime().isBrowserExtension
  const pageSession = isExtension ? await openCheckInPageSession() : undefined

  let result = await runWithPageSession(pageSession)

  // 没有可用标签页且后台请求无法确认结果时，临时开一个后台标签页重试一次。
  if (isExtension && !pageSession && shouldRetryInTemporaryTab(result)) {
    const temporarySession = await openCheckInTemporaryTabSession()

    if (temporarySession) {
      result = await runWithPageSession(temporarySession)
    }
  }

  return { ...result, durationMs: Date.now() - startedAt }
}

/** 签到调用选项。 */
export interface CheckInOptions {
  /** 手动触发时忽略等待时间。 */
  force?: boolean
  /** 触发来源，仅用于诊断记录。 */
  trigger?: CheckInTrigger
  /** 当前页面确认的账号；会在读取调度状态前原子写入。 */
  memberName?: string
}

/**
 * 记录当前页面确认的 V2EX 用户名。
 *
 * 本项目只保留当前账号的签到状态。用户名变化时清除旧账号状态，
 * 避免把旧账号的成功、失败和重试时间带到新账号。
 */
async function observeCheckInMemberNow(
  memberName: string,
  now = Date.now(),
): Promise<boolean> {
  const storage = await getStorage(false)

  if (isCheckInStateForMember(storage[StorageKey.Daily], memberName)) {
    return false
  }

  await setStorage(StorageKey.Daily, createCheckInStateForMember(memberName, now))
  accountRevision += 1

  return true
}

function enqueueMemberObservation(memberName: string, now = Date.now()): Promise<boolean> {
  return enqueueStateTransition(() => observeCheckInMemberNow(memberName, now))
}

export function observeCheckInMember(
  memberName: unknown,
  now = Date.now(),
): Promise<boolean> {
  const normalizedMemberName = normalizeMemberName(memberName)

  if (!normalizedMemberName) {
    return Promise.resolve(false)
  }

  return enqueueMemberObservation(normalizedMemberName, now)
}

/**
 * 读取配置后执行签到，并将任何未预期的异常统一转换为失败结果。
 */
async function runCheckIn(options: CheckInOptions): Promise<CheckInResult> {
  const trigger = options.trigger ?? 'manual'
  const memberName = normalizeMemberName(options.memberName)
  const prepared = await enqueueStateTransition(async () => {
    if (memberName) {
      await observeCheckInMemberNow(memberName, Date.now())
    }

    const startedAt = Date.now()
    const startedAccountRevision = accountRevision
    const storage = await getStorage(false)
    const normalizedState = normalizeCheckInState(storage[StorageKey.Daily], startedAt)

    // 先持久化当日目标和抖动，确保 Service Worker 重启后不会重新生成时间。
    if (!isSameCheckInState(normalizedState, storage[StorageKey.Daily])) {
      await setStorage(StorageKey.Daily, normalizedState)
    }

    return {
      startedAccountRevision,
      normalizedState,
      decision: getCheckInScheduleDecision({
        now: startedAt,
        state: normalizedState,
        autoCheckInEnabled: storage[StorageKey.Options].autoCheckIn.enabled,
        trigger,
        force: options.force,
      }),
    }
  })
  const {
    startedAccountRevision,
    normalizedState,
    decision,
  } = prepared

  if (decision.action === 'skip') {
    return { status: 'skipped', reason: decision.reason }
  }

  const attemptTime = Date.now()
  let result: CheckInResult

  try {
    result = await requestCheckIn()
  }
  catch (error) {
    const { code, message } = getErrorInfo(error)
    result = fail(code, 'request-page', `签到失败：${message}`)
  }

  const stateSaved = await enqueueStateTransition(async () => {
    const latestState = (await getStorage(false))[StorageKey.Daily]
    const accountStillMatches = isCheckInAttemptStillCurrent({
      startedAccountRevision,
      currentAccountRevision: accountRevision,
      startedState: normalizedState,
      latestState,
    })

    if (!accountStillMatches) {
      return false
    }

    const nextState = buildDailyInfoAfterAttempt({
      previous: normalizedState,
      result,
      attemptTime,
      finishedAt: Date.now(),
      trigger,
    })

    try {
      await setStorage(StorageKey.Daily, nextState)
    }
    catch (error) {
      // 状态写入失败不应影响已完成的领取。
      console.warn('[V2EX Polish] 保存签到状态失败：', error)
    }

    return true
  })

  if (!stateSaved) {
    return { status: 'skipped', reason: '账号已切换，等待重新签到' }
  }

  return result
}

/**
 * 领取 V2EX 每日登录奖励。
 *
 * 奖励日按 UTC 计算（重置点 UTC 00:00，北京时间 08:00），
 * 因此不再限制「本地时间 8 点后」才执行。
 */
export async function checkIn(options: CheckInOptions = {}): Promise<CheckInResult> {
  if (inFlight) {
    const memberName = normalizeMemberName(options.memberName)

    if (memberName) {
      try {
        await enqueueMemberObservation(memberName)
      }
      catch (error) {
        return createUnknownCheckInFailure(error)
      }
    }

    return { status: 'skipped', reason: '已有签到任务进行中' }
  }

  inFlight = true

  try {
    return await runCheckIn(options)
  }
  catch (error) {
    return createUnknownCheckInFailure(error)
  }
  finally {
    inFlight = false
  }
}
