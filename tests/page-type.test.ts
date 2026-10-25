import { describe, expect, it } from 'vitest'

import { isTopicPath } from '../apps/extension/src/contents/page-type'

describe('topic page path', () => {
  it('识别主题页路径', () => {
    expect(isTopicPath('/t/123456')).toBe(true)
    expect(isTopicPath('/t/123456/')).toBe(true)
  })

  it('忽略其他页面', () => {
    expect(isTopicPath('/')).toBe(false)
    expect(isTopicPath('/member/leoku')).toBe(false)
    expect(isTopicPath('/go/python')).toBe(false)
  })
})
