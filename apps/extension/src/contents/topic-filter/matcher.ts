import type {
  TopicFilterCondition,
  TopicFilterRule,
  TopicFilterScope,
  TopicFilterSettings,
} from '../../types'

export interface TopicFilterTarget {
  title: string
  nodeName: string
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase()
}

function getFieldValue(condition: TopicFilterCondition, target: TopicFilterTarget): string {
  let value = ''

  if (condition.field === 'title') {
    value = target.title
  }

  if (condition.field === 'node') {
    value = target.nodeName
  }

  return value
}

function matchCondition(condition: TopicFilterCondition, target: TopicFilterTarget): boolean {
  const expectedValue = condition.value.trim()
  const fieldValue = getFieldValue(condition, target)
  let matched = false

  if (expectedValue) {
    if (condition.operator === 'contains') {
      matched = normalizeText(fieldValue).includes(normalizeText(expectedValue))
    }

    if (condition.operator === 'equals') {
      // nodeName 可能包含 URL slug 和中文展示文本，拆分后逐一比较
      const fieldParts = condition.field === 'node'
        ? normalizeText(fieldValue).split(/\s+/)
        : [normalizeText(fieldValue)]
      matched = fieldParts.some((part) => part === normalizeText(expectedValue))
    }

    if (condition.operator === 'regex') {
      try {
        matched = new RegExp(expectedValue, 'i').test(fieldValue)
      }
      catch {
        matched = false
      }
    }
  }

  return matched
}

function matchRule(
  rule: TopicFilterRule,
  scope: TopicFilterScope,
  target: TopicFilterTarget,
): boolean {
  const conditions = rule.conditions.filter((condition) => condition.value.trim())
  let matched = false

  if (rule.enabled && rule.scopes.includes(scope) && conditions.length > 0) {
    if (rule.logic === 'any') {
      matched = conditions.some((condition) => matchCondition(condition, target))
    }

    if (rule.logic === 'all') {
      matched = conditions.every((condition) => matchCondition(condition, target))
    }
  }

  return matched
}

function matchQuickTitleKeywords(
  settings: TopicFilterSettings,
  target: TopicFilterTarget,
): boolean {
  const normalizedTitle = normalizeText(target.title)
  let matched = false

  if (normalizedTitle) {
    matched = settings.quick.titleKeywords.some((keyword) => {
      return normalizedTitle.includes(normalizeText(keyword))
    })
  }

  return matched
}

function matchQuickNodes(
  settings: TopicFilterSettings,
  scope: TopicFilterScope,
  target: TopicFilterTarget,
): boolean {
  // nodeName 现在可能包含 URL slug 和中文展示文本，按空白拆分后逐一匹配
  const nodeNameParts = normalizeText(target.nodeName).split(/\s+/)
  let matched = false

  if (scope !== 'hot' && nodeNameParts.length > 0 && nodeNameParts.some(Boolean)) {
    matched = settings.quick.nodes.some((nodeName) => {
      const normalized = normalizeText(nodeName)

      return nodeNameParts.some((part) => part === normalized)
    })
  }

  return matched
}

function matchAdvancedRules(
  settings: TopicFilterSettings,
  scope: TopicFilterScope,
  target: TopicFilterTarget,
): boolean {
  let matched = false

  if (settings.advanced.enabled) {
    matched = settings.advanced.rules.some((rule) => matchRule(rule, scope, target))
  }

  return matched
}

export function shouldHideTopic(
  settings: TopicFilterSettings | undefined,
  scope: TopicFilterScope,
  target: TopicFilterTarget,
): boolean {
  let matched = false

  if (settings?.enabled) {
    matched = matchQuickTitleKeywords(settings, target)
      || matchQuickNodes(settings, scope, target)
      || matchAdvancedRules(settings, scope, target)
  }

  return matched
}
