import { describe, expect, it } from 'vitest'

import {
  buildCheckInDiagnostic,
  describeCheckInErrorCode,
  extractRedeemPath,
  getCheckInSkipReason,
  getUtcDayKey,
  getUtcDayStart,
  isChallengePage,
  isSignInPath,
  parseCheckInDays,
  parseCheckInPage,
  resolveCheckInDisplayState,
  REWARD_RESET_GRACE_MS,
  shouldPromptCheckInFailure,
} from '../apps/extension/src/background/check-in-utils'
import { parseRetryAfter } from '../apps/extension/src/background/daily-check-in'

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
    expect(extractRedeemPath('<a href=\'/mission/daily/redeem?once=12345\'>领取</a>')).toBe(
      '/mission/daily/redeem?once=12345',
    )
    expect(extractRedeemPath('<a href="/mission/daily/redeem?once=abc-def">领取</a>')).toBe(
      '/mission/daily/redeem?once=abc-def',
    )
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
    expect(parseCheckInPage('<a href=\'/mission/daily/redeem?once=123\'>领取</a>')).toEqual({
      type: 'redeem',
      path: '/mission/daily/redeem?once=123',
    })
  })

  it('已领取时返回 already 与连续天数', () => {
    expect(parseCheckInPage('<div>每日登录奖励已领取，已连续登录 42 天</div>')).toEqual({
      type: 'already',
      checkInDays: 42,
    })
  })

  it('登录页返回 unauthenticated', () => {
    expect(parseCheckInPage('<a href="/signin?next=/mission/daily">登录</a>')).toEqual({
      type: 'unauthenticated',
    })
  })

  it('无法识别的页面返回 unknown', () => {
    expect(parseCheckInPage('<div>503 Service Unavailable</div>')).toEqual({ type: 'unknown' })
  })

  it('最终地址落在登录页时判定为未登录', () => {
    expect(parseCheckInPage('<div>未知内容</div>', '/signin')).toEqual({ type: 'unauthenticated' })
    expect(parseCheckInPage('<div>未知内容</div>', '/signup')).toEqual({ type: 'unauthenticated' })
  })

  it('识别 Cloudflare 人机验证页', () => {
    const html = '<html><title>Just a moment...</title><body>正在验证您是否是真人</body></html>'

    expect(parseCheckInPage(html, '/mission/daily')).toEqual({ type: 'challenge' })
  })
})

describe('isSignInPath', () => {
  it('识别登录与注册路径', () => {
    expect(isSignInPath('/signin')).toBe(true)
    expect(isSignInPath('/signup')).toBe(true)
    expect(isSignInPath('/mission/daily')).toBe(false)
    expect(isSignInPath(undefined)).toBe(false)
  })
})

describe('isChallengePage', () => {
  it('识别中英文验证页特征', () => {
    expect(isChallengePage('<div>Verifying you are human</div>')).toBe(true)
    expect(isChallengePage('<script>window._cf_chl_opt = {}</script>')).toBe(true)
  })

  it('正常签到页不误判', () => {
    expect(isChallengePage('<div>每日登录奖励已领取，已连续登录 42 天</div>')).toBe(false)
  })
})

describe('getCheckInSkipReason', () => {
  const now = Date.UTC(2026, 9, 22, 12)

  it('同一 UTC 日已签到则跳过', () => {
    expect(
      getCheckInSkipReason({
        now,
        lastCheckInTime: Date.UTC(2026, 9, 22, 8),
      }),
    ).toBe('今日已签到')
  })

  it('跨 UTC 日允许签到', () => {
    expect(
      getCheckInSkipReason({
        now,
        lastCheckInTime: Date.UTC(2026, 9, 21, 23),
      }),
    ).toBeUndefined()
  })

  it('UTC 重置后的宽限期内跳过', () => {
    expect(
      getCheckInSkipReason({
        now: Date.UTC(2026, 9, 22) + REWARD_RESET_GRACE_MS - 1,
        lastCheckInTime: Date.UTC(2026, 9, 21, 8),
      }),
    ).toBe('等待 V2EX 奖励日重置')
  })

  it('到达持久化的下次动作时间后允许执行', () => {
    expect(
      getCheckInSkipReason({
        now,
        nextActionAt: now,
      }),
    ).toBeUndefined()
  })

  it('尚未到达下次动作时间时保持等待', () => {
    expect(
      getCheckInSkipReason({
        now,
        nextActionAt: now + 1,
      }),
    ).toBe('尚未到下次签到时间')
  })

  it('优先使用奖励日字段判断', () => {
    expect(
      getCheckInSkipReason({
        now,
        lastCheckInTime: Date.UTC(2026, 9, 21, 8),
        lastCheckInDay: '2026-10-22',
      }),
    ).toBe('今日已签到')
  })
})

