import { describe, expect, it } from 'vitest'

import { resolvePreviewFrameMode } from '../apps/extension/src/contents/preview-frame'

describe('preview frame mode', () => {
  it('本扩展的预览弹窗隐藏顶部导航', () => {
    expect(resolvePreviewFrameMode({ embedded: true, search: '?v2p-preview=1' })).toBe('1')
    expect(resolvePreviewFrameMode({ embedded: false, search: '?p=2&v2p-preview=1' })).toBe('1')
  })

  it('第三方 iframe 预览只收起右侧栏', () => {
    expect(resolvePreviewFrameMode({ embedded: true, search: '' })).toBe('embed')
    expect(resolvePreviewFrameMode({ embedded: true, search: '?p=2' })).toBe('embed')
  })

  it('普通页面不标记预览帧', () => {
    expect(resolvePreviewFrameMode({ embedded: false, search: '' })).toBeNull()
    expect(resolvePreviewFrameMode({ embedded: false, search: '?p=2' })).toBeNull()
    expect(resolvePreviewFrameMode({ embedded: false, search: '?v2p-preview=0' })).toBeNull()
  })
})
