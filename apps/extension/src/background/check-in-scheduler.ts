import type {
  CheckInErrorCode,
  CheckInResult,
  CheckInRetryCause,
  CheckInTrigger,
  DailyInfo,
} from '../types'
import { getUtcDayKey, getUtcDayStart, REWARD_RESET_GRACE_MS } from './check-in-utils'

const DAY_MS = 24 * 60 * 60 * 1000

/** V2EX 奖励日重置后，正常情况下开始签到前的固定等待时间。 */
export const CHECK_IN_TARGET_GRACE_MS = REWARD_RESET_GRACE_MS

/** 每日签到目标时间的最大随机抖动，避免用户在同一秒集中请求。 */
export const CHECK_IN_TARGET_JITTER_MAX_MS = 3 * 60 * 1000

/** 用户操作或联网事件触发网络重试前的最小间隔。 */
export const CHECK_IN_NUDGE_INTERVAL_MS = 60 * 1000

export const CHECK_IN_STATE_SCHEMA_VERSION = 3

const NETWORK_RETRY_DELAYS = [1 * 60 * 1000, 5 * 60 * 1000, 15 * 60 * 1000, 30 * 60 * 1000]

const SERVER_RETRY_DELAYS = [5 * 60 * 1000, 15 * 60 * 1000, 30 * 60 * 1000, 60 * 60 * 1000]

const UNEXPECTED_PAGE_RETRY_DELAYS = [5 * 60 * 1000, 15 * 60 * 1000]
const AMBIGUOUS_RETRY_DELAYS = [2 * 60 * 1000, 10 * 60 * 1000]
const UNKNOWN_RETRY_DELAYS = [5 * 60 * 1000, 15 * 60 * 1000, 30 * 60 * 1000]

const NUDGE_TRIGGERS = new Set<CheckInTrigger>(['refresh', 'online', 'popup'])

interface FailurePlan {
  cause: CheckInRetryCause
  delayMs?: number
  needsAction?: boolean
  userMessage?: string
}

function isFailureResult(result: CheckInResult): result is CheckInResult & {
  status: 'failed'
  code: CheckInErrorCode
} {
  return result.status === 'failed' && result.code !== undefined
}

function getDelay(delays: number[], failureCount: number): number {
  return delays[Math.min(Math.max(failureCount - 1, 0), delays.length - 1)]
}

function createTargetAt(now: number, jitterMs: number): number {
  const normalizedJitter = Math.max(
    0,
    Math.min(Number.isFinite(jitterMs) ? jitterMs : 0, CHECK_IN_TARGET_JITTER_MAX_MS),
  )

  return getUtcDayStart(now) + CHECK_IN_TARGET_GRACE_MS + normalizedJitter
}

/** 规范化 V2EX 用户名；空值表示当前页面没有可用的账号身份。 */
export function normalizeMemberName(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }

  const memberName = value.trim()

  return memberName || undefined
}

/** 判断持久化状态是否明确属于某个 V2EX 用户。 */
export function isCheckInStateForMember(
  state: DailyInfo | undefined,
  memberName: string,
): state is DailyInfo & { schemaVersion: 3, memberName: string } {
  const normalizedMemberName = normalizeMemberName(memberName)

  return (
    !!normalizedMemberName
    && state?.schemaVersion === CHECK_IN_STATE_SCHEMA_VERSION
    && state.memberName === normalizedMemberName
  )
}

/** 判断异步签到结果是否仍可写回发起请求时的账号。 */
export function isCheckInAttemptStillCurrent(params: {
  startedAccountRevision: number
  currentAccountRevision: number
  startedState: DailyInfo
  latestState?: DailyInfo
}): boolean {
  const {
    startedAccountRevision,
    currentAccountRevision,
    startedState,
    latestState,
  } = params

  if (startedAccountRevision !== currentAccountRevision) {
    return false
  }

  const startedMemberName = normalizeMemberName(startedState.memberName)

  return startedMemberName
    ? isCheckInStateForMember(latestState, startedMemberName)
    : !normalizeMemberName(latestState?.memberName)
}

