import { describe, expect, it } from 'vitest'

import { validateQueryParams } from '../apps/hot-topics/src/query'

function expectSuccess(result: ReturnType<typeof validateQueryParams>) {
  if (typeof result === 'string') {
    throw new Error(`预期参数校验通过，实际返回错误：${result}`)
  }

  return result
}

describe('validateQueryParams', () => {
  it('按 range 计算时间窗口', () => {
    const result = expectSuccess(validateQueryParams({ range: '3d' }))

    expect(result.range).toBe('3d')
    expect(result.limits).toBe(10)
    expect(result.expand).toBe(0)
    expect(result.endTime - result.startTime).toBe(3 * 86400)
  })

  it('支持自定义 startTime / endTime', () => {
    const result = expectSuccess(validateQueryParams({
      startTime: '1000',
      endTime: '2000',
      limits: 20,
    }))

    expect(result.startTime).toBe(1000)
    expect(result.endTime).toBe(2000)
    expect(result.limits).toBe(20)
    expect(result.range).toBeNull()
  })

  it('拒绝未知 range', () => {
    expect(validateQueryParams({ range: '1d' })).toBe('range 必须为 3d、7d 或 30d')
  })

  it('缺少时间参数时返回错误', () => {
    expect(validateQueryParams({})).toBe('缺少 range，或缺少 startTime / endTime 参数')
  })

  it('拒绝非数字时间参数', () => {
    expect(validateQueryParams({ startTime: 'abc', endTime: '2000' })).toBe('startTime 和 endTime 必须为有效数字')
  })

  it('拒绝开始时间晚于结束时间', () => {
    expect(validateQueryParams({ startTime: '2000', endTime: '1000' })).toBe('startTime 不能大于 endTime')
  })

  it('limits 仅接受 1-50 的整数', () => {
    expect(validateQueryParams({ range: '3d', limits: 0 })).toContain('limits 必须为')
    expect(validateQueryParams({ range: '3d', limits: 51 })).toContain('limits 必须为')
    expect(validateQueryParams({ range: '3d', limits: 1.5 })).toContain('limits 必须为')

    expect(expectSuccess(validateQueryParams({ range: '3d', limits: 1 })).limits).toBe(1)
    expect(expectSuccess(validateQueryParams({ range: '3d', limits: 50 })).limits).toBe(50)
  })

  it('各档位有独立默认条数', () => {
    expect(expectSuccess(validateQueryParams({ range: '3d' })).limits).toBe(10)
    expect(expectSuccess(validateQueryParams({ range: '7d' })).limits).toBe(12)
    expect(expectSuccess(validateQueryParams({ range: '30d' })).limits).toBe(16)
  })

  it('expand=1 返回展开条数', () => {
    expect(expectSuccess(validateQueryParams({ range: '3d', expand: '1' })).limits).toBe(18)
    expect(expectSuccess(validateQueryParams({ range: '7d', expand: '1' })).limits).toBe(20)
    expect(expectSuccess(validateQueryParams({ range: '30d', expand: '1' })).limits).toBe(24)
  })

  it('显式 limits 覆盖档位默认条数', () => {
    expect(expectSuccess(validateQueryParams({ range: '3d', limits: 5, expand: '1' })).limits).toBe(5)
  })

  it('拒绝非法的 expand', () => {
    expect(validateQueryParams({ range: '3d', expand: '2' })).toBe('expand 必须为 0 或 1')
  })
})