describe('describeCheckInErrorCode', () => {
  it('区分登录失效、人机验证、无法确认与普通失败', () => {
    expect(describeCheckInErrorCode('unauthenticated').title).toContain('登录')
    expect(describeCheckInErrorCode('challenge').title).toContain('人机验证')
    expect(describeCheckInErrorCode('unexpected-page').title).toContain('无法确认')
    expect(describeCheckInErrorCode('redeem-failed').title).toContain('无法确认')
    expect(describeCheckInErrorCode(undefined).title).toBe('签到失败')
  })
})

describe('resolveCheckInDisplayState', () => {
  const now = Date.UTC(2026, 9, 22, 12)
  const memberName = 'alice'

  it('今日已签到时返回 checked-in', () => {
    expect(
      resolveCheckInDisplayState({
        now,
        autoCheckInEnabled: true,
        dailyInfo: {
          schemaVersion: 3,
          memberName,
          lastCheckInTime: Date.UTC(2026, 9, 22, 8),
          checkInDays: 3,
        },
      }),
    ).toEqual({
      type: 'checked-in',
      checkInTime: Date.UTC(2026, 9, 22, 8),
      checkInDays: 3,
    })
  })

  it('关闭自动签到但今日已签到仍显示已签到', () => {
    expect(
      resolveCheckInDisplayState({
        now,
        autoCheckInEnabled: false,
        dailyInfo: {
          schemaVersion: 3,
          memberName,
          lastCheckInTime: Date.UTC(2026, 9, 22, 8),
        },
      }).type,
    ).toBe('checked-in')
  })

  it('当日失败返回 failed 并携带分类与状态码', () => {
    expect(
      resolveCheckInDisplayState({
        now,
        autoCheckInEnabled: true,
        dailyInfo: {
          schemaVersion: 3,
          memberName,
          lastAttemptTime: Date.UTC(2026, 9, 22, 11),
          lastResult: 'failed',
          lastErrorCode: 'unauthenticated',
          lastHttpStatus: 200,
        },
      }),
    ).toMatchObject({ type: 'failed', code: 'unauthenticated', httpStatus: 200 })
  })

  it('返回下一次自动重试和用户处理状态', () => {
    const retryAt = Date.UTC(2026, 9, 22, 11, 1)

    expect(
      resolveCheckInDisplayState({
        now,
        autoCheckInEnabled: true,
        dailyInfo: {
          schemaVersion: 3,
          memberName,
          lastAttemptTime: Date.UTC(2026, 9, 22, 11),
          lastResult: 'failed',
          lastErrorCode: 'network',
          nextActionAt: retryAt,
        },
      }),
    ).toMatchObject({
      type: 'failed',
      retryAt,
      needsAction: false,
    })

    expect(
      resolveCheckInDisplayState({
        now,
        autoCheckInEnabled: true,
        dailyInfo: {
          schemaVersion: 3,
          memberName,
          lastAttemptTime: Date.UTC(2026, 9, 22, 11),
          lastResult: 'failed',
          lastErrorCode: 'challenge',
          phase: 'needs-action',
          userMessage: '需要人机验证',
        },
      }),
    ).toMatchObject({
      type: 'failed',
      needsAction: true,
      userMessage: '需要人机验证',
    })
  })

  it('前一天的失败不当作今日失败', () => {
    expect(
      resolveCheckInDisplayState({
        now,
        autoCheckInEnabled: true,
        dailyInfo: {
          schemaVersion: 3,
          memberName,
          lastAttemptTime: Date.UTC(2026, 9, 21, 23),
          lastResult: 'failed',
          lastErrorCode: 'network',
        },
      }).type,
    ).toBe('not-attempted')
  })

  it('关闭自动签到且今日未尝试时返回 auto-disabled', () => {
    expect(resolveCheckInDisplayState({ now, autoCheckInEnabled: false }).type).toBe(
      'auto-disabled',
    )
  })

  it('账号不匹配时不能沿用其他账号的已签到状态', () => {
    expect(
      resolveCheckInDisplayState({
        now,
        autoCheckInEnabled: true,
        currentMemberName: 'bob',
        dailyInfo: {
          schemaVersion: 3,
          memberName,
          lastCheckInTime: Date.UTC(2026, 9, 22, 8),
          checkInDays: 3,
        },
      }),
    ).toMatchObject({
      type: 'not-attempted',
      skipReason: '账号签到状态待确认',
    })
  })

  it('旧版无账号状态不能显示为已签到', () => {
    expect(
      resolveCheckInDisplayState({
        now,
        autoCheckInEnabled: true,
        currentMemberName: memberName,
        dailyInfo: {
          schemaVersion: 2,
          lastCheckInTime: Date.UTC(2026, 9, 22, 8),
          checkInDays: 3,
        },
      }),
    ).toMatchObject({
      type: 'not-attempted',
      skipReason: '账号签到状态待确认',
    })
  })
})