function createScheduledState(
  memberName: string | undefined,
  now: number,
  jitterMs: number,
): DailyInfo {
  const targetAt = createTargetAt(now, jitterMs)

  return {
    schemaVersion: CHECK_IN_STATE_SCHEMA_VERSION,
    ...memberName ? { memberName } : {},
    rewardDay: getUtcDayKey(now),
    phase: 'scheduled',
    targetAt,
    nextActionAt: targetAt,
    attemptCount: 0,
    failureCount: 0,
  }
}

/** 为账号切换创建一个不带旧账号历史的全新状态。 */
export function createCheckInStateForMember(
  memberName: string,
  now: number,
  jitterMs = Math.random() * CHECK_IN_TARGET_JITTER_MAX_MS,
): DailyInfo {
  const normalizedMemberName = normalizeMemberName(memberName)

  if (!normalizedMemberName) {
    throw new Error('无法创建缺少用户名的签到状态')
  }

  return createScheduledState(normalizedMemberName, now, jitterMs)
}

/**
 * 将旧版 DailyInfo 或新状态归一化为当前 UTC 奖励日的状态。
 */
export function normalizeCheckInState(
  previous: DailyInfo | undefined,
  now: number,
  jitterMs = Math.random() * CHECK_IN_TARGET_JITTER_MAX_MS,
): DailyInfo {
  const rewardDay = getUtcDayKey(now)
  const memberName = normalizeMemberName(previous?.memberName)

  // 旧版状态没有账号归属，不能继续用于跳过当前账号的签到。
  if (previous?.schemaVersion !== CHECK_IN_STATE_SCHEMA_VERSION || !memberName) {
    return createScheduledState(undefined, now, jitterMs)
  }

  const checkedInDay
    = previous?.lastCheckInDay
      ?? (previous?.lastCheckInTime ? getUtcDayKey(previous.lastCheckInTime) : undefined)

  if (
    previous?.schemaVersion === CHECK_IN_STATE_SCHEMA_VERSION
    && previous.rewardDay === rewardDay
    && previous.phase === 'succeeded'
    && checkedInDay === rewardDay
  ) {
    return previous
  }

  if (checkedInDay === rewardDay) {
    return {
      ...previous,
      schemaVersion: CHECK_IN_STATE_SCHEMA_VERSION,
      rewardDay,
      phase: 'succeeded',
      failureCount: 0,
      nextActionAt: undefined,
      nudgeEligibleAt: undefined,
      retryCause: undefined,
      userMessage: undefined,
    }
  }

  if (
    previous?.schemaVersion === CHECK_IN_STATE_SCHEMA_VERSION
    && previous.rewardDay === rewardDay
  ) {
    return previous
  }

  const targetAt = createTargetAt(now, jitterMs)
  const state: DailyInfo = {
    ...previous,
    schemaVersion: CHECK_IN_STATE_SCHEMA_VERSION,
    rewardDay,
    phase: 'scheduled',
    targetAt,
    nextActionAt: targetAt,
    nudgeEligibleAt: undefined,
    attemptCount: 0,
    failureCount: 0,
    retryCause: undefined,
    userMessage: undefined,
  }

  if (
    previous?.lastResult === 'failed'
    && previous.lastAttemptTime
    && getUtcDayKey(previous.lastAttemptTime) === rewardDay
  ) {
    const failureCount = Math.max(previous.failureCount ?? 1, 1)
    const plan = getFailurePlan(
      previous.lastErrorCode ?? 'unknown',
      previous.lastHttpStatus,
      failureCount,
      undefined,
    )
    const dayEnd = getUtcDayStart(now) + DAY_MS

    state.failureCount = failureCount
    state.retryCause = plan.cause
    state.userMessage = plan.userMessage

    if (plan.needsAction) {
      state.phase = 'needs-action'
      state.nextActionAt = undefined
    }
    else {
      state.nextActionAt = Math.min(
        previous.lastAttemptTime + (plan.delayMs ?? 5 * 60 * 1000),
        dayEnd,
      )
    }

    if (plan.cause === 'transient' || plan.needsAction) {
      state.nudgeEligibleAt = Math.min(
        previous.lastAttemptTime + CHECK_IN_NUDGE_INTERVAL_MS,
        dayEnd,
      )
    }
  }

  return state
}

