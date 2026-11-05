import { describe, expect, it } from 'vitest'

import {
  buildDailyInfoAfterAttempt,
  CHECK_IN_NUDGE_INTERVAL_MS,
  CHECK_IN_TARGET_GRACE_MS,
  CHECK_IN_TARGET_JITTER_MAX_MS,
  getCheckInAlarmTime,
  getCheckInScheduleDecision,
  normalizeCheckInState,
} from '../apps/extension/src/background/check-in-scheduler'
import type { CheckInResult } from '../apps/extension/src/types'

const DAY = 24 * 60 * 60 * 1000
const now = Date.UTC(2026, 10, 5, 0, 10)

function failed(code: CheckInResult['code'], httpStatus?: number): CheckInResult {
  return {
    status: 'failed',
    code,
    httpStatus,
    stage: 'request-page',
    reason: 'failed',
  }
}

describe('normalizeCheckInState', () => {
  it('为新奖励日安排带随机抖动的目标时间', () => {
    const state = normalizeCheckInState(undefined, now, 120_000)
    const dayStart = Math.floor(now / DAY) * DAY

    expect(state.schemaVersion).toBe(2)
    expect(state.rewardDay).toBe('2026-11-5')
    expect(state.phase).toBe('scheduled')
    expect(state.targetAt).toBe(dayStart + CHECK_IN_TARGET_GRACE_MS + 120_000)
    expect(state.nextActionAt).toBe(state.targetAt)
  })

  it('随机抖动不会超过三分钟', () => {
    const state = normalizeCheckInState(undefined, now, CHECK_IN_TARGET_JITTER_MAX_MS * 2)
    const dayStart = Math.floor(now / DAY) * DAY

    expect(state.targetAt).toBe(dayStart + CHECK_IN_TARGET_GRACE_MS + CHECK_IN_TARGET_JITTER_MAX_MS)
  })

  it('已有当日成功记录时直接进入完成状态', () => {
    const lastCheckInTime = Date.UTC(2026, 10, 5, 0, 1)
    const state = normalizeCheckInState(
      {
        lastCheckInTime,
        lastCheckInDay: '2026-11-5',
        lastResult: 'success',
        checkInDays: 10,
      },
      now,
    )

    expect(state.phase).toBe('succeeded')
    expect(state.nextActionAt).toBeUndefined()
    expect(state.checkInDays).toBe(10)
  })

  it('跨 UTC 日重新安排签到并保留历史成功信息', () => {
    const state = normalizeCheckInState(
      {
        schemaVersion: 2,
        rewardDay: '2026-11-4',
        phase: 'succeeded',
        lastCheckInTime: Date.UTC(2026, 10, 4, 8),
        lastCheckInDay: '2026-11-4',
        checkInDays: 11,
      },
      now,
      0,
    )

    expect(state.rewardDay).toBe('2026-11-5')
    expect(state.phase).toBe('scheduled')
    expect(state.failureCount).toBe(0)
    expect(state.lastCheckInDay).toBe('2026-11-4')
    expect(state.checkInDays).toBe(11)
  })

  it('迁移同日旧失败记录时按新网络策略重排', () => {
    const lastAttemptTime = Date.UTC(2026, 10, 5, 0, 7)
    const state = normalizeCheckInState(
      {
        lastAttemptTime,
        lastResult: 'failed',
        lastErrorCode: 'network',
        lastCheckInDay: '2026-11-4',
      },
      now,
      0,
    )

    expect(state.schemaVersion).toBe(2)
    expect(state.nextActionAt).toBe(lastAttemptTime + 60_000)
    expect(state.nudgeEligibleAt).toBe(lastAttemptTime + 60_000)
  })
})