describe('shouldPromptCheckInFailure', () => {
  const failedState = { type: 'failed' as const, attemptTime: Date.UTC(2026, 9, 22, 11) }

  it('同日仅失败一次不提示', () => {
    expect(shouldPromptCheckInFailure(failedState, 1)).toBe(false)
  })

  it('同日连续失败两次才提示', () => {
    expect(shouldPromptCheckInFailure(failedState, 2)).toBe(true)
  })

  it('已签到时不提示', () => {
    expect(
      shouldPromptCheckInFailure({ type: 'checked-in', checkInTime: Date.UTC(2026, 9, 22, 8) }, 3),
    ).toBe(false)
  })

  it('需要用户处理时立即提示', () => {
    expect(
      shouldPromptCheckInFailure(
        {
          type: 'failed',
          attemptTime: Date.UTC(2026, 9, 22, 11),
          needsAction: true,
        },
        1,
      ),
    ).toBe(true)
  })
})

describe('parseRetryAfter', () => {
  const now = Date.UTC(2026, 9, 22, 11)

  it('支持秒数和 HTTP 日期', () => {
    expect(parseRetryAfter('120', now)).toBe(120_000)
    expect(parseRetryAfter(new Date(now + 5 * 60_000).toUTCString(), now)).toBe(300_000)
  })

  it('过短、过长或非法值返回 undefined', () => {
    expect(parseRetryAfter('0', now)).toBeUndefined()
    expect(parseRetryAfter(String(25 * 60 * 60), now)).toBeUndefined()
    expect(parseRetryAfter('invalid', now)).toBeUndefined()
  })
})

describe('buildCheckInDiagnostic', () => {
  it('包含归因字段且不含查询串', () => {
    const text = buildCheckInDiagnostic({
      now: Date.UTC(2026, 9, 22, 12),
      autoCheckInEnabled: true,
      extensionVersion: '1.9.0',
      browser: 'Chromium（test）',
      timezoneOffsetMinutes: -480,
      dailyInfo: {
        schemaVersion: 3,
        memberName: 'alice',
        lastAttemptTime: Date.UTC(2026, 9, 22, 11),
        lastResult: 'failed',
        lastErrorCode: 'http',
        lastErrorStage: 'redeem',
        lastHttpStatus: 403,
        lastFinalUrlPath: '/mission/daily/redeem',
        lastDurationMs: 321,
        lastTrigger: 'alarm',
        checkInDays: 5,
      },
    })

    expect(text).toContain('扩展版本：1.9.0')
    expect(text).toContain('账号状态：已确认')
    expect(text).toContain('今日状态：签到失败')
    expect(text).toContain('失败分类：http')
    expect(text).toContain('失败阶段：发起领取请求')
    expect(text).toContain('HTTP 状态：403')
    expect(text).toContain('最终地址：/mission/daily/redeem')
    expect(text).toContain('请求耗时：321 ms')
    expect(text).toContain('触发来源：定时任务')
    expect(text).toContain('UTC+8')
    expect(text).not.toContain('?once=')
    expect(text).not.toContain('alice')
  })

  it('包含计划重试时间与分类', () => {
    const retryAt = Date.UTC(2026, 9, 22, 11, 5)
    const text = buildCheckInDiagnostic({
      now: Date.UTC(2026, 9, 22, 12),
      autoCheckInEnabled: true,
      extensionVersion: '1.9.0',
      browser: 'Chromium（test）',
      timezoneOffsetMinutes: -480,
      dailyInfo: {
        schemaVersion: 3,
        memberName: 'alice',
        lastAttemptTime: Date.UTC(2026, 9, 22, 11),
        lastResult: 'failed',
        lastErrorCode: 'network',
        nextActionAt: retryAt,
        retryCause: 'transient',
      },
    })

    expect(text).toContain('计划重试：')
    expect(text).toContain('重试分类：transient')
  })
})
