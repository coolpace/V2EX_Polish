import type {
  TopicFilterCondition,
  TopicFilterField,
  TopicFilterLogic,
  TopicFilterOperator,
  TopicFilterRule,
  TopicFilterScope,
  TopicFilterSettings,
} from '../types'

const defaultAdvancedScopes = ['home', 'node'] satisfies TopicFilterScope[]

function parseLines(value: string | number | string[] | undefined): string[] {
  let text = ''

  if (typeof value === 'string' || typeof value === 'number') {
    text = String(value)
  }

  if (Array.isArray(value)) {
    text = value.join('\n')
  }

  return text
    .split(/[\n,，]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function stringifyLines(values: string[] | undefined): string {
  return values?.join('\n') ?? ''
}

function appendAdvancedCondition($rule: JQuery, condition?: Partial<TopicFilterCondition>) {
  const $condition = $($('#topic-filter-advanced-condition-template').html())
  $condition.attr('data-condition-id', condition?.id ?? crypto.randomUUID())

  if (condition) {
    $condition.find('.topic-filter-condition-field').val(condition.field ?? 'title')
    $condition.find('.topic-filter-condition-operator').val(condition.operator ?? 'contains')
    $condition.find('.topic-filter-condition-value').val(condition.value ?? '')
  }

  $condition.find('.topic-filter-condition-delete').on('click', () => {
    $condition.remove()
    $('.topic-filter-advanced-rule-list').trigger('topic-filter-change')
  })

  $condition.find('input, select').on('change', () => {
    $('.topic-filter-advanced-rule-list').trigger('topic-filter-change')
  })

  $rule.find('.topic-filter-condition-list').append($condition)
}

function appendAdvancedRule(rule?: TopicFilterRule) {
  const $rule = $($('#topic-filter-advanced-rule-template').html())
  const scopes = rule?.scopes ?? defaultAdvancedScopes
  $rule.attr('data-rule-id', rule?.id ?? crypto.randomUUID())

  $rule.find('.topic-filter-rule-name').val(rule?.name ?? '')
  $rule.find('.topic-filter-rule-enabled').prop('checked', rule?.enabled ?? true)
  $rule.find('.topic-filter-rule-logic').val(rule?.logic ?? 'all')
  $rule.find('.topic-filter-rule-scope').each((_, inputEl) => {
    const $input = $(inputEl)
    $input.prop('checked', scopes.includes($input.val() as TopicFilterScope))
  })

  rule?.conditions.forEach((condition) => {
    appendAdvancedCondition($rule, condition)
  })

  if (!rule) {
    appendAdvancedCondition($rule)
  }

  $rule.find('.topic-filter-rule-delete').on('click', () => {
    $rule.remove()
    $('.topic-filter-advanced-rule-list').trigger('topic-filter-change')
  })

  $rule.find('input, select').on('change', () => {
    $('.topic-filter-advanced-rule-list').trigger('topic-filter-change')
  })

  $rule.find('.topic-filter-add-condition-btn').on('click', () => {
    appendAdvancedCondition($rule)
    $('.topic-filter-advanced-rule-list').trigger('topic-filter-change')
  })

  $('.topic-filter-advanced-rule-list').append($rule)
}

export function readTopicFilterOptions(): TopicFilterSettings {
  const rules: TopicFilterRule[] = []

  $('.topic-filter-advanced-rule-list > .topic-filter-advanced-rule').each((_, ruleEl) => {
    const $rule = $(ruleEl)
    const scopes: TopicFilterScope[] = []
    const conditions: TopicFilterCondition[] = []

    $rule.find('.topic-filter-rule-scope:checked').each((_, scopeEl) => {
      scopes.push($(scopeEl).val() as TopicFilterScope)
    })

    $rule.find('.topic-filter-condition-list > .topic-filter-condition').each((_, conditionEl) => {
      const $condition = $(conditionEl)
      const value = String($condition.find('.topic-filter-condition-value').val() ?? '').trim()

      if (value) {
        conditions.push({
          id: $condition.attr('data-condition-id') ?? crypto.randomUUID(),
          field: $condition.find('.topic-filter-condition-field').val() as TopicFilterField,
          operator: $condition.find('.topic-filter-condition-operator').val() as TopicFilterOperator,
          value,
        })
      }
    })

    if (scopes.length > 0 && conditions.length > 0) {
      rules.push({
        id: $rule.attr('data-rule-id') ?? crypto.randomUUID(),
        name: String($rule.find('.topic-filter-rule-name').val() ?? '').trim(),
        enabled: $rule.find('.topic-filter-rule-enabled').prop('checked'),
        scopes,
        logic: $rule.find('.topic-filter-rule-logic').val() as TopicFilterLogic,
        conditions,
      })
    }
  })

  return {
    version: 1,
    enabled: $('#topic_filter_enabled').prop('checked'),
    quick: {
      titleKeywords: parseLines($('#topic_filter_title_keywords').val()),
      nodes: parseLines($('#topic_filter_nodes').val()),
    },
    advanced: {
      enabled: $('#topic_filter_advanced_enabled').prop('checked'),
      rules,
    },
  }
}

export function initTopicFilterOptions(
  settings: TopicFilterSettings | undefined,
  handleChange: () => void,
) {
  $('#topic_filter_enabled').prop('checked', settings?.enabled ?? false)
  $('#topic_filter_title_keywords').val(stringifyLines(settings?.quick.titleKeywords))
  $('#topic_filter_nodes').val(stringifyLines(settings?.quick.nodes))
  $('#topic_filter_advanced_enabled').prop('checked', settings?.advanced.enabled ?? false)

  $('.topic-filter-advanced-rule-list').empty()
  settings?.advanced.rules.forEach((rule) => {
    appendAdvancedRule(rule)
  })

  // 如果已有高级规则，默认展开 details
  if (settings?.advanced.rules.length) {
    $('.topic-filter-advanced').prop('open', true)
  }

  $('#topic_filter_enabled, #topic_filter_advanced_enabled').on('change', handleChange)
  $('#topic_filter_title_keywords, #topic_filter_nodes').on('input', handleChange)
  $('.topic-filter-advanced-rule-list').on('topic-filter-change', handleChange)
  $('.topic-filter-add-rule-btn').on('click', () => {
    appendAdvancedRule()
    handleChange()
  })
}
