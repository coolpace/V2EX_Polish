import { describe, expect, it } from 'vitest'

import { isMissionCheckInUrl } from '../apps/extension/src/background/check-in-message'

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