export type CheckInScheduleDecision
  = | { action: 'run', force: boolean, state: DailyInfo }
    | { action: 'skip', reason: string, state: DailyInfo }

/** 返回下一次 alarm 时间；没有可执行任务时返回 undefined。 */
export function getCheckInAlarmTime(
  state: DailyInfo,
  autoCheckInEnabled: boolean,
): number | undefined {
  if (!autoCheckInEnabled || state.phase !== 'scheduled' || state.nextActionAt === undefined) {
    return undefined
  }

  return state.nextActionAt
}

interface ScheduleDecisionParams {
  now: number
  state: DailyInfo
  autoCheckInEnabled: boolean
  trigger: CheckInTrigger
  force?: boolean
}

/**
 * 由唯一调度入口判断当前触发是否应该执行签到。
 */
export function getCheckInScheduleDecision(
  params: ScheduleDecisionParams,
): CheckInScheduleDecision {
  const { now, state, autoCheckInEnabled, trigger, force = false } = params

  if (
    state.phase === 'succeeded'
    && state.schemaVersion === CHECK_IN_STATE_SCHEMA_VERSION
    && normalizeMemberName(state.memberName)
  ) {
    return { action: 'skip', reason: '今日已签到', state }
  }

  if (!autoCheckInEnabled && !force) {
    return { action: 'skip', reason: '自动签到已关闭', state }
  }

  if (force) {
    return { action: 'run', force: true, state }
  }

  if (state.phase === 'needs-action') {
    const canRecheck
      = NUDGE_TRIGGERS.has(trigger)
        && state.nudgeEligibleAt !== undefined
        && now >= state.nudgeEligibleAt

    return canRecheck
      ? { action: 'run', force: false, state }
      : {
          action: 'skip',
          reason: state.userMessage ?? '需要先处理签到异常',
          state,
        }
  }

  if (state.nextActionAt !== undefined && now >= state.nextActionAt) {
    return { action: 'run', force: false, state }
  }

  const nudgeCanAccelerate
    = NUDGE_TRIGGERS.has(trigger)
      && state.nudgeEligibleAt !== undefined
      && now >= state.nudgeEligibleAt
      && state.retryCause === 'transient'

  if (nudgeCanAccelerate) {
    return { action: 'run', force: false, state }
  }

  return { action: 'skip', reason: '尚未到下次签到时间', state }
}

function getFailurePlan(
  code: CheckInErrorCode,
  httpStatus: number | undefined,
  failureCount: number,
  retryAfterMs: number | undefined,
): FailurePlan {
  if (code === 'network' || code === 'timeout') {
    return {
      cause: 'transient',
      delayMs: getDelay(NETWORK_RETRY_DELAYS, failureCount),
    }
  }

  if (code === 'unauthenticated') {
    return {
      cause: 'authentication',
      needsAction: true,
      userMessage: '登录状态已失效，请登录 V2EX 后重试',
    }
  }

  if (code === 'challenge') {
    return {
      cause: 'challenge',
      needsAction: true,
      userMessage: 'V2EX 需要人机验证，请打开签到页手动完成',
    }
  }

  if (httpStatus === 429) {
    return {
      cause: 'rate-limited',
      delayMs: retryAfterMs ?? 60 * 60 * 1000,
    }
  }

  if (httpStatus === 403) {
    if (failureCount >= 2) {
      return {
        cause: 'forbidden',
        needsAction: true,
        userMessage: 'V2EX 拒绝了请求，请检查风控状态后重试',
      }
    }

    return { cause: 'forbidden', delayMs: 60 * 60 * 1000 }
  }

  const isServerError = httpStatus !== undefined && httpStatus >= 500

  if (httpStatus === 408 || isServerError) {
    return {
      cause: 'server',
      delayMs: getDelay(SERVER_RETRY_DELAYS, failureCount),
    }
  }

  if (code === 'unexpected-page') {
    if (failureCount >= 2) {
      return {
        cause: 'unexpected-page',
        needsAction: true,
        userMessage: '签到页面连续无法识别，请打开签到页核对',
      }
    }

    return {
      cause: 'unexpected-page',
      delayMs: getDelay(UNEXPECTED_PAGE_RETRY_DELAYS, failureCount),
    }
  }

  if (code === 'redeem-failed') {
    if (failureCount >= 2) {
      return {
        cause: 'ambiguous',
        needsAction: true,
        userMessage: '无法确认领取结果，请打开签到页核对',
      }
    }

    return {
      cause: 'ambiguous',
      delayMs: getDelay(AMBIGUOUS_RETRY_DELAYS, failureCount),
    }
  }

  return {
    cause: code === 'http' ? 'server' : 'unknown',
    delayMs:
      code === 'http'
        ? getDelay(SERVER_RETRY_DELAYS, failureCount)
        : getDelay(UNKNOWN_RETRY_DELAYS, failureCount),
  }
}

