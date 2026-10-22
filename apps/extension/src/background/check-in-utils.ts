import type { DailyInfo } from '../types'

/** V2EX 领取成功后页面上的提示文案。 */
export const SUCCESS_TEXT = '每日登录奖励已领取'

/** V2EX 每日登录奖励重置点（UTC 00:00）后，等待一段时间再尝试，避免拿到重置前的页面状态。 */
export const REWARD_RESET_GRACE_MS = 5 * 60 * 1000

/** 一般失败后的重试冷却时间，避免高频请求触发 V2EX 限流。 */
export const FAILURE_RETRY_INTERVAL_MS = 30 * 60 * 1000

/** 未登录状态下的重试冷却时间，用户登录后可以较快恢复。 */
export const UNAUTHENTICATED_RETRY_INTERVAL_MS = 10 * 60 * 1000

const DAY_MS = 24 * 60 * 60 * 1000

const redeemPathPattern = /\/mission\/daily\/redeem\?once=[\w-]+/
const checkInDaysPattern = /已连续登录\s*(\d+)\s*天/

/**
 * 获取时间戳对应的 UTC 日期键，例如 `2026-10-22`。
 *
 * V2EX 的每日登录奖励按 UTC 日期计算，重置点为 UTC 00:00（北京时间 08:00），
 * 因此与奖励日相关的判断必须使用 UTC 日期。
 */
export function getUtcDayKey(timestamp: number): string {
  const date = new Date(timestamp)

  return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`
}

/** 获取时间戳所在 UTC 日期的起点（UTC 00:00）。 */
export function getUtcDayStart(timestamp: number): number {
  return Math.floor(timestamp / DAY_MS) * DAY_MS
}

/**
 * 从签到页面 HTML 中提取领取链接。
 *
 * 同时兼容单引号和双引号属性写法，避免依赖页面的具体格式。
 */
export function extractRedeemPath(html: string): string | null {
  return html.match(redeemPathPattern)?.[0] ?? null
}

/** 从签到页面文本中解析已连续登录天数。 */
export function parseCheckInDays(text: string): number | undefined {
  const matchedArr = text.match(checkInDaysPattern)

  if (!matchedArr) {
    return undefined
  }

  const days = Number(matchedArr[1])

  return Number.isNaN(days) ? undefined : days
}

/** 签到页面的解析结果。 */
export type CheckInPageState
  = | { type: 'redeem', path: string }
    | { type: 'already', checkInDays?: number }
    | { type: 'unauthenticated' }
    | { type: 'unknown' }

/**
 * 解析 /mission/daily 页面，判断接下来应该领取、已领取、未登录还是页面无法识别。
 */
export function parseCheckInPage(html: string): CheckInPageState {
  const redeemPath = extractRedeemPath(html)

  if (redeemPath) {
    return { type: 'redeem', path: redeemPath }
  }

  if (html.includes(SUCCESS_TEXT)) {
    return { type: 'already', checkInDays: parseCheckInDays(html) }
  }

  if (html.includes('/signin?next=')) {
    return { type: 'unauthenticated' }
  }

  return { type: 'unknown' }
}

interface SkipCheckParams {
  now: number
  lastCheckInTime?: number
  lastCheckInDay?: string
  lastAttemptTime?: number
  lastResult?: DailyInfo['lastResult']
  lastErrorCode?: DailyInfo['lastErrorCode']
  /** 手动触发时忽略失败冷却。 */
  bypassRetryCooldown?: boolean
}

/**
 * 判断本次是否需要发起签到请求，返回跳过原因。
 */
export function getCheckInSkipReason(params: SkipCheckParams): string | undefined {
  const {
    now,
    lastCheckInTime,
    lastCheckInDay,
    lastAttemptTime,
    lastResult,
    lastErrorCode,
    bypassRetryCooldown,
  } = params

  // 新数据直接使用奖励日字段；旧数据回退到时间戳的 UTC 日期。
  const checkedInDay = lastCheckInDay
    ?? (lastCheckInTime ? getUtcDayKey(lastCheckInTime) : undefined)

  if (checkedInDay && checkedInDay === getUtcDayKey(now)) {
    return '今日已签到'
  }

  if (now - getUtcDayStart(now) < REWARD_RESET_GRACE_MS) {
    return '等待 V2EX 奖励日重置'
  }

  if (!bypassRetryCooldown && lastResult === 'failed' && lastAttemptTime) {
    const retryInterval = lastErrorCode === 'unauthenticated'
      ? UNAUTHENTICATED_RETRY_INTERVAL_MS
      : FAILURE_RETRY_INTERVAL_MS

    if (now - lastAttemptTime < retryInterval) {
      return '上次签到失败，重试冷却中'
    }
  }

  return undefined
}
