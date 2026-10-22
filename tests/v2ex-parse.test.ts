import { describe, expect, it } from 'vitest'

import {
  extractOnceFromHtml,
  normalizeOnce,
  parseBlockUrl,
  parseIgnoreReplyUrl,
  parseIgnoreTopicUrl,
  parseLikesCount,
} from '../apps/extension/src/utils/v2ex'

describe('normalizeOnce', () => {
  it('接受数字和数字字符串', () => {
    expect(normalizeOnce('96942')).toBe('96942')
    expect(normalizeOnce(96942)).toBe('96942')
    expect(normalizeOnce(0)).toBe('0')
  })

  it('拒绝空值和非法格式', () => {
    expect(normalizeOnce(undefined)).toBeNull()
    expect(normalizeOnce(null)).toBeNull()
    expect(normalizeOnce('')).toBeNull()
    expect(normalizeOnce(' 123 ')).toBeNull()
    expect(normalizeOnce('123abc')).toBeNull()
    expect(normalizeOnce(-1)).toBeNull()
    expect(normalizeOnce(1.5)).toBeNull()
    expect(normalizeOnce(Number.MAX_SAFE_INTEGER + 1)).toBeNull()
  })
})

describe('extractOnceFromHtml', () => {
  it('提取页面中的 once 值', () => {
    expect(extractOnceFromHtml('var once = 12345;')).toBe('12345')
    expect(extractOnceFromHtml('window.once="98765"')).toBe('98765')
  })

  it('返回第一个匹配项', () => {
    expect(extractOnceFromHtml('once = 111; once = 222;')).toBe('111')
  })

  it('没有有效 once 时返回 null', () => {
    expect(extractOnceFromHtml('')).toBeNull()
    expect(extractOnceFromHtml('var once = "abc";')).toBeNull()
  })
})

describe('parseBlockUrl', () => {
  it('解析 Block 按钮的 onclick 地址', () => {
    expect(parseBlockUrl('location.href = \'/block/622504?once=96942\''))
      .toBe('/block/622504?once=96942')

    expect(parseBlockUrl('location.href="/block/1?once=2"'))
      .toBe('/block/1?once=2')

    expect(parseBlockUrl('location.href=\'/block/1?once=2\''))
      .toBe('/block/1?once=2')
  })

  it('拒绝空值和无法解析的内容', () => {
    expect(parseBlockUrl(undefined)).toBeNull()
    expect(parseBlockUrl(null)).toBeNull()
    expect(parseBlockUrl('')).toBeNull()
    expect(parseBlockUrl('alert(1)')).toBeNull()
  })

  it('只接受站内 /block 路径', () => {
    expect(parseBlockUrl('location.href = \'https://evil.com/block/1?once=2\'')).toBeNull()
    expect(parseBlockUrl('location.href = \'//evil.com/block/1?once=2\'')).toBeNull()
    expect(parseBlockUrl('location.href = \'/ignore/reply/1?once=2\'')).toBeNull()
  })

  it('拒绝缺少 once 或 memberId 非法的地址', () => {
    expect(parseBlockUrl('location.href = \'/block/622504\'')).toBeNull()
    expect(parseBlockUrl('location.href = \'/block/abc?once=96942\'')).toBeNull()
    expect(parseBlockUrl('location.href = \'/block/1?once=abc\'')).toBeNull()
  })
})

describe('parseIgnoreTopicUrl', () => {
  it('解析屏蔽主题按钮的 onclick 地址', () => {
    expect(parseIgnoreTopicUrl('location.href = \'/ignore/topic/123?once=96942\''))
      .toBe('/ignore/topic/123?once=96942')

    expect(parseIgnoreTopicUrl('if (confirm(\'...\')) { location.href = "/ignore/topic/1?once=2"; }'))
      .toBe('/ignore/topic/1?once=2')
  })

  it('允许 once 之外的其他查询参数', () => {
    expect(parseIgnoreTopicUrl('location.href = \'/ignore/topic/1?once=2&from=home\''))
      .toBe('/ignore/topic/1?once=2&from=home')
  })

  it('拒绝空值和无法解析的内容', () => {
    expect(parseIgnoreTopicUrl(undefined)).toBeNull()
    expect(parseIgnoreTopicUrl(null)).toBeNull()
    expect(parseIgnoreTopicUrl('')).toBeNull()
    expect(parseIgnoreTopicUrl('alert(1)')).toBeNull()
  })

  it('只接受站内 /ignore/topic 路径', () => {
    expect(parseIgnoreTopicUrl('location.href = \'/ignore/topic/abc?once=1\'')).toBeNull()
    expect(parseIgnoreTopicUrl('location.href = \'/ignore/topic/1\'')).toBeNull()
    expect(parseIgnoreTopicUrl('location.href = \'/ignore/topic/1?once=abc\'')).toBeNull()
    expect(parseIgnoreTopicUrl('location.href = \'/block/1?once=1\'')).toBeNull()
    expect(parseIgnoreTopicUrl('location.href = \'https://evil.com/ignore/topic/1?once=1\''))
      .toBeNull()
  })
})

describe('parseIgnoreReplyUrl', () => {
  it('从 href 或 onclick 中解析忽略回复地址', () => {
    expect(parseIgnoreReplyUrl('/ignore/reply/123?once=96942', undefined))
      .toBe('/ignore/reply/123?once=96942')

    expect(parseIgnoreReplyUrl(
      'javascript:if (confirm(\'...\')) { location.href = \'/ignore/reply/1?once=2\'; }',
      undefined,
    )).toBe('/ignore/reply/1?once=2')

    expect(parseIgnoreReplyUrl(
      'javascript:void(0)',
      'if (confirm(\'...\')) { location.href = "/ignore/reply/1?once=2"; }',
    )).toBe('/ignore/reply/1?once=2')
  })

  it('允许 once 之外的其他查询参数', () => {
    expect(parseIgnoreReplyUrl(undefined, '/ignore/reply/1?once=2&from=topic'))
      .toBe('/ignore/reply/1?once=2&from=topic')
  })

  it('拒绝空值和无法解析的内容', () => {
    expect(parseIgnoreReplyUrl(undefined, undefined)).toBeNull()
    expect(parseIgnoreReplyUrl('', '')).toBeNull()
    expect(parseIgnoreReplyUrl('javascript:void(0)', undefined)).toBeNull()
  })

  it('只接受站内 /ignore/reply 路径', () => {
    expect(parseIgnoreReplyUrl('/ignore/reply/1', undefined)).toBeNull()
    expect(parseIgnoreReplyUrl('/ignore/reply/abc?once=1', undefined)).toBeNull()
    expect(parseIgnoreReplyUrl('/ignore/reply/1?once=abc', undefined)).toBeNull()
    expect(parseIgnoreReplyUrl('/ignore/topic/1?once=1', undefined)).toBeNull()
    expect(parseIgnoreReplyUrl('https://evil.com/ignore/reply/1?once=1', undefined))
      .toBeNull()
  })
})

describe('parseLikesCount', () => {
  it('解析点赞数并容忍空白', () => {
    expect(parseLikesCount('12')).toBe(12)
    expect(parseLikesCount(' 12 ')).toBe(12)
    expect(parseLikesCount('0')).toBe(0)
  })

  it('异常输入统一降级为 0', () => {
    expect(parseLikesCount(undefined)).toBe(0)
    expect(parseLikesCount(null)).toBe(0)
    expect(parseLikesCount('')).toBe(0)
    expect(parseLikesCount('abc')).toBe(0)
    expect(parseLikesCount('-1')).toBe(0)
  })
})
