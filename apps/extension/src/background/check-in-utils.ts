import type {
  CheckInErrorCode,
  CheckInStage,
  CheckInTrigger,
  DailyInfo,
} from '../types'
import { formatTimestamp } from '../utils/date'

/** V2EX 领取成功后页面上的提示文案。 */
export const SUCCESS_TEXT = '每日登录奖励已领取'

/** V2EX 每日登录奖励重置点（UTC 00:00）后，等待一段时间再尝试，避免拿到重置前的页面状态。 */
export const REWARD_RESET_GRACE_MS = 5 * 60 * 1000

/** 一般失败后的重试冷却时间，避免高频请求触发 V2EX 限流。 */
export const FAILURE_RETRY_INTERVAL_MS = 30 * 60 * 1000

/** 未登录状态下的重试冷却时间，用户登录后可以较快恢复。 */
export const UNAUTHENTICATED_RETRY_INTERVAL_MS = 10 * 60 * 1000

/** 被人机验证拦截后的重试冷却时间，避免短时间内反复触发风控。 */
export const CHALLENGE_RETRY_INTERVAL_MS = 60 * 60 * 1000

/** 主页开始提醒签到异常前，同一天需要连续失败的次数。 */
export const CHECK_IN_FAILURE_PROMPT_THRESHOLD = 2

const DAY_MS = 24 * 60 * 60 * 1000

const redeemPathPattern = /\/mission\/daily\/redeem\?once=[\w-]+/
const checkInDaysPattern = /已连续登录\s*(\d+)\s*天/

/**
 * Cloudflare 人机验证页的特征片段。
 *
 * 只收录挑战页独有的标记，避免把正常页面里出现的通用词汇误判为风控。
 */
const challengeSignatures = [
  '_cf_chl_opt',
  'cf-browser-verification',
  'checking your browser before accessing',
  'enable javascript and cookies to continue',
  'just a moment...',
  'attention required! | cloudflare',
  'verifying you are human',
  '正在验证您是否是真人',
  '请完成安全验证',
]

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

