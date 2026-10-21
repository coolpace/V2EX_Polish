import { describe, expect, it } from 'vitest'

import {
  contentScriptGroups,
  extensionEntries,
  injectedScripts,
  standaloneEntries,
} from '../apps/extension/shared/features'

describe('extension feature manifest', () => {
  it('每个内容脚本分组都有可注入的资源', () => {
    contentScriptGroups.forEach((group) => {
      const hasEntry = Boolean(group.entry && group.name)
      const hasStaticScript = Boolean(group.staticScript)
      const hasCss = Boolean(group.css?.length)

      expect(hasEntry || hasStaticScript || hasCss).toBe(true)
    })
  })

  it('构建入口名称唯一', () => {
    const names = extensionEntries.map(({ name }) => name)

    expect(new Set(names).size).toBe(names.length)
  })

  it('核心入口都包含在构建列表中', () => {
    const names = new Set(extensionEntries.map(({ name }) => name))

    expect(names).toContain('background')
    expect(names).toContain('popup')
    expect(names).toContain('options')
    expect(names).toContain('v2ex-topic')
    expect(names).toContain('common')
  })

  it('独立入口不会与内容脚本分组重名', () => {
    const contentScriptNames = new Set(
      contentScriptGroups
        .map(({ name }) => name)
        .filter((name): name is string => Boolean(name)),
    )

    standaloneEntries.forEach(({ name }) => {
      expect(contentScriptNames.has(name)).toBe(false)
    })
  })

  it('动态注入脚本都指向构建产物', () => {
    Object.values(injectedScripts).forEach((script) => {
      expect(script).toMatch(/^scripts\/[\w-]+\.min\.js$/)
    })
  })
})
