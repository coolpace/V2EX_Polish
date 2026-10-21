import { describe, expect, it } from 'vitest'

import { extractDays, formatTimestamp, isSameDay, parseDateTime } from '../apps/extension/src/utils/date'

describe('formatTimestamp', () => {
  it('支持秒级与毫秒级时间戳', () => {
    expect(formatTimestamp(1704067200)).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(formatTimestamp(1704067200000)).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('按指定格式输出', () => {
    expect(formatTimestamp(1704067200, { format: 'YMDHM' })).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)
    expect(formatTimestamp(1704067200, { format: 'YMDHMS' })).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
  })
})

describe('extractDays', () => {
  it('提取「N 天前」中的天数', () => {
    expect(extractDays('3 天前')).toBe(3)
    expect(extractDays('12天前')).toBe(12)
  })

  it('没有匹配时返回 null', () => {
    expect(extractDays('刚刚')).toBeNull()
  })
})

describe('isSameDay', () => {
  it('同一天的上午与晚上返回 true', () => {
    const morning = new Date(2024, 0, 1, 9).getTime()
    const evening = new Date(2024, 0, 1, 23).getTime()

    expect(isSameDay(morning, evening)).toBe(true)
  })

  it('跨天返回 false', () => {
    const firstDay = new Date(2024, 0, 1, 23).getTime()
    const secondDay = new Date(2024, 0, 2, 0).getTime()

    expect(isSameDay(firstDay, secondDay)).toBe(false)
  })
})

describe('parseDateTime', () => {
  it('空字符串解析失败', () => {
    expect(parseDateTime('').success).toBe(false)
  })

  it('常见日期时间格式解析成功', () => {
    const result = parseDateTime('2024-10-18 08:57:40')

    expect(result.success).toBe(true)
    expect(result.date).toBeInstanceOf(Date)
  })
})
