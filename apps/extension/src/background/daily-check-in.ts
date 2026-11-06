import { StorageKey, V2EX } from '../constants'
import type { CheckInErrorCode, CheckInResult, CheckInStage, CheckInTrigger } from '../types'
import { getStorage, setStorage } from '../utils'
import { createSerialQueue } from '../utils/async'
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
import { parseCheckInDays, parseCheckInPage, SUCCESS_TEXT } from './check-in-utils'

const checkInTimeout = 15 * 1000

/** 同一时间只允许一个签到任务，避免 alarm 与 popup 触发并发请求。 */
let inFlight = false

/** 账号每次切换都会递增，用于丢弃绑定到旧账号的异步签到结果。 */
let accountRevision = 0

/** 串行执行账号观察和签到状态写入，避免并发请求读取到同一份旧状态。 */
const enqueueStateTransition = createSerialQueue()

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), checkInTimeout)

  try {
    return await fetch(url, {
      headers: {
        Referer: `${V2EX.Origin}/mission/daily`,
      },
      credentials: 'include',
      cache: 'no-store',
      signal: controller.signal,
    })
  }
  finally {
    clearTimeout(timeoutId)
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

/**
 * 请求签到页面并完成领取。
 */
async function requestCheckInInner(): Promise<CheckInResult> {
  let res: Response

  try {
    res = await fetchWithTimeout(`${V2EX.Origin}/mission/daily`)
  }
  catch (error) {
    const { code, message } = getErrorInfo(error)

    return fail(code, 'request-page', `无法访问 V2EX：${message}`)
  }

  const pageMeta: CheckInResponseMeta = {
    httpStatus: res.status,
    finalUrlPath: getUrlPath(res.url),
    retryAfterMs: res.status === 429 ? parseRetryAfter(res.headers.get('retry-after')) : undefined,
  }

  // Cloudflare 人机验证会在响应头标记，需要先于状态码判断。
  if (res.headers.get('cf-mitigated')?.toLowerCase() === 'challenge') {
    return fail('challenge', 'request-page', 'V2EX 触发了人机验证，无法自动签到', pageMeta)
  }

  if (!res.ok) {
    return fail(
      'http',
      'request-page',
      `获取签到页面失败：${describeHttpFailure(res.status)}（HTTP ${res.status}）`,
      pageMeta,
    )
  }

  let htmlText: string

  try {
    htmlText = await res.text()
  }
  catch (error) {
    const { code, message } = getErrorInfo(error)

    return fail(code, 'request-page', `读取签到页面失败：${message}`, pageMeta)
  }

  const page = parseCheckInPage(htmlText, pageMeta.finalUrlPath)

  if (page.type === 'already') {
    return { status: 'already', checkInDays: page.checkInDays, ...pageMeta }
  }

  if (page.type === 'unauthenticated') {
    return fail('unauthenticated', 'parse-page', '未登录或登录状态已失效', pageMeta)
  }

  if (page.type === 'challenge') {
    return fail('challenge', 'parse-page', 'V2EX 触发了人机验证，无法自动签到', pageMeta)
  }

  if (page.type === 'unknown') {
    return fail('unexpected-page', 'parse-page', '签到页面无法识别，V2EX 可能已改版', pageMeta)
  }

  let checkInRes: Response

  try {
    checkInRes = await fetchWithTimeout(`${V2EX.Origin}${page.path}`)
  }
  catch (error) {
    const { code, message } = getErrorInfo(error)

    return fail(code, 'redeem', `领取请求失败：${message}`)
  }

  const redeemMeta: CheckInResponseMeta = {
    httpStatus: checkInRes.status,
    finalUrlPath: getUrlPath(checkInRes.url),
    retryAfterMs:
      checkInRes.status === 429
        ? parseRetryAfter(checkInRes.headers.get('retry-after'))
        : undefined,
  }

  if (!checkInRes.ok) {
    return fail(
      'http',
      'redeem',
      `领取请求失败：${describeHttpFailure(checkInRes.status)}（HTTP ${checkInRes.status}）`,
      redeemMeta,
    )
  }

  let text: string

  try {
    text = await checkInRes.text()
  }
  catch (error) {
    const { code, message } = getErrorInfo(error)

    return fail(code, 'redeem', `读取领取结果失败：${message}`, redeemMeta)
  }

  if (text.includes(SUCCESS_TEXT)) {
    return { status: 'success', checkInDays: parseCheckInDays(text), ...redeemMeta }
  }

  return fail('redeem-failed', 'parse-redeem', '领取接口未返回成功提示', redeemMeta)
}

/** 在失败结果上补充本次请求耗时，便于区分超时与快速失败。 */
async function requestCheckIn(): Promise<CheckInResult> {
  const startedAt = Date.now()
  const result = await requestCheckInInner()

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
