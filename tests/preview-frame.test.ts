import { describe, expect, it } from 'vitest'

import { isPreviewSearch } from '../apps/extension/src/contents/preview-frame'

describe('preview frame query', () => {
  it('识别预览帧的查询参数', () => {
    expect(isPreviewSearch('?v2p-preview=1')).toBe(true)
    expect(isPreviewSearch('?p=2&v2p-preview=1')).toBe(true)
  })

  it('忽略非预览页面', () => {
    expect(isPreviewSearch('')).toBe(false)
    expect(isPreviewSearch('?p=2')).toBe(false)
    expect(isPreviewSearch('?v2p-preview=0')).toBe(false)
  })
})
