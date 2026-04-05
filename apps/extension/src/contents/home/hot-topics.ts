import { createPopup } from '../../components/popup'
import { StorageKey } from '../../constants'
import { iconLoading } from '../../icons'
import { getHotTopics } from '../../services'
import type { HotTopic, HotTopicRange } from '../../types'
import { useTopicPreview } from '../../use-topic-preview'
import { getStorageSync, isBrowserExtension } from '../../utils'
import { $wrapper } from '../globals'

type RangeAlias = '近三日' | '近七日' | '近一月'

const rangeByAlias: Record<RangeAlias, HotTopicRange> = {
  近三日: '3d',
  近七日: '7d',
  近一月: '30d',
}

function isRangeAlias(value: string): value is RangeAlias {
  return value in rangeByAlias
}

/**
 * 历史热议主题。
 */
export function handleHotTopics() {
  const $topicsHot = $('#TopicsHot')
  const $hotHeader = $topicsHot.find('> .cell:first-of-type').addClass('v2p-topics-hot-header')
  $hotHeader.find('.fade').text('热议主题')

  $hotHeader.nextAll('.cell').wrapAll('<div class="v2p-topics-hot">')
  const $listWrapper = $('.v2p-topics-hot')

  let $todayCells = $listWrapper.find('> .cell')

  // 取第 2 个 cell 作为渲染模板；若列表不足则降级取第 1 个
  const $cell = $todayCells.eq($todayCells.length > 1 ? 1 : 0).clone()
  $cell.find('.v2p-topic-preview-btn').remove()

  // 没有可用的模板 cell 时跳过后续逻辑，避免渲染出空白条目
  if ($cell.length === 0) {
    return
  }

  const $text = $('<span class="v2p-topics-hot-picker-text">今日</span>')
  const $trigger = $(
    '<div class="v2p-topics-hot-picker"><span class="v2p-topics-hot-icon"><i data-lucide="chevron-down"></i></span></div>',
  )
    .prepend($text)
    .appendTo($hotHeader)

  const $dropdownContent = $(`
    <div class="v2p-select-dropdown">
      <div class="v2p-select-item v2p-select-item-active" data-alias="今日">今日</div>
      <div class="v2p-select-item" data-alias="近三日">近三日</div>
      <div class="v2p-select-item" data-alias="近七日">近七日</div>
      <div class="v2p-select-item" data-alias="近一月">近一月</div>
    </div>
  `)

  const popupControl = createPopup({
    root: $wrapper,
    trigger: $trigger,
    content: $dropdownContent,
    offsetOptions: { mainAxis: 5, crossAxis: -5 },
  })

  let abortController: AbortController | null = null

  /** 缓存 TTL（毫秒），与 cron 最小触发间隔（15 分钟）对齐，避免在数据更新前重复请求。 */
  const CACHE_TTL = 15 * 60 * 1000
  const cache = new Map<RangeAlias, { data: HotTopic[], timestamp: number }>()

  const getCachedData = (key: RangeAlias): HotTopic[] | null => {
    const entry = cache.get(key)

    if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
      return entry.data
    }

    // 过期则清除
    cache.delete(key)

    return null
  }

  const canPreview = isBrowserExtension()
  const options = canPreview ? getStorageSync()[StorageKey.Options] : undefined
  const isPreviewMode = options?.topic?.openMode === 'preview'
  const topicPreview = canPreview ? useTopicPreview() : null
  const $previewBtn = $('<button class="v2p-topic-preview-btn">预览</button>')

  const renderNewTopicList = (result: HotTopic[]) => {
    $listWrapper.empty()

    if (result.length === 0) {
      $listWrapper.append('<div class="v2p-topics-hot-empty">暂无热议主题</div>')

      return
    }

    result.forEach((it) => {
      const $clonedCell = $cell.clone()
      const $user = $clonedCell.find('a[href^="/member"]')
      $user.attr('href', `/member/${it.member.username}`)
      $user.find('> img').attr('src', it.member.avatar_mini)

      const linkHref = `/t/${it.id}`
      const topicId = String(it.id)
      const $titleLink = $clonedCell.find('.item_hot_topic_title > a')
      $titleLink.text(it.title).attr('href', linkHref)

      if (topicPreview) {
        const $titleContainer = $clonedCell.find('.item_hot_topic_title')

        // 预览模式：点击主题链接时弹出预览窗口。
        if (isPreviewMode) {
          $titleLink.on('click', (ev) => {
            ev.preventDefault()
            topicPreview.handlePreview({ topicId, topicTitle: it.title, linkHref })
          })
        }

        $previewBtn
          .clone()
          .on('click', () => {
            topicPreview.handlePreview({ topicId, topicTitle: it.title, linkHref })
          })
          .appendTo($titleContainer)
      }

      $listWrapper.append($clonedCell)
    })
  }

  const renderError = () => {
    $listWrapper.empty().append('<div class="v2p-topics-hot-empty">加载失败，请稍后再试</div>')
  }

  const showLoading = () => {
    $listWrapper.empty().append(`
    <div class="v2p-topics-hot-loading">
      <div class="v2p-icon-loading">${iconLoading}</div>
    </div>
    `)
  }

  /** 恢复「今日」列表。 */
  const restoreToday = () => {
    $listWrapper.empty().append($todayCells)
  }

  const fetchAndRender = (alias: RangeAlias) => {
    const cachedData = getCachedData(alias)

    if (cachedData) {
      renderNewTopicList(cachedData)

      return
    }

    abortController = new AbortController()

    void getHotTopics({
      range: rangeByAlias[alias],
      signal: abortController.signal,
    })
      .then(({ result }) => {
        cache.set(alias, { data: result, timestamp: Date.now() })
        renderNewTopicList(result)
      })
      .catch((err) => {
        // AbortError 是用户主动取消，不需要显示错误
        if (err instanceof Error && err.name === 'AbortError') {
          return
        }

        console.error('获取热议主题失败:', err)
        renderError()
      })
  }

  $dropdownContent.find('.v2p-select-item').on('click', (ev) => {
    popupControl.close()

    const $target = $(ev.currentTarget)

    if ($target.hasClass('v2p-select-item-active')) {
      return
    }

    abortController?.abort()

    const alias = $target.data('alias')

    if (typeof alias !== 'string') {
      return
    }

    $target.addClass('v2p-select-item-active').siblings().removeClass('v2p-select-item-active')
    $text.text(alias)

    // 「今日」直接恢复原始 DOM，无需 loading 和网络请求。
    if (alias === '今日') {
      restoreToday()

      return
    }

    if (isRangeAlias(alias)) {
      // 切换到远程数据时，先保存今日 cells 以便后续恢复。
      $todayCells = $todayCells.detach()
      showLoading()
      fetchAndRender(alias)

      return
    }

    // 未知 alias（正常不会触发），兜底恢复今日列表避免 UI 卡在 loading。
    restoreToday()
  })
}
