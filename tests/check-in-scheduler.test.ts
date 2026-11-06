import { describe, expect, it } from 'vitest'

import {
  buildDailyInfoAfterAttempt,
  CHECK_IN_NUDGE_INTERVAL_MS,
  CHECK_IN_STATE_SCHEMA_VERSION,
  CHECK_IN_TARGET_GRACE_MS,
  CHECK_IN_TARGET_JITTER_MAX_MS,
  createCheckInStateForMember,
  getCheckInAlarmTime,
  getCheckInScheduleDecision,
  isCheckInAttemptStillCurrent,
  isCheckInStateForMember,
  isSameCheckInState,
  normalizeCheckInState,
} from '../apps/extension/src/background/check-in-scheduler'
import type { CheckInResult } from '../apps/extension/src/types'

const DAY = 24 * 60 * 60 * 1000
const now = Date.UTC(2026, 10, 5, 0, 10)
const memberName = 'alice'

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
  it('为新账号安排带随机抖动的目标时间', () => {
    const state = createCheckInStateForMember(memberName, now, 120_000)
    const dayStart = Math.floor(now / DAY) * DAY

    expect(state.schemaVersion).toBe(CHECK_IN_STATE_SCHEMA_VERSION)
    expect(state.memberName).toBe(memberName)
    expect(state.rewardDay).toBe('2026-11-5')
    expect(state.phase).toBe('scheduled')
    expect(state.targetAt).toBe(dayStart + CHECK_IN_TARGET_GRACE_MS + 120_000)
    expect(state.nextActionAt).toBe(state.targetAt)
  })

  it('随机抖动不会超过三分钟', () => {
    const state = createCheckInStateForMember(memberName, now, CHECK_IN_TARGET_JITTER_MAX_MS * 2)
    const dayStart = Math.floor(now / DAY) * DAY

    expect(state.targetAt).toBe(dayStart + CHECK_IN_TARGET_GRACE_MS + CHECK_IN_TARGET_JITTER_MAX_MS)
  })

  it('已有当日成功记录时直接进入完成状态', () => {
    const lastCheckInTime = Date.UTC(2026, 10, 5, 0, 1)
    const state = normalizeCheckInState(
      {
        schemaVersion: 3,
        memberName,
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
        schemaVersion: 3,
        memberName,
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

  it('旧版无账号记录会被清空，不能沿用当天成功或失败', () => {
    const legacySuccess = normalizeCheckInState(
      {
        schemaVersion: 2,
        lastCheckInTime: Date.UTC(2026, 10, 5, 0, 1),
        lastCheckInDay: '2026-11-5',
        checkInDays: 10,
      },
      now,
      0,
    )

    expect(legacySuccess).toMatchObject({
      schemaVersion: 3,
      phase: 'scheduled',
      rewardDay: '2026-11-5',
    })
    expect(legacySuccess.memberName).toBeUndefined()
    expect(legacySuccess.lastCheckInTime).toBeUndefined()
    expect(legacySuccess.checkInDays).toBeUndefined()
  })

  it('旧版无账号状态迁移一次后再次归一化保持同一对象', () => {
    const migrated = normalizeCheckInState(
      {
        schemaVersion: 2,
        lastCheckInTime: Date.UTC(2026, 10, 5, 0, 1),
        lastCheckInDay: '2026-11-5',
      },
      now,
      0,
    )

    const normalizedAgain = normalizeCheckInState(
      migrated,
      now + 1000,
      CHECK_IN_TARGET_JITTER_MAX_MS,
    )

    expect(normalizedAgain).toBe(migrated)
  })

  it('当前奖励日的匿名调度状态不会被随机重建', () => {
    const anonymous = normalizeCheckInState(undefined, now, 0)
    const normalizedAgain = normalizeCheckInState(
      anonymous,
      now + 1000,
      CHECK_IN_TARGET_JITTER_MAX_MS,
    )

    expect(anonymous.memberName).toBeUndefined()
    expect(normalizedAgain).toBe(anonymous)
  })

  it('语义相同且由 storage 省略 undefined 字段的状态不变', () => {
    expect(
      isSameCheckInState(
        {
          schemaVersion: 3,
          rewardDay: '2026-11-5',
          phase: 'scheduled',
          nextActionAt: undefined,
        },
        {
          schemaVersion: 3,
          rewardDay: '2026-11-5',
          phase: 'scheduled',
        },
      ),
    ).toBe(true)
  })

  it('非法调度时间会重置为有限且位于当前奖励日的计划', () => {
    const corrupted = {
      schemaVersion: 3,
      memberName,
      rewardDay: '2026-11-5',
      phase: 'scheduled',
      targetAt: Number.NaN,
      nextActionAt: Number.POSITIVE_INFINITY,
    } as const

    const repaired = normalizeCheckInState(corrupted, now, 0)
    const normalizedAgain = normalizeCheckInState(
      repaired,
      now + 1000,
      CHECK_IN_TARGET_JITTER_MAX_MS,
    )

    expect(repaired.targetAt).toBe(
      Date.UTC(2026, 10, 5) + CHECK_IN_TARGET_GRACE_MS,
    )
    expect(repaired.nextActionAt).toBe(repaired.targetAt)
    expect(normalizedAgain).toBe(repaired)
  })

  it('非法历史时间不会残留在归一化状态中', () => {
    const targetAt = now + 60_000
    const repaired = normalizeCheckInState(
      {
        schemaVersion: 3,
        memberName,
        rewardDay: '2026-11-5',
        phase: 'scheduled',
        targetAt,
        nextActionAt: targetAt,
        lastCheckInTime: Number.NaN,
        lastAttemptTime: Number.POSITIVE_INFINITY,
        lastFinishedAt: Number.MAX_SAFE_INTEGER,
      },
      now,
      0,
    )

    expect(repaired.targetAt).toBe(targetAt)
    expect(repaired.lastCheckInTime).toBeUndefined()
    expect(repaired.lastAttemptTime).toBeUndefined()
    expect(repaired.lastFinishedAt).toBeUndefined()
  })

  it('当前奖励日但签到日期已过期的成功状态会重新安排', () => {
    const repaired = normalizeCheckInState(
      {
        schemaVersion: 3,
        memberName,
        rewardDay: '2026-11-5',
        phase: 'succeeded',
        lastCheckInTime: Date.UTC(2026, 10, 4, 8),
        lastCheckInDay: '2026-11-4',
      },
      now,
      0,
    )

    expect(repaired.phase).toBe('scheduled')
    expect(repaired.nextActionAt).toBe(
      Date.UTC(2026, 10, 5) + CHECK_IN_TARGET_GRACE_MS,
    )
  })

  it('无账号身份的待处理状态会稳定保留且不进入自动调度', () => {
    const anonymous = {
      schemaVersion: CHECK_IN_STATE_SCHEMA_VERSION,
      rewardDay: '2026-11-5',
      phase: 'needs-action',
      userMessage: '请先登录',
    } as const

    expect(normalizeCheckInState(anonymous, now, 0)).toBe(anonymous)
    expect(getCheckInAlarmTime(anonymous, true)).toBeUndefined()
  })

  it('非法签到日期和跨日 nudge 时间会被清理', () => {
    const targetAt = now + 60_000
    const repaired = normalizeCheckInState(
      {
        schemaVersion: 3,
        memberName,
        rewardDay: '2026-11-5',
        phase: 'scheduled',
        targetAt,
        nextActionAt: targetAt,
        nudgeEligibleAt: Date.UTC(2026, 10, 6) + 1,
        lastCheckInDay: 123,
      } as unknown as Parameters<typeof normalizeCheckInState>[0],
      now,
      0,
    )

    expect(repaired.memberName).toBe(memberName)
    expect(repaired.targetAt).toBe(
      Date.UTC(2026, 10, 5) + CHECK_IN_TARGET_GRACE_MS,
    )
    expect(repaired.nudgeEligibleAt).toBeUndefined()
    expect(repaired.lastCheckInDay).toBeUndefined()
  })

  it('非法账号身份不会残留在持久化状态中', () => {
    const targetAt = now + 60_000
    const repaired = normalizeCheckInState(
      {
        schemaVersion: 3,
        memberName: 123,
        rewardDay: '2026-11-5',
        phase: 'scheduled',
        targetAt,
        nextActionAt: targetAt,
      } as unknown as Parameters<typeof normalizeCheckInState>[0],
      now,
      0,
    )

    expect(repaired.memberName).toBeUndefined()
  })

  it('已绑定账号的同日旧失败记录按新网络策略重排', () => {
    const lastAttemptTime = Date.UTC(2026, 10, 5, 0, 7)
    const state = normalizeCheckInState(
      {
        schemaVersion: 3,
        memberName,
        lastAttemptTime,
        lastResult: 'failed',
        lastErrorCode: 'network',
        lastCheckInDay: '2026-11-4',
      },
      now,
      0,
    )

    expect(state.schemaVersion).toBe(3)
    expect(state.nextActionAt).toBe(lastAttemptTime + 60_000)
    expect(state.nudgeEligibleAt).toBe(lastAttemptTime + 60_000)
  })

  it('账号切换会创建不继承旧账号数据的新状态', () => {
    const bobState = createCheckInStateForMember('bob', now, 0)

    expect(bobState).toMatchObject({
      schemaVersion: 3,
      memberName: 'bob',
      phase: 'scheduled',
    })
    expect(isCheckInStateForMember(bobState, 'alice')).toBe(false)
    expect(isCheckInStateForMember(bobState, 'bob')).toBe(true)
  })

  it('签到途中账号变化后旧结果不能写回', () => {
    const aliceState = createCheckInStateForMember('alice', now, 0)
    const bobState = createCheckInStateForMember('bob', now, 0)

    expect(
      isCheckInAttemptStillCurrent({
        startedAccountRevision: 1,
        currentAccountRevision: 2,
        startedState: aliceState,
        latestState: aliceState,
      }),
    ).toBe(false)
    expect(
      isCheckInAttemptStillCurrent({
        startedAccountRevision: 1,
        currentAccountRevision: 1,
        startedState: aliceState,
        latestState: bobState,
      }),
    ).toBe(false)
    expect(
      isCheckInAttemptStillCurrent({
        startedAccountRevision: 1,
        currentAccountRevision: 1,
        startedState: aliceState,
        latestState: aliceState,
      }),
    ).toBe(true)
  })
})

describe('getCheckInScheduleDecision', () => {
  const state = createCheckInStateForMember(memberName, now, 0)

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

  it('没有账号归属的成功状态不能阻止手动签到', () => {
    expect(
      getCheckInScheduleDecision({
        now,
        state: {
          ...state,
          schemaVersion: 3,
          memberName: undefined,
          phase: 'succeeded',
          nextActionAt: undefined,
        },
        autoCheckInEnabled: true,
        trigger: 'manual',
        force: true,
      }),
    ).toMatchObject({ action: 'run' })
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

  it('账号身份未确认时不执行自动签到，但允许用户手动触发', () => {
    const anonymousState = {
      ...state,
      memberName: undefined,
      nextActionAt: state.nextActionAt,
    }

    expect(
      getCheckInScheduleDecision({
        now: state.targetAt!,
        state: anonymousState,
        autoCheckInEnabled: true,
        trigger: 'alarm',
      }),
    ).toMatchObject({ action: 'skip', reason: '账号签到状态待确认' })

    expect(
      getCheckInScheduleDecision({
        now: state.targetAt!,
        state: anonymousState,
        autoCheckInEnabled: true,
        trigger: 'manual',
        force: true,
      }),
    ).toMatchObject({ action: 'run', force: true })
  })
})

describe('getCheckInAlarmTime', () => {
  const state = createCheckInStateForMember(memberName, now, 0)

  it('按 nextActionAt 创建一次调度', () => {
    expect(getCheckInAlarmTime(state, true)).toBe(state.nextActionAt)
  })

  it('已完成的当日任务不创建 alarm', () => {
    expect(
      getCheckInAlarmTime({ ...state, phase: 'succeeded', nextActionAt: undefined }, true),
    ).toBeUndefined()
  })

  it('用户关闭自动签到或需要人工处理时不创建 alarm', () => {
    expect(getCheckInAlarmTime(state, false)).toBeUndefined()
    expect(
      getCheckInAlarmTime({ ...state, phase: 'needs-action', nextActionAt: undefined }, true),
    ).toBeUndefined()
  })

  it('目标时间已过时保留原时间，由浏览器在最短延迟后触发', () => {
    const past = now - 60_000

    expect(getCheckInAlarmTime({ ...state, nextActionAt: past }, true)).toBe(past)
  })

  it('账号身份未确认时不创建自动签到 alarm', () => {
    expect(getCheckInAlarmTime({ ...state, memberName: undefined }, true)).toBeUndefined()
  })
})

describe('签到状态性质', () => {
  it('任意旧版或损坏状态的归一化保持幂等与时间不变量', () => {
    let seed = 0x159

    const random = () => {
      seed = seed * 1664525 + 1013904223 >>> 0

      return seed / 0x1_0000_0000
    }

    const pick = <T>(values: readonly T[]): T => values[Math.floor(random() * values.length)]!
    const dayStart = Date.UTC(2026, 10, 5)
    const timestamps = [
      undefined,
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      0,
      -1,
      dayStart,
      dayStart + CHECK_IN_TARGET_GRACE_MS,
      now,
      dayStart + DAY,
      dayStart + DAY + 1,
    ] as const

    for (let index = 0; index < 500; index += 1) {
      const previous = {
        schemaVersion: pick([2, 3, 3, 3, undefined] as const),
        memberName: pick([memberName, undefined, '   ', 123] as const),
        rewardDay: pick(['2026-11-5', '2026-11-4', 'invalid', undefined] as const),
        phase: pick(['scheduled', 'needs-action', 'succeeded', undefined] as const),
        targetAt: pick(timestamps),
        nextActionAt: pick(timestamps),
        nudgeEligibleAt: pick(timestamps),
        lastCheckInTime: pick(timestamps),
        lastAttemptTime: pick(timestamps),
        lastFinishedAt: pick(timestamps),
        lastCheckInDay: pick(['2026-11-5', '2026-11-4', 'invalid', 123, undefined] as const),
      }

      const normalized = normalizeCheckInState(
        previous as unknown as Parameters<typeof normalizeCheckInState>[0],
        now,
        random() * DAY,
      )
      const normalizedAgain = normalizeCheckInState(
        normalized,
        now + 1000,
        random() * DAY,
      )

      expect(normalized.schemaVersion).toBe(3)
      expect(normalizedAgain).toBe(normalized)

      for (const field of ['targetAt', 'nextActionAt', 'nudgeEligibleAt'] as const) {
        if (normalized[field] !== undefined) {
          expect(Number.isFinite(normalized[field])).toBe(true)
        }
      }

      const alarmTime = getCheckInAlarmTime(normalized, true)

      if (alarmTime !== undefined) {
        expect(Number.isFinite(alarmTime)).toBe(true)
        expect(normalized.memberName).toBe(memberName)
      }

      if (!normalized.memberName) {
        expect(alarmTime).toBeUndefined()
      }
    }
  })
})

describe('buildDailyInfoAfterAttempt', () => {
  const initial = createCheckInStateForMember(memberName, Date.UTC(2026, 10, 5, 0, 6), 0)
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
    expect(state.memberName).toBe(memberName)
  })
})
