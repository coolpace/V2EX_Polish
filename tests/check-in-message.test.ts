import { describe, expect, it } from 'vitest'

import {
  isCheckInAuthUrl,
  isMissionCheckInUrl,
} from '../apps/extension/src/background/check-in-message'

describe('isMissionCheckInUrl', () => {
  it('只接受 V2EX 每日任务页的顶层路径', () => {
    expect(isMissionCheckInUrl('https://www.v2ex.com/mission/daily')).toBe(true)
    expect(isMissionCheckInUrl('https://v2ex.com/mission/daily/')).toBe(true)
  })

  it('拒绝其他页面、其他域名和伪造路径', () => {
    expect(isMissionCheckInUrl('https://www.v2ex.com/')).toBe(false)
    expect(isMissionCheckInUrl('https://www.v2ex.com/t/1')).toBe(false)
    expect(isMissionCheckInUrl('https://example.com/mission/daily')).toBe(false)
    expect(isMissionCheckInUrl('https://www.v2ex.com.evil.test/mission/daily')).toBe(false)
    expect(isMissionCheckInUrl(undefined)).toBe(false)
  })
})

describe('isCheckInAuthUrl', () => {
  it('识别 V2EX 登录态切换与认证页面', () => {
    expect(isCheckInAuthUrl('https://www.v2ex.com/signin?next=/')).toBe(true)
    expect(isCheckInAuthUrl('https://v2ex.com/signup')).toBe(true)
    expect(isCheckInAuthUrl('https://cn.v2ex.com/forgot')).toBe(true)
    expect(isCheckInAuthUrl('https://www.v2ex.com/2fa')).toBe(true)
  })

  it('普通页面、相似路径和外部域名不会跳过签到', () => {
    expect(isCheckInAuthUrl('https://www.v2ex.com/')).toBe(false)
    expect(isCheckInAuthUrl('https://www.v2ex.com/signin-help')).toBe(false)
    expect(isCheckInAuthUrl('https://example.com/signin')).toBe(false)
    expect(isCheckInAuthUrl(undefined)).toBe(false)
  })
})