interface BuildDailyInfoParams {
  previous: DailyInfo | undefined
  result: CheckInResult
  attemptTime: number
  finishedAt: number
  trigger: CheckInTrigger
  jitterMs?: number
}

/**
 * 根据一次真实请求的结果生成下一份持久化签到状态。
 */
export function buildDailyInfoAfterAttempt({
  previous,
  result,
  attemptTime,
  finishedAt,
  trigger,
  jitterMs,
}: BuildDailyInfoParams): DailyInfo {
  const state = { ...normalizeCheckInState(previous, attemptTime, jitterMs) }

  state.lastAttemptTime = attemptTime
  state.lastFinishedAt = finishedAt
  state.lastResult = result.status === 'skipped' ? state.lastResult : result.status
  state.lastTrigger = trigger
  state.attemptCount = (state.attemptCount ?? 0) + 1
  state.lastHttpStatus = result.httpStatus
  state.lastFinalUrlPath = result.finalUrlPath
  state.lastDurationMs = result.durationMs ?? Math.max(0, finishedAt - attemptTime)

  if (result.status === 'success' || result.status === 'already') {
    const checkInTime = Math.max(state.lastCheckInTime ?? 0, attemptTime)

    state.lastCheckInTime = checkInTime
    state.lastCheckInDay = getUtcDayKey(checkInTime)
    state.checkInDays = result.checkInDays ?? state.checkInDays
    state.phase = 'succeeded'
    state.failureCount = 0
    state.lastError = undefined
    state.lastErrorCode = undefined
    state.lastErrorStage = undefined
    state.nextActionAt = undefined
    state.nudgeEligibleAt = undefined
    state.retryCause = undefined
    state.userMessage = undefined

    return state
  }

  if (!isFailureResult(result)) {
    return state
  }

  const failureCount = (state.failureCount ?? 0) + 1
  const plan = getFailurePlan(result.code, result.httpStatus, failureCount, result.retryAfterMs)
  const dayEnd = getUtcDayStart(finishedAt) + DAY_MS

  state.failureCount = failureCount
  state.lastError = result.reason
  state.lastErrorCode = result.code
  state.lastErrorStage = result.stage
  state.retryCause = plan.cause
  state.userMessage = plan.userMessage

  if (plan.needsAction) {
    state.phase = 'needs-action'
    state.nextActionAt = undefined
  }
  else {
    state.phase = 'scheduled'
    state.nextActionAt = Math.min(finishedAt + (plan.delayMs ?? 5 * 60 * 1000), dayEnd)
  }

  state.nudgeEligibleAt
    = plan.cause === 'transient' || plan.needsAction
      ? Math.min(finishedAt + CHECK_IN_NUDGE_INTERVAL_MS, dayEnd)
      : undefined

  return state
}
