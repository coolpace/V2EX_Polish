import { StorageKey } from '../../constants'
import type { TopicFilterScope } from '../../types'
import { getStorageSync } from '../../utils'
import { $topicList } from '../globals'
import { shouldHideTopic } from './matcher'

function extractCurrentNodeName(): string {
  const match = window.location.pathname.match(/^\/go\/([^/]+)/)
  let nodeName = ''

  if (match?.[1]) {
    nodeName = decodeURIComponent(match[1])
  }

  return nodeName
}

function extractNodeName(topicItem: HTMLElement): string {
  const $item = $(topicItem)
  const $nodeLink = $item.find('.topic_info a[href^="/go/"]')
  const nodeHref = $nodeLink.attr('href')
  const nodeText = $nodeLink.text().trim()
  let nodeName = extractCurrentNodeName()

  if (nodeHref) {
    const match = nodeHref.match(/\/go\/(.+)/)

    if (match?.[1]) {
      nodeName = decodeURIComponent(match[1])
    }
  }

  // 同时包含节点展示文本（中文名），让用户可以用中文节点名匹配
  if (nodeText) {
    nodeName = nodeName ? `${nodeName} ${nodeText}` : nodeText
  }

  return nodeName
}

/**
 * 对首页 / 节点页的 DOM 主题列表应用主题屏蔽规则。
 * 返回被隐藏的主题数量。
 */
export function applyTopicListFilter(scope: Extract<TopicFilterScope, 'home' | 'node'>): number {
  const options = getStorageSync()[StorageKey.Options]
  const settings = options?.topicFilter
  let hiddenCount = 0

  if (settings?.enabled) {
    $('.v2p-filter-counter').remove()

    const $items = $topicList

    $items.each((_, item) => {
      const $item = $(item)
      const nodeName = extractNodeName(item)
      const title = $item.find('.item_title .topic-link').text()

      if (shouldHideTopic(settings, scope, { title, nodeName })) {
        $item.addClass('v2p-home-filter-hidden')
        hiddenCount++
      }
    })

    if (hiddenCount > 0) {
      const $hiddenItems = $('.v2p-home-filter-hidden')
      let showing = false

      const $counter = $(`
        <div class="v2p-filter-counter cell">
          已隐藏 ${hiddenCount} 条主题
          &nbsp;·&nbsp;
          <a class="v2p-filter-show">显示</a>
        </div>
      `)

      $counter.find('.v2p-filter-show').on('click', (e) => {
        const $link = $(e.currentTarget)

        if (showing) {
          $hiddenItems.addClass('v2p-home-filter-hidden').removeClass('v2p-home-filter-revealed')
          $link.text('显示')
          showing = false
        }
        else {
          $hiddenItems.removeClass('v2p-home-filter-hidden').addClass('v2p-home-filter-revealed')
          $link.text('隐藏')
          showing = true
        }
      })

      $items.first().before($counter)
    }
  }

  return hiddenCount
}
