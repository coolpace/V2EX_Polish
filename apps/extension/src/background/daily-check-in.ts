import { StorageKey, V2EX } from '../constants'
import type {
  CheckInErrorCode,
  CheckInResult,
  DailyInfo,
} from '../types'
import { getStorage, setStorage } from '../utils'
import {
  getCheckInSkipReason,
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

function toErrorMessage(error: unknown): string {
  return getErrorInfo(error).message
}

/**
 * 请求签到页面并完成领取。
 */
async function requestCheckIn(): Promise<CheckInResult> {
  let res: Response

  try {
    res = await fetchWithTimeout(`${V2EX.Origin}/mission/daily`)
  }
  catch (error) {
    const { code, message } = getErrorInfo(error)

    return { status: 'failed', code, reason: `无法访问 V2EX：${message}` }
  }

  if (!res.ok) {
    return { status: 'failed', code: 'http', reason: `获取签到页面失败（HTTP ${res.status}）` }
  }

  let htmlText: string

  try {
    htmlText = await res.text()
  }
  catch (error) {
    const { code, message } = getErrorInfo(error)

    return { status: 'failed', code, reason: `读取签到页面失败：${message}` }
  }

  const page = parseCheckInPage(htmlText)

  if (page.type === 'already') {
    return { status: 'already', checkInDays: page.checkInDays }
  }

  if (page.type === 'unauthenticated') {
    return { status: 'failed', code: 'unauthenticated', reason: '未登录或登录状态已失效' }
  }

  if (page.type === 'unknown') {
    return { status: 'failed', code: 'unexpected-page', reason: '签到页面无法识别，V2EX 可能已改版' }
  }

  let checkInRes: Response

  try {
    checkInRes = await fetchWithTimeout(`${V2EX.Origin}${page.path}`)
  }
  catch (error) {
    const { code, message } = getErrorInfo(error)

    return { status: 'failed', code, reason: `领取请求失败：${message}` }
  }

  if (!checkInRes.ok) {
    return { status: 'failed', code: 'http', reason: `领取请求失败（HTTP ${checkInRes.status}）` }
  }

  let text: string

  try {
    text = await checkInRes.text()
  }
  catch (error) {
    const { code, message } = getErrorInfo(error)

    return { status: 'failed', code, reason: `读取领取结果失败：${message}` }
  }

  if (text.includes(SUCCESS_TEXT)) {
    return { status: 'success', checkInDays: parseCheckInDays(text) }
  }

  return { status: 'failed', code: 'redeem-failed', reason: '领取接口未返回成功提示' }
}

/**
 * 持久化签到状态，供 popup 展示与失败退避使用。
 */
async function saveDailyInfo(attemptTime: number, result: CheckInResult, previous?: DailyInfo) {
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

  dailyInfo.lastAttemptTime = attemptTime
  dailyInfo.lastResult = result.status === 'skipped' ? latest?.lastResult : result.status
  dailyInfo.lastError = result.status === 'failed' ? result.reason : undefined
  dailyInfo.lastErrorCode = result.status === 'failed' ? result.code : undefined

  await setStorage(StorageKey.Daily, dailyInfo)
}

/** 签到调用选项。 */
export interface CheckInOptions {
  /** 手动触发时忽略失败冷却。 */
  bypassRetryCooldown?: boolean
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
    await saveDailyInfo(attemptTime, result, dailyInfo)
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
      return { status: 'failed', code: 'unknown', reason: `签到失败：${toErrorMessage(error)}` }
    }
  }
  finally {
    inFlight = false
  }
}
