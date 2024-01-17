import { createPopup } from '../../components/popup'
import { iconLoading } from '../../icons'
import { getHotTopics } from '../../services'
import { $wrapper } from '../globals'

export function handlingHotTopics() {
  const $topicsHot = $('#TopicsHot')
  const $hotHeader = $topicsHot.find('> .cell:first-of-type').addClass('v2p-topics-hot-header')
  $hotHeader.find('.fade').text('热议主题')

  $hotHeader.nextAll('.cell').wrapAll('<div class="v2p-topics-hot">')
  const $topicListWrapper = $('.v2p-topics-hot')

  let $todayHotCells = $topicListWrapper.find('> .cell')
  const $cell = $todayHotCells.eq(1).clone()
  $cell.find('.v2p-topic-preview-btn').remove()

  const $trigger = $('<span class="v2p-picker-hot">今日</span>').appendTo($hotHeader)

  const $toolContent = $(`
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
    content: $toolContent,
    offsetOptions: { mainAxis: 5, crossAxis: -5 },
  })

  $toolContent.find('.v2p-select-item').on('click', (ev) => {
    popupControl.close()
    const $target = $(ev.currentTarget)

    if ($target.hasClass('v2p-select-item-active')) {
      return
    }

    const { alias } = $target.data()

    const now = Math.floor(Date.now() / 1000)
    const oneDay = 60 * 60 * 24

    $target.addClass('v2p-select-item-active').siblings().removeClass('v2p-select-item-active')
    $todayHotCells = $todayHotCells.detach()

    $topicListWrapper.empty().append(`
    <div class="v2p-topics-hot-loading">
      <div class="v2p-icon-loading">${iconLoading}</div>
    </div>
    `)

    if (typeof alias === 'string') {
      $trigger.text(alias)
    }

    switch (alias) {
      case '今日':
        $topicListWrapper.empty().append($todayHotCells)
        return

      case '近三日':
      case '近七日':
      case '近一月': {
        const days = alias === '近三日' ? 3 : alias === '近七日' ? 7 : 30

        getHotTopics({ startTime: now - days * oneDay, endTime: now }).then(({ result }) => {
          $topicListWrapper.empty()

          result.forEach((it) => {
            const $clonedCell = $cell.clone()
            const $user = $clonedCell.find('a[href^="/member"]')
            $user.attr('href', `/member/${it.member.username}`)
            $user.find('> img').attr('src', it.member.avatar_mini)
            $clonedCell.find('.item_hot_topic_title > a').text(it.title).attr('href', it.url)
            $topicListWrapper.append($clonedCell)
          })
        })
        return
      }
    }
  })
}
