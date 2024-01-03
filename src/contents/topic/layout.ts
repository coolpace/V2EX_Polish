import { createElement, PanelRight, PanelTop } from 'lucide'

import { $wrapper } from '../globals'

/**
 * 控制主题布局水平分屏显示。
 */
export function handlingLayout() {
  const layoutToggle = $('<span class="v2p-layout-toggle v2p-hover-btn">')

  const iconLayoutV = createElement(PanelTop)
  iconLayoutV.setAttribute('width', '100%')
  iconLayoutV.setAttribute('height', '100%')

  const iconLayoutH = createElement(PanelRight)
  iconLayoutH.setAttribute('width', '100%')
  iconLayoutH.setAttribute('height', '100%')

  const $wrapperContent = $wrapper.find('> .content')
  const $main = $('#Main')

  const switchToHorizontalLayout = () => {
    if (!$wrapperContent.hasClass('v2p-content-layout')) {
      const $divider1 = $('#Main > .sep20:first-of-type')
      const leftGroup = $divider1.add($divider1.next('.box'))
      leftGroup.wrapAll('<div class="v2p-left-side">')

      const $divider2 = $('#Main > .sep20:nth-of-type(2)')
      const rightGroup = $divider2.add($divider2.nextAll())
      rightGroup.wrapAll('<div class="v2p-right-side">')

      $wrapperContent.addClass('v2p-content-layout')
      $main.addClass('v2p-horizontal-layout')
    }

    layoutToggle.html(iconLayoutV)
    layoutToggle.attr('title', '切换为垂直布局')
  }

  const switchToVerticalLayout = () => {
    if ($wrapperContent.hasClass('v2p-content-layout')) {
      $wrapperContent.removeClass('v2p-content-layout')
      $main.removeClass('v2p-horizontal-layout')

      const $leftSide = $('.v2p-left-side')
      $leftSide.children().appendTo($main)
      $leftSide.remove()

      const $rightSide = $('.v2p-right-side')
      $rightSide.children().appendTo($main)
      $rightSide.remove()
    }

    layoutToggle.html(iconLayoutH)
    layoutToggle.attr('title', '切换为水平布局')
  }

  switchToVerticalLayout()

  layoutToggle.on('click', () => {
    if ($wrapperContent.hasClass('v2p-content-layout')) {
      switchToVerticalLayout()
    } else {
      switchToHorizontalLayout()
    }
  })

  $('.tools').prepend(layoutToggle)
}
