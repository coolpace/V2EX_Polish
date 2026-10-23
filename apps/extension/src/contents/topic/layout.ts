import { ChevronLeft, ChevronRight, createElement, PanelRight, PanelTop } from 'lucide'

import {
  MAX_TOPIC_CONTENT_HEIGHT,
  MIN_TOPIC_PAGE_WIDTH,
  StorageKey,
} from '../../constants'
import { getStorageSync } from '../../utils'
import { $commentBox, $main, $replyBox, $topicContentBox, $wrapperContent } from '../globals'

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
    const $target = $commentBox.length > 0
      ? $commentBox
      : $('#no-comments-yet').get().length > 0
        ? $('#no-comments-yet')
        : $replyBox
    const $divider = $target.prev('.sep20')
    const $rightGroup = $divider.add($divider.nextAll())
    const $rightSide = $('<div class="v2p-right-side">')
    $rightGroup.wrapAll($rightSide)

    const $leftGroup = $($('.v2p-right-side').prevAll().get().reverse())
    const $leftSide = $('<div class="v2p-left-side">')
    const $leftGroupWrapper = $('<div class="v2p-left-group">')
    $leftGroup.wrapAll($leftGroupWrapper)
    $('.v2p-left-group').wrapAll($leftSide)

    const $leftSideContent = $('<div class="v2p-left-side-content">')
    const $topicContent = $leftGroup.find('> .cell')
    $topicContent.add($topicContent.nextAll('.subtle')).wrapAll($leftSideContent)

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
  }
  else {
    switchToHorizontalLayout()
  }
}

/**
 * 控制主题布局水平分屏显示。
 */
export function handleLayout() {
  const $rightbar = $('#Rightbar')

  // 右侧栏的收起与展开按钮的显隐都由首帧样式决定，
  // 详见 page-type.ts、preview-frame.ts 与 v2ex-theme-default.scss。
  $toggleRightbarBtn.insertAfter($rightbar)
  $('.v2p-toggle-rightbar-icon').html(iconChevronLeft)

  $toggleRightbarBtn.on('click', () => {
    const isVisible = $rightbar.hasClass('v2p-layout-rightbar-visible')

    if (isVisible) {
      $rightbar.removeClass('v2p-layout-rightbar-visible')
      $('.v2p-toggle-rightbar-icon').html(iconChevronLeft)
    }
    else {
      $rightbar.addClass('v2p-layout-rightbar-visible')
      $('.v2p-toggle-rightbar-icon').html(iconChevronRight)
    }
  })

  // 添加窗口大小变化的监听
  const handleResize = () => {
    if (window.innerWidth < MIN_TOPIC_PAGE_WIDTH) {
      switchToVerticalLayout()
    }
    else {
      // 重新应用当前布局设置
      const storage = getStorageSync()
      const options = storage[StorageKey.Options]

      if (options.reply.layout === 'auto') {
        const contentHeight = $topicContentBox.height() || 0

        if (contentHeight >= MAX_TOPIC_CONTENT_HEIGHT) {
          switchToHorizontalLayout()
        }
        else {
          switchToVerticalLayout()
        }
      }
      else if (options.reply.layout === 'horizontal') {
        switchToHorizontalLayout()
      }
    }
  }

  // 初始化布局切换按钮的图标（设置默认图标）
  $layoutToggle.html(iconLayoutH)
  $layoutToggle.attr('title', '切换为水平布局')

  // 初始化时执行一次
  handleResize()

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)

  $layoutToggle.on('click', () => {
    toggleTopicLayout()
  })

  $('.tools').prepend($layoutToggle)
}
