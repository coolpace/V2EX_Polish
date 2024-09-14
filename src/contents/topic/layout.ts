import { createElement, PanelRight, PanelTop } from 'lucide'

import { StorageKey } from '../../constants'
import { getStorageSync } from '../../utils'
import { $main, $topicContentBox, $wrapperContent } from '../globals'

const $layoutToggle = $('<span class="v2p-layout-toggle v2p-hover-btn">')

const iconLayoutV = createElement(PanelTop)
iconLayoutV.setAttribute('width', '100%')
iconLayoutV.setAttribute('height', '100%')

const iconLayoutH = createElement(PanelRight)
iconLayoutH.setAttribute('width', '100%')
iconLayoutH.setAttribute('height', '100%')

/** 将主题页切换为水平布局。 */
const switchToHorizontalLayout = () => {
  if (!$wrapperContent.hasClass('v2p-content-layout')) {
    const $divider1 = $main.find('> .sep20:first-of-type')
    const $leftGroup = $divider1.add($divider1.next('.box'))
    const $leftSide = $('<div class="v2p-left-side">')
    $leftGroup.wrapAll($leftSide)
    const $content = $leftGroup.find('> .cell')
    $content.add($content.nextAll('.subtle')).wrapAll('<div class="v2p-left-side-content">')

    const $divider2 = $main.find('.sep20:nth-of-type(2)')
    const $rightGroup = $divider2.add($divider2.nextAll())
    $rightGroup.wrapAll('<div class="v2p-right-side">')

    $wrapperContent.addClass('v2p-content-layout')
    $main.addClass('v2p-horizontal-layout')
  }

  $layoutToggle.html(iconLayoutV)
  $layoutToggle.attr('title', '切换为垂直布局')
  $('.v2p-reply-tool-layout').text('切换为垂直布局')
}

/** 将主题页切换为垂直布局。 */
const switchToVerticalLayout = () => {
  if ($wrapperContent.hasClass('v2p-content-layout')) {
    $wrapperContent.removeClass('v2p-content-layout')
    $main.removeClass('v2p-horizontal-layout')

    $('.v2p-left-side-content').children().unwrap()

    $('.v2p-left-side').children().unwrap()
    $('.v2p-right-side').children().unwrap()
  }

  $layoutToggle.html(iconLayoutH)
  $layoutToggle.attr('title', '切换为水平布局')
  $('.v2p-reply-tool-layout').text('切换为水平布局')
}

export function toggleTopicLayout() {
  if ($wrapperContent.hasClass('v2p-content-layout')) {
    switchToVerticalLayout()
  } else {
    switchToHorizontalLayout()
  }
}

/**
 * 控制主题布局水平分屏显示。
 */
export function handleLayout() {
  const storage = getStorageSync()
  const options = storage[StorageKey.Options]

  if (options.reply.layout === 'auto') {
    const contentHeight = $topicContentBox.height()

    if (typeof contentHeight === 'number' && contentHeight >= 600) {
      switchToHorizontalLayout()
    } else {
      switchToVerticalLayout()
    }
  } else {
    if (options.reply.layout === 'horizontal') {
      switchToHorizontalLayout()
    } else {
      switchToVerticalLayout()
    }
  }

  $layoutToggle.on('click', () => {
    toggleTopicLayout()
  })

  $('.tools').prepend($layoutToggle)
}
