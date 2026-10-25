import { describe, expect, it } from 'vitest'

import {
  extractRedeemPath,
  FAILURE_RETRY_INTERVAL_MS,
  getCheckInSkipReason,
  getUtcDayKey,
  getUtcDayStart,
  parseCheckInDays,
  parseCheckInPage,
  REWARD_RESET_GRACE_MS,
  UNAUTHENTICATED_RETRY_INTERVAL_MS,
} from '../apps/extension/src/background/check-in-utils'

describe('getUtcDayKey', () => {
  it('按 UTC 日期划分', () => {
    expect(getUtcDayKey(Date.UTC(2026, 9, 22, 23, 59))).toBe('2026-10-22')
    expect(getUtcDayKey(Date.UTC(2026, 9, 23, 0, 1))).toBe('2026-10-23')
  })
})

describe('getUtcDayStart', () => {
  it('返回 UTC 零点', () => {
    const timestamp = Date.UTC(2026, 9, 22, 18, 30)

    expect(getUtcDayStart(timestamp)).toBe(Date.UTC(2026, 9, 22))
  })
})

describe('extractRedeemPath', () => {
  it('兼容单引号与双引号属性', () => {
    expect(extractRedeemPath('<a href=\'/mission/daily/redeem?once=12345\'>领取</a>'))
      .toBe('/mission/daily/redeem?once=12345')
    expect(extractRedeemPath('<a href="/mission/daily/redeem?once=abc-def">领取</a>'))
      .toBe('/mission/daily/redeem?once=abc-def')
  })

  it('没有领取链接时返回 null', () => {
    expect(extractRedeemPath('<div>每日登录奖励已领取</div>')).toBeNull()
  })
})

describe('parseCheckInDays', () => {
  it('解析连续登录天数', () => {
    expect(parseCheckInDays('已连续登录 42 天')).toBe(42)
    expect(parseCheckInDays('已连续登录42天')).toBe(42)
  })

  it('没有匹配时返回 undefined', () => {
    expect(parseCheckInDays('每日登录奖励已领取')).toBeUndefined()
  })
})

describe('parseCheckInPage', () => {
  it('存在领取链接时返回 redeem', () => {
    expect(parseCheckInPage('<a href=\'/mission/daily/redeem?once=123\'>领取</a>'))
      .toEqual({ type: 'redeem', path: '/mission/daily/redeem?once=123' })
  })

  it('已领取时返回 already 与连续天数', () => {
    expect(parseCheckInPage('<div>每日登录奖励已领取，已连续登录 42 天</div>'))
      .toEqual({ type: 'already', checkInDays: 42 })
  })

  it('登录页返回 unauthenticated', () => {
    expect(parseCheckInPage('<a href="/signin?next=/mission/daily">登录</a>'))
      .toEqual({ type: 'unauthenticated' })
  })

  it('无法识别的页面返回 unknown', () => {
    expect(parseCheckInPage('<div>503 Service Unavailable</div>')).toEqual({ type: 'unknown' })
  })
})

describe('getCheckInSkipReason', () => {
  const now = Date.UTC(2026, 9, 22, 12)

  it('同一 UTC 日已签到则跳过', () => {
    expect(
      getCheckInSkipReason({
        now,
        lastCheckInTime: Date.UTC(2026, 9, 22, 8),
        lastResult: 'success',
      }),
    ).toBe('今日已签到')
  })

  it('跨 UTC 日允许签到', () => {
    expect(
      getCheckInSkipReason({
        now,
        lastCheckInTime: Date.UTC(2026, 9, 21, 23),
        lastResult: 'success',
      }),
    ).toBeUndefined()
  })

  it('UTC 重置后的宽限期内跳过', () => {
    expect(
      getCheckInSkipReason({
        now: Date.UTC(2026, 9, 22) + REWARD_RESET_GRACE_MS - 1,
        lastCheckInTime: Date.UTC(2026, 9, 21, 8),
        lastResult: 'success',
      }),
    ).toBe('等待 V2EX 奖励日重置')
  })

  it('失败后在冷却期内跳过', () => {
    expect(
      getCheckInSkipReason({
        now,
        lastAttemptTime: now - FAILURE_RETRY_INTERVAL_MS + 1000,
        lastResult: 'failed',
      }),
    ).toBe('上次签到失败，重试冷却中')
  })

  it('超过冷却期后允许重试', () => {
    expect(
      getCheckInSkipReason({
        now,
        lastAttemptTime: now - FAILURE_RETRY_INTERVAL_MS,
        lastResult: 'failed',
      }),
    ).toBeUndefined()
  })

  it('手动触发时忽略失败冷却', () => {
    expect(
      getCheckInSkipReason({
        now,
        lastAttemptTime: now - 1000,
        lastResult: 'failed',
        bypassRetryCooldown: true,
      }),
    ).toBeUndefined()
  })

  it('优先使用奖励日字段判断', () => {
    expect(
      getCheckInSkipReason({
        now,
        lastCheckInTime: Date.UTC(2026, 9, 21, 8),
        lastCheckInDay: '2026-10-22',
        lastResult: 'success',
      }),
    ).toBe('今日已签到')
  })

  it('未登录失败使用更短的重试冷却', () => {
    expect(
      getCheckInSkipReason({
        now,
        lastAttemptTime: now - UNAUTHENTICATED_RETRY_INTERVAL_MS + 1000,
        lastResult: 'failed',
        lastErrorCode: 'unauthenticated',
      }),
    ).toBe('上次签到失败，重试冷却中')

    expect(
      getCheckInSkipReason({
        now,
        lastAttemptTime: now - UNAUTHENTICATED_RETRY_INTERVAL_MS,
        lastResult: 'failed',
        lastErrorCode: 'unauthenticated',
      }),
    ).toBeUndefined()
  })
})
