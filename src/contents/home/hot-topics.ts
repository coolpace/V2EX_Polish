import { createPopup } from '../../components/popup'
import { iconLoading } from '../../icons'
import { getHotTopics } from '../../services'
import type { HotTopic } from '../../types'
import { $wrapper } from '../globals'

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
  const $cell = $todayCells.eq(1).clone()
  $cell.find('.v2p-topic-preview-btn').remove()

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

  const oneDay = 60 * 60 * 24

  /** 缓存 TTL（毫秒），与 cron 最小触发间隔（15 分钟）对齐，避免在数据更新前重复请求。 */
  const CACHE_TTL = 15 * 60 * 1000
  const cache = new Map<string, { data: HotTopic[], timestamp: number }>()

  const getCachedData = (key: string): HotTopic[] | null => {
    const entry = cache.get(key)

    if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
      return entry.data
    }

    // 过期则清除
    cache.delete(key)

    return null
  }

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
      $clonedCell.find('.item_hot_topic_title > a').text(it.title).attr('href', `/t/${it.id}`)
      $listWrapper.append($clonedCell)
    })
  }

  const renderError = () => {
    $listWrapper.empty().append('<div class="v2p-topics-hot-empty">加载失败，请稍后再试</div>')
  }

  $dropdownContent.find('.v2p-select-item').on('click', (ev) => {
    popupControl.close()

    const $target = $(ev.currentTarget)

    if ($target.hasClass('v2p-select-item-active')) {
      return
    }

    abortController?.abort()

    const { alias } = $target.data()

    $target.addClass('v2p-select-item-active').siblings().removeClass('v2p-select-item-active')
    $todayCells = $todayCells.detach()

    $listWrapper.empty().append(`
    <div class="v2p-topics-hot-loading">
      <div class="v2p-icon-loading">${iconLoading}</div>
    </div>
    `)

    if (typeof alias === 'string') {
      $text.text(alias)

      switch (alias) {
        case '今日':
          $listWrapper.empty().append($todayCells)

          return

        case '近三日':
          // fall through

        case '近七日':
          // fall through

        case '近一月': {
          const cachedData = getCachedData(alias)

          if (cachedData) {
            renderNewTopicList(cachedData)
          }
          else {
            const days = alias === '近三日' ? 3 : alias === '近七日' ? 7 : 30
            const now = Math.floor(Date.now() / 1000)

            abortController = new AbortController()

            void getHotTopics({
              startTime: now - days * oneDay,
              endTime: now,
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

          return
        }
      }
    }
  })
}
