import { describe, expect, it } from 'vitest'

import { shouldHideTopic } from '../apps/extension/src/contents/topic-filter/matcher'
import type {
  TopicFilterRule,
  TopicFilterSettings,
} from '../apps/extension/src/types'

function createSettings(overrides: {
  enabled?: boolean
  titleKeywords?: string[]
  nodes?: string[]
  advancedEnabled?: boolean
  rules?: TopicFilterRule[]
} = {}): TopicFilterSettings {
  return {
    version: 1,
    enabled: overrides.enabled ?? true,
    quick: {
      titleKeywords: overrides.titleKeywords ?? [],
      nodes: overrides.nodes ?? [],
    },
    advanced: {
      enabled: overrides.advancedEnabled ?? false,
      rules: overrides.rules ?? [],
    },
  }
}

function createRule(overrides: Partial<TopicFilterRule> = {}): TopicFilterRule {
  return {
    id: 'rule-1',
    name: '测试规则',
    enabled: true,
    scopes: ['home'],
    logic: 'any',
    conditions: [
      {
        id: 'condition-1',
        field: 'title',
        operator: 'contains',
        value: '招聘',
      },
    ],
    ...overrides,
  }
}

describe('shouldHideTopic', () => {
  it('总开关关闭时不隐藏任何主题', () => {
    const settings = createSettings({ enabled: false, titleKeywords: ['招聘'] })

    expect(shouldHideTopic(settings, 'home', { title: '招聘贴', nodeName: '' })).toBe(false)
  })

  it('标题关键词不区分大小写', () => {
    const settings = createSettings({ titleKeywords: ['Remote'] })

    expect(shouldHideTopic(settings, 'home', { title: 'REMOTE job', nodeName: '' })).toBe(true)
  })

  it('热门列表不应用节点屏蔽', () => {
    const settings = createSettings({ nodes: ['programming'] })

    expect(shouldHideTopic(settings, 'hot', { title: '普通主题', nodeName: 'programming 程序员' })).toBe(false)
    expect(shouldHideTopic(settings, 'home', { title: '普通主题', nodeName: 'programming 程序员' })).toBe(true)
  })

  it('高级规则的 any 逻辑命中任意条件', () => {
    const settings = createSettings({
      advancedEnabled: true,
      rules: [createRule()],
    })

    expect(shouldHideTopic(settings, 'home', { title: '招聘前端', nodeName: '' })).toBe(true)
  })

  it('高级规则只对配置的作用域生效', () => {
    const settings = createSettings({
      advancedEnabled: true,
      rules: [createRule({ scopes: ['hot'] })],
    })

    expect(shouldHideTopic(settings, 'home', { title: '招聘前端', nodeName: '' })).toBe(false)
  })

  it('all 逻辑要求所有条件都命中', () => {
    const rule = createRule({
      logic: 'all',
      conditions: [
        { id: 'condition-1', field: 'title', operator: 'contains', value: '招聘' },
        { id: 'condition-2', field: 'node', operator: 'equals', value: 'jobs' },
      ],
    })
    const settings = createSettings({ advancedEnabled: true, rules: [rule] })

    expect(shouldHideTopic(settings, 'home', { title: '招聘前端', nodeName: 'jobs 酷工作' })).toBe(true)
    expect(shouldHideTopic(settings, 'home', { title: '招聘前端', nodeName: 'programming 程序员' })).toBe(false)
  })

  it('无效正则不会抛出异常', () => {
    const rule = createRule({
      conditions: [{ id: 'condition-1', field: 'title', operator: 'regex', value: '[' }],
    })
    const settings = createSettings({ advancedEnabled: true, rules: [rule] })

    expect(() => shouldHideTopic(settings, 'home', { title: '任意标题', nodeName: '' })).not.toThrow()
    expect(shouldHideTopic(settings, 'home', { title: '任意标题', nodeName: '' })).toBe(false)
  })
})
