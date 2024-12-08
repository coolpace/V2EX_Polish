import { ChevronLeft, ChevronRight, createElement, PanelRight, PanelTop } from 'lucide'

import {
  MAX_TOPIC_CONTENT_HEIGHT,
  MIN_RIGHTBAR_HIDE_WIDTH,
  MIN_TOPIC_PAGE_WIDTH,
  StorageKey,
} from '../../constants'
import { getStorageSync } from '../../utils'
import { $main, $topicContentBox, $wrapperContent } from '../globals'

const $layoutToggle = $('<span class="v2p-layout-toggle v2p-hover-btn">')

const iconLayoutV = createElement(PanelTop)
iconLayoutV.setAttribute('width', '100%')
iconLayoutV.setAttribute('height', '100%')

const iconLayoutH = createElement(PanelRight)
iconLayoutH.setAttribute('width', '100%')
iconLayoutH.setAttribute('height', '100%')

const $toggleRightbarBtn = $(`
  <div class="v2p-toggle-rightbar-btn">
    <span class="v2p-toggle-rightbar-icon"></span>
  </div>
`)

const iconChevronLeft = createElement(ChevronLeft)
iconChevronLeft.setAttribute('width', '100%')
iconChevronLeft.setAttribute('height', '100%')

const iconChevronRight = createElement(ChevronRight)
iconChevronRight.setAttribute('width', '100%')
iconChevronRight.setAttribute('height', '100%')

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
  const $rightbar = $('#Rightbar')
  $rightbar.addClass('v2p-layout-rightbar')

  $toggleRightbarBtn.insertAfter($rightbar).hide()
  $('.v2p-toggle-rightbar-icon').html(iconChevronLeft)

  $toggleRightbarBtn.on('click', () => {
    const isVisible = $rightbar.hasClass('v2p-layout-rightbar-visible')
    if (isVisible) {
      $('#Rightbar').removeClass('v2p-layout-rightbar-visible')
      $('.v2p-toggle-rightbar-icon').html(iconChevronLeft)
    } else {
      $('#Rightbar').addClass('v2p-layout-rightbar-visible')
      $('.v2p-toggle-rightbar-icon').html(iconChevronRight)
    }
  })

  // 添加窗口大小变化的监听
  const handleResize = () => {
    if (window.innerWidth < MIN_TOPIC_PAGE_WIDTH) {
      switchToVerticalLayout()
    } else {
      // 重新应用当前布局设置
      const storage = getStorageSync()
      const options = storage[StorageKey.Options]

      if (options.reply.layout === 'auto') {
        const contentHeight = $topicContentBox.height() || 0

        if (contentHeight >= MAX_TOPIC_CONTENT_HEIGHT) {
          switchToHorizontalLayout()
        } else {
          switchToVerticalLayout()
        }
      } else if (options.reply.layout === 'horizontal') {
        switchToHorizontalLayout()
      }
    }

    if (window.innerWidth < MIN_RIGHTBAR_HIDE_WIDTH) {
      $toggleRightbarBtn.show()
      $('.v2p-layout-rightbar').addClass('v2p-layout-rightbar-float')
    } else {
      $toggleRightbarBtn.hide()
      $('.v2p-layout-rightbar').removeClass('v2p-layout-rightbar-float')
    }
  }

  // 初始化时执行一次
  handleResize()

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)

  $layoutToggle.on('click', () => {
    toggleTopicLayout()
  })

  $('.tools').prepend($layoutToggle)
}
