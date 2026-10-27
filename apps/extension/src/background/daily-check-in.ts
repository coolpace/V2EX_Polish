import { StorageKey, V2EX } from '../constants'
import type {
  CheckInErrorCode,
  CheckInResult,
  CheckInStage,
  CheckInTrigger,
  DailyInfo,
} from '../types'
import { getStorage, setStorage } from '../utils'
import {
  getCheckInSkipReason,
  getNextFailureCount,
  getUtcDayKey,
  parseCheckInDays,
  parseCheckInPage,
  SUCCESS_TEXT,
} from './check-in-utils'

const checkInTimeout = 15 * 1000

/** 同一时间只允许一个签到任务，避免 alarm 与 popup 触发并发请求。 */
let inFlight = false

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
type CheckInResponseMeta = Pick<CheckInResult, 'httpStatus' | 'finalUrlPath'>

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

/**
 * 持久化签到状态，供 popup 展示与失败退避使用。
 */
async function saveDailyInfo(
  attemptTime: number,
  result: CheckInResult,
  trigger: CheckInTrigger | undefined,
  previous?: DailyInfo,
) {
  // 保存前重新读取，避免覆盖并发写入的签到结果（例如多设备同步）。
  let latest = previous

  try {
    latest = (await getStorage(false))[StorageKey.Daily] ?? previous
  }
  catch {
    // 读取失败时退回请求前的快照。
  }

  const dailyInfo: DailyInfo = { ...latest }

  if (result.status === 'success' || result.status === 'already') {
    // 使用请求发起时间并保留更晚的确认时间，避免跨 UTC 零点或并发时记错奖励日。
    const checkInTime = Math.max(latest?.lastCheckInTime ?? 0, attemptTime)

    dailyInfo.lastCheckInTime = checkInTime
    dailyInfo.lastCheckInDay = getUtcDayKey(checkInTime)
    dailyInfo.checkInDays = result.checkInDays ?? latest?.checkInDays ?? previous?.checkInDays
  }

  const failed = result.status === 'failed'

  if (failed) {
    dailyInfo.failureCount = getNextFailureCount({
      previousCount: latest?.failureCount,
      lastAttemptTime: latest?.lastAttemptTime,
      attemptTime,
    })
  }
  else {
    dailyInfo.failureCount = 0
  }

  dailyInfo.lastAttemptTime = attemptTime
  dailyInfo.lastResult = result.status === 'skipped' ? latest?.lastResult : result.status
  dailyInfo.lastError = failed ? result.reason : undefined
  dailyInfo.lastErrorCode = failed ? result.code : undefined
  dailyInfo.lastErrorStage = failed ? result.stage : undefined
  dailyInfo.lastHttpStatus = result.httpStatus
  dailyInfo.lastFinalUrlPath = result.finalUrlPath
  dailyInfo.lastDurationMs = result.durationMs
  dailyInfo.lastTrigger = trigger

  await setStorage(StorageKey.Daily, dailyInfo)
}

/** 签到调用选项。 */
export interface CheckInOptions {
  /** 手动触发时忽略失败冷却。 */
  bypassRetryCooldown?: boolean
  /** 触发来源，仅用于诊断记录。 */
  trigger?: CheckInTrigger
}

/**
 * 读取配置后执行签到，并将任何未预期的异常统一转换为失败结果。
 */
async function runCheckIn(options: CheckInOptions): Promise<CheckInResult> {
  const storage = await getStorage(false)
  const dailyInfo = storage[StorageKey.Daily]

  const skipReason = getCheckInSkipReason({
    now: Date.now(),
    lastCheckInTime: dailyInfo?.lastCheckInTime,
    lastCheckInDay: dailyInfo?.lastCheckInDay,
    lastAttemptTime: dailyInfo?.lastAttemptTime,
    lastResult: dailyInfo?.lastResult,
    lastErrorCode: dailyInfo?.lastErrorCode,
    bypassRetryCooldown: options.bypassRetryCooldown,
  })

  if (skipReason) {
    return { status: 'skipped', reason: skipReason }
  }

  const attemptTime = Date.now()
  const result = await requestCheckIn()

  try {
    await saveDailyInfo(attemptTime, result, options.trigger, dailyInfo)
  }
  catch (error) {
    // 状态写入失败不应影响已完成的领取。
    console.warn('[V2EX Polish] 保存签到状态失败：', error)
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
    return { status: 'skipped', reason: '已有签到任务进行中' }
  }

  inFlight = true

  try {
    try {
      return await runCheckIn(options)
    }
    catch (error) {
      const { message } = getErrorInfo(error)

      return { status: 'failed', code: 'unknown', reason: `签到失败：${message}` }
    }
  }
  finally {
    inFlight = false
  }
}
