import { describe, expect, it } from 'vitest'

import { escapeHTML } from '../apps/extension/src/utils/html'
import { deepMerge } from '../apps/extension/src/utils/object'

describe('deepMerge', () => {
  it('递归合并嵌套对象', () => {
    const target = { topic: { openMode: 'default', theme: 'light' }, enabled: true }
    const source = { topic: { openMode: 'preview' } }

    expect(deepMerge(target, source)).toEqual({
      topic: { openMode: 'preview', theme: 'light' },
      enabled: true,
    })
  })

  it('保留 source 独有的字段', () => {
    expect(deepMerge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 })
  })

  it('数组直接覆盖而不是合并', () => {
    expect(deepMerge({ list: [1, 2] }, { list: [3] })).toEqual({ list: [3] })
  })

  it('不修改原对象', () => {
    const target = { nested: { value: 1 } }
    const source = { nested: { value: 2 } }

    deepMerge(target, source)

    expect(target.nested.value).toBe(1)
  })
})

describe('escapeHTML', () => {
  it('转义所有 HTML 特殊字符', () => {
    const input = '<script>"a" & \'b\'</script>'

    expect(escapeHTML(input)).toBe(
      '&lt;script&gt;&quot;a&quot; &amp; &#39;b&#39;&lt;/script&gt;',
    )
  })

  it('普通文本保持不变', () => {
    expect(escapeHTML('V2EX Polish')).toBe('V2EX Polish')
  })
})