describe('getCheckInScheduleDecision', () => {
  const state = normalizeCheckInState(undefined, now, 0)

  it('到达目标时间后允许自动执行', () => {
    expect(
      getCheckInScheduleDecision({
        now: state.targetAt!,
        state,
        autoCheckInEnabled: true,
        trigger: 'alarm',
      }),
    ).toMatchObject({ action: 'run', force: false })
  })

  it('未到目标时间时刷新页面不会发请求', () => {
    expect(
      getCheckInScheduleDecision({
        now: state.targetAt! - 1,
        state,
        autoCheckInEnabled: true,
        trigger: 'refresh',
      }),
    ).toMatchObject({ action: 'skip', reason: '尚未到下次签到时间' })
  })

  it('手动重试可以绕过等待但不会重复已确认的当天签到', () => {
    expect(
      getCheckInScheduleDecision({
        now,
        state,
        autoCheckInEnabled: false,
        trigger: 'manual',
        force: true,
      }),
    ).toMatchObject({ action: 'run', force: true })

    expect(
      getCheckInScheduleDecision({
        now,
        state: {
          ...state,
          phase: 'succeeded',
          nextActionAt: undefined,
        },
        autoCheckInEnabled: true,
        trigger: 'manual',
        force: true,
      }),
    ).toMatchObject({ action: 'skip', reason: '今日已签到' })
  })

  it('需要用户处理时允许用户刷新重新核对', () => {
    const nudgeEligibleAt = now + CHECK_IN_NUDGE_INTERVAL_MS

    expect(
      getCheckInScheduleDecision({
        now: nudgeEligibleAt,
        state: {
          ...state,
          phase: 'needs-action',
          nudgeEligibleAt,
          retryCause: 'authentication',
        },
        autoCheckInEnabled: true,
        trigger: 'refresh',
      }),
    ).toMatchObject({ action: 'run' })
  })

  it('需要用户处理时不会被 alarm 自动重试', () => {
    expect(
      getCheckInScheduleDecision({
        now: now + 60 * 60_000,
        state: {
          ...state,
          phase: 'needs-action',
          nudgeEligibleAt: now,
          userMessage: '请先登录',
        },
        autoCheckInEnabled: true,
        trigger: 'alarm',
      }),
    ).toMatchObject({ action: 'skip', reason: '请先登录' })
  })

  it('关闭自动签到后页面刷新不会触发请求', () => {
    expect(
      getCheckInScheduleDecision({
        now: state.targetAt!,
        state,
        autoCheckInEnabled: false,
        trigger: 'refresh',
      }),
    ).toMatchObject({ action: 'skip', reason: '自动签到已关闭' })
  })
})

describe('getCheckInAlarmTime', () => {
  const state = normalizeCheckInState(undefined, now, 0)

  it('按 nextActionAt 创建一次调度', () => {
    expect(getCheckInAlarmTime(state, true)).toBe(state.nextActionAt)
  })

  it('已完成的当日任务不创建 alarm', () => {
    expect(
      getCheckInAlarmTime(
        { ...state, phase: 'succeeded', nextActionAt: undefined },
        true,
      ),
    ).toBeUndefined()
  })

  it('用户关闭自动签到或需要人工处理时不创建 alarm', () => {
    expect(getCheckInAlarmTime(state, false)).toBeUndefined()
    expect(
      getCheckInAlarmTime(
        { ...state, phase: 'needs-action', nextActionAt: undefined },
        true,
      ),
    ).toBeUndefined()
  })

  it('目标时间已过时保留原时间，由浏览器在最短延迟后触发', () => {
    const past = now - 60_000

    expect(getCheckInAlarmTime({ ...state, nextActionAt: past }, true)).toBe(past)
  })
})