/** 计算本次失败后的连续失败次数，跨 UTC 奖励日时重新计数。 */
export function getNextFailureCount(params: {
  previousCount?: number
  lastAttemptTime?: number
  attemptTime: number
}): number {
  const { previousCount, lastAttemptTime, attemptTime } = params
  const sameDayAsLastAttempt = lastAttemptTime
    ? getUtcDayKey(lastAttemptTime) === getUtcDayKey(attemptTime)
    : false

  return sameDayAsLastAttempt ? (previousCount ?? 0) + 1 : 1
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
    | { type: 'challenge' }
    | { type: 'unknown' }

/** 判断路径是否落在登录或注册页。 */
export function isSignInPath(path?: string): boolean {
  return path ? /^\/(signin|signup)\b/.test(path) : false
}

/** 判断页面内容是否为人机验证/风控拦截页。 */
export function isChallengePage(html: string): boolean {
  const content = html.toLowerCase()

  return challengeSignatures.some((signature) => content.includes(signature))
}

/**
 * 解析 /mission/daily 页面，判断接下来应该领取、已领取、未登录、被风控还是页面无法识别。
 *
 * 优先使用响应最终地址判断登录态：未登录时服务端会重定向到登录页，
 * 仅靠 HTML 里的登录链接容易因为页面变形而漏判。
 */
export function parseCheckInPage(html: string, finalUrlPath?: string): CheckInPageState {
  if (isSignInPath(finalUrlPath)) {
    return { type: 'unauthenticated' }
  }

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

  if (isChallengePage(html)) {
    return { type: 'challenge' }
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
    if (now - lastAttemptTime < getRetryInterval(lastErrorCode)) {
      return '上次签到失败，重试冷却中'
    }
  }

  return undefined
}

/** 按失败分类选择重试冷却时长。 */
function getRetryInterval(code?: CheckInErrorCode): number {
  if (code === 'unauthenticated') {
    return UNAUTHENTICATED_RETRY_INTERVAL_MS
  }

  if (code === 'challenge') {
    return CHALLENGE_RETRY_INTERVAL_MS
  }

  return FAILURE_RETRY_INTERVAL_MS
}

const errorCodeTextMap: Record<CheckInErrorCode, { title: string, hint: string }> = {
  timeout: { title: '签到请求超时', hint: '网络较慢或连接被拦截，点击重试' },
  network: { title: '网络异常', hint: '无法连接 V2EX，点击重试' },
  http: { title: '请求被 V2EX 拒绝', hint: '服务器返回异常状态，点击重试' },
  unauthenticated: { title: '登录状态已失效', hint: '请先登录 V2EX，再点击重试' },
  challenge: { title: '需要人机验证', hint: 'V2EX 正在验证浏览器，请打开签到页手动完成' },
  'unexpected-page': { title: '无法确认签到结果', hint: 'V2EX 返回了异常页面，点击重新核对' },
  'redeem-failed': { title: '无法确认领取结果', hint: '领取后未看到成功提示，点击重新核对' },
  unknown: { title: '签到失败', hint: '点击重试' },
}

const stageTextMap: Record<CheckInStage, string> = {
  'request-page': '请求签到页',
  'parse-page': '解析签到页',
  redeem: '发起领取请求',
  'parse-redeem': '解析领取结果',
}

const triggerTextMap: Record<CheckInTrigger, string> = {
  alarm: '定时任务',
  startup: '浏览器启动',
  tab: '打开 V2EX 页面',
  popup: '打开扩展弹窗',
  manual: '手动点击',
}

/** 获取失败分类对应的展示文案。 */
export function describeCheckInErrorCode(code?: CheckInErrorCode): { title: string, hint: string } {
  return code ? errorCodeTextMap[code] : errorCodeTextMap.unknown
}

/** 获取失败阶段的展示文案。 */
export function describeCheckInStage(stage?: CheckInStage): string {
  return stage ? stageTextMap[stage] : '未知'
}

/** 获取触发来源的展示文案。 */
export function describeCheckInTrigger(trigger?: CheckInTrigger): string {
  return trigger ? triggerTextMap[trigger] : '未知'
}

/** 签到卡片的展示状态。 */
export type CheckInDisplayState
  = | { type: 'checked-in', checkInTime: number, checkInDays?: number }
    | {
      type: 'failed'
      attemptTime: number
      code?: CheckInErrorCode
      reason?: string
      httpStatus?: number
    }
    | { type: 'not-attempted', skipReason?: string }
    | { type: 'auto-disabled' }

/**
 * 汇总 popup 需要的签到展示状态。
 *
 * 只有当天真正发起过请求才返回 failed，避免把前一天的失败当成今天的失败；
 * 关闭自动签到但今日已签到时仍视为已签到。
 */
export function resolveCheckInDisplayState(params: {
  now: number
  dailyInfo?: DailyInfo
  autoCheckInEnabled: boolean
}): CheckInDisplayState {
  const { now, dailyInfo, autoCheckInEnabled } = params
  const today = getUtcDayKey(now)
  const checkedInDay = dailyInfo?.lastCheckInDay
    ?? (dailyInfo?.lastCheckInTime ? getUtcDayKey(dailyInfo.lastCheckInTime) : undefined)

  if (checkedInDay === today) {
    return {
      type: 'checked-in',
      checkInTime: dailyInfo?.lastCheckInTime ?? dailyInfo?.lastAttemptTime ?? now,
      checkInDays: dailyInfo?.checkInDays,
    }
  }

  if (!autoCheckInEnabled) {
    return { type: 'auto-disabled' }
  }

  const lastAttemptTime = dailyInfo?.lastAttemptTime

  if (
    dailyInfo?.lastResult === 'failed'
    && lastAttemptTime
    && getUtcDayKey(lastAttemptTime) === today
  ) {
    return {
      type: 'failed',
      attemptTime: lastAttemptTime,
      code: dailyInfo.lastErrorCode,
      reason: dailyInfo.lastError,
      httpStatus: dailyInfo.lastHttpStatus,
    }
  }

  return {
    type: 'not-attempted',
    skipReason: getCheckInSkipReason({
      now,
      lastCheckInTime: dailyInfo?.lastCheckInTime,
      lastCheckInDay: dailyInfo?.lastCheckInDay,
      lastAttemptTime,
      lastResult: dailyInfo?.lastResult,
      lastErrorCode: dailyInfo?.lastErrorCode,
    }),
  }
}

/** 判断是否需要在主页提醒签到异常：同一天连续失败达到阈值。 */
export function shouldPromptCheckInFailure(
  state: CheckInDisplayState,
  failureCount?: number,
): boolean {
  return state.type === 'failed' && (failureCount ?? 0) >= CHECK_IN_FAILURE_PROMPT_THRESHOLD
}

/** 生成诊断文本所需的输入。 */
export interface CheckInDiagnosticInput {
  now: number
  dailyInfo?: DailyInfo
  autoCheckInEnabled: boolean
  extensionVersion: string
  /** 浏览器名称与版本描述。 */
  browser: string
  /** `Date#getTimezoneOffset` 的返回值。 */
  timezoneOffsetMinutes: number
}

function formatTimezone(offsetMinutes: number): string {
  const hours = -offsetMinutes / 60

  if (!Number.isFinite(hours)) {
    return 'UTC'
  }

  const sign = hours >= 0 ? '+' : '-'
  const abs = Math.abs(hours)
  const value = Number.isInteger(abs) ? String(abs) : abs.toFixed(1)

  return `UTC${sign}${value}`
}

/**
 * 生成可直接粘贴到问题反馈中的签到诊断文本。
 *
 * 只包含签到状态与技术元数据，不含账号、Cookie 或页面原文。
 */
export function buildCheckInDiagnostic(input: CheckInDiagnosticInput): string {
  const {
    now,
    dailyInfo,
    autoCheckInEnabled,
    extensionVersion,
    browser,
    timezoneOffsetMinutes,
  } = input

  const state = resolveCheckInDisplayState({ now, dailyInfo, autoCheckInEnabled })
  const stateText: Record<CheckInDisplayState['type'], string> = {
    'checked-in': '今日已签到',
    failed: '签到失败',
    'not-attempted': '今日尚未签到',
    'auto-disabled': '自动签到已关闭',
  }

  const lines = [
    'V2EX Polish 签到诊断',
    `生成时间：${formatTimestamp(now, { format: 'YMDHMS' })}（${formatTimezone(timezoneOffsetMinutes)}）`,
    `扩展版本：${extensionVersion}`,
    `浏览器：${browser}`,
    `自动签到：${autoCheckInEnabled ? '已开启' : '已关闭'}`,
    `今日状态：${stateText[state.type]}`,
  ]

  if (state.type === 'not-attempted' && state.skipReason) {
    lines.push(`跳过原因：${state.skipReason}`)
  }

  if (state.type === 'failed') {
    lines.push(
      `失败分类：${state.code ?? 'unknown'}（${describeCheckInErrorCode(state.code).title}）`,
      `失败阶段：${describeCheckInStage(dailyInfo?.lastErrorStage)}`,
    )

    if (state.reason) {
      lines.push(`失败原因：${state.reason}`)
    }
  }

  if (dailyInfo?.lastHttpStatus !== undefined) {
    lines.push(`HTTP 状态：${dailyInfo.lastHttpStatus}`)
  }

  if (dailyInfo?.lastFinalUrlPath) {
    lines.push(`最终地址：${dailyInfo.lastFinalUrlPath}`)
  }

  if (dailyInfo?.lastDurationMs !== undefined) {
    lines.push(`请求耗时：${dailyInfo.lastDurationMs} ms`)
  }

  if (dailyInfo?.lastTrigger) {
    lines.push(`触发来源：${describeCheckInTrigger(dailyInfo.lastTrigger)}`)
  }

  if (dailyInfo?.lastAttemptTime) {
    lines.push(`最近尝试：${formatTimestamp(dailyInfo.lastAttemptTime, { format: 'YMDHMS' })}`)
  }

  if (dailyInfo?.lastCheckInTime) {
    lines.push(`最近成功：${formatTimestamp(dailyInfo.lastCheckInTime, { format: 'YMDHMS' })}`)
  }

  if (dailyInfo?.checkInDays !== undefined) {
    lines.push(`连续登录：${dailyInfo.checkInDays} 天`)
  }

  lines.push(`原始记录：${JSON.stringify(dailyInfo ?? {})}`)

  return lines.join('\n')
}