describe('buildDailyInfoAfterAttempt', () => {
  const initial = normalizeCheckInState(undefined, Date.UTC(2026, 10, 5, 0, 6), 0)
  const attemptTime = Date.UTC(2026, 10, 5, 0, 6, 10)
  const finishedAt = Date.UTC(2026, 10, 5, 0, 6, 20)

  it('网络失败后一分钟即可重试', () => {
    const state = buildDailyInfoAfterAttempt({
      previous: initial,
      result: failed('network'),
      attemptTime,
      finishedAt,
      trigger: 'alarm',
    })

    expect(state.phase).toBe('scheduled')
    expect(state.retryCause).toBe('transient')
    expect(state.nextActionAt).toBe(finishedAt + 60_000)
    expect(state.nudgeEligibleAt).toBe(finishedAt + CHECK_IN_NUDGE_INTERVAL_MS)
  })

  it('刷新可以在后续退避阶段提前触发网络重试', () => {
    const first = buildDailyInfoAfterAttempt({
      previous: initial,
      result: failed('network'),
      attemptTime,
      finishedAt,
      trigger: 'alarm',
    })
    const laterFinishedAt = finishedAt + 5 * 60_000
    const second = buildDailyInfoAfterAttempt({
      previous: first,
      result: failed('network'),
      attemptTime: laterFinishedAt - 100,
      finishedAt: laterFinishedAt,
      trigger: 'alarm',
    })

    expect(second.nextActionAt).toBe(laterFinishedAt + 5 * 60_000)
    expect(
      getCheckInScheduleDecision({
        now: second.nudgeEligibleAt!,
        state: second,
        autoCheckInEnabled: true,
        trigger: 'refresh',
      }),
    ).toMatchObject({ action: 'run' })
  })

  it('网络失败后连续快速刷新仍遵守一分钟最小间隔', () => {
    const state = buildDailyInfoAfterAttempt({
      previous: initial,
      result: failed('network'),
      attemptTime,
      finishedAt,
      trigger: 'alarm',
    })

    expect(
      getCheckInScheduleDecision({
        now: state.nudgeEligibleAt! - 1,
        state,
        autoCheckInEnabled: true,
        trigger: 'refresh',
      }).action,
    ).toBe('skip')
  })

  it('429 使用 Retry-After 并至少等待一分钟', () => {
    const state = buildDailyInfoAfterAttempt({
      previous: initial,
      result: { ...failed('http', 429), retryAfterMs: 120_000 },
      attemptTime,
      finishedAt,
      trigger: 'alarm',
    })

    expect(state.retryCause).toBe('rate-limited')
    expect(state.nextActionAt).toBe(finishedAt + 120_000)
  })

  it('服务端错误使用独立的较长退避序列', () => {
    const state = buildDailyInfoAfterAttempt({
      previous: initial,
      result: failed('http', 503),
      attemptTime,
      finishedAt,
      trigger: 'alarm',
    })

    expect(state.retryCause).toBe('server')
    expect(state.nextActionAt).toBe(finishedAt + 5 * 60_000)
  })

  it('403 首次延迟重试，连续两次后要求用户处理', () => {
    const first = buildDailyInfoAfterAttempt({
      previous: initial,
      result: failed('http', 403),
      attemptTime,
      finishedAt,
      trigger: 'alarm',
    })
    const second = buildDailyInfoAfterAttempt({
      previous: first,
      result: failed('http', 403),
      attemptTime: first.nextActionAt!,
      finishedAt: first.nextActionAt! + 1000,
      trigger: 'alarm',
    })

    expect(first.phase).toBe('scheduled')
    expect(second.phase).toBe('needs-action')
    expect(second.retryCause).toBe('forbidden')
  })

  it('登录失效和人机验证进入用户处理状态', () => {
    const auth = buildDailyInfoAfterAttempt({
      previous: initial,
      result: failed('unauthenticated'),
      attemptTime,
      finishedAt,
      trigger: 'alarm',
    })
    const challenge = buildDailyInfoAfterAttempt({
      previous: initial,
      result: failed('challenge'),
      attemptTime,
      finishedAt,
      trigger: 'alarm',
    })

    expect(auth).toMatchObject({ phase: 'needs-action', retryCause: 'authentication' })
    expect(challenge).toMatchObject({ phase: 'needs-action', retryCause: 'challenge' })
  })

  it('领取结果不确定时先重新核对，不直接认为成功', () => {
    const state = buildDailyInfoAfterAttempt({
      previous: initial,
      result: failed('redeem-failed'),
      attemptTime,
      finishedAt,
      trigger: 'alarm',
    })

    expect(state.phase).toBe('scheduled')
    expect(state.retryCause).toBe('ambiguous')
    expect(state.nextActionAt).toBe(finishedAt + 2 * 60_000)
  })

  it('成功时清除重试计划', () => {
    const state = buildDailyInfoAfterAttempt({
      previous: initial,
      result: { status: 'success', checkInDays: 12 },
      attemptTime,
      finishedAt,
      trigger: 'refresh',
    })

    expect(state.phase).toBe('succeeded')
    expect(state.lastResult).toBe('success')
    expect(state.failureCount).toBe(0)
    expect(state.nextActionAt).toBeUndefined()
    expect(state.checkInDays).toBe(12)
  })
})
