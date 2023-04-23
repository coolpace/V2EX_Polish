import { createButton } from '../../components/button'
import { MAX_CONTENT_HEIGHT, READABLE_CONTENT_HEIGHT } from '../../constants'
import { iconIgnore, iconLove, iconStar, iconTwitter } from '../../icons'
import { getOptions } from '../../utils'
import { $topicContentBox } from '../globals'

/**
 * 处理主题的正文内容。
 */
export async function handlingContent() {
  {
    const options = await getOptions()

    if (options.openInNewTab) {
      $topicContentBox
        .find('.topic_content a[href]')
        .prop('target', '_blank')
        .prop('rel', 'noopener noreferrer')
    }
  }

  {
    const $topicContents = $topicContentBox.find('.subtle > .topic_content')

    const textLength = $topicContents.text().length

    if (textLength >= 200) {
      $topicContents.each((_, topicContent) => {
        if (textLength >= 400) {
          topicContent.style.fontSize = '14px'
        }
        topicContent.style.fontSize = '14.5px'
      })
    }
  }

  {
    const topicBtn = $('.topic_buttons .tb').addClass('v2p-tb v2p-hover-btn')
    topicBtn.eq(0).append(`<span class="v2p-tb-icon">${iconStar}</span>`)
    topicBtn.eq(1).append(`<span class="v2p-tb-icon">${iconTwitter}</span>`)
    topicBtn.eq(2).append(`<span class="v2p-tb-icon">${iconIgnore}</span>`)
    topicBtn.eq(3).append(`<span class="v2p-tb-icon">${iconLove}</span>`)
  }
}

/**
 * 处理回复内容：
 *  - 过长内容会被折叠。
 */
export function processReplyContent($cellDom: JQuery) {
  if ($cellDom.find('.v2p-reply-content').length > 0) {
    return
  }

  const $replyContent = $cellDom.find('.reply_content')

  const contentHeight = $replyContent.height() ?? 0

  const shouldCollapsed = contentHeight + READABLE_CONTENT_HEIGHT >= MAX_CONTENT_HEIGHT

  if (shouldCollapsed) {
    const collapsedCSS = {
      maxHeight: `${READABLE_CONTENT_HEIGHT}px`,
      overflow: 'hidden',
      paddingBottom: '0',
    }

    const $contentBox = $('<div class="v2p-reply-content v2p-collapsed">').css(collapsedCSS)

    const $expandBtn = createButton({ children: '展开回复', className: 'v2p-expand-btn' })

    const toggleContent = () => {
      const collapsed = $contentBox.hasClass('v2p-collapsed')

      $contentBox
        .toggleClass('v2p-collapsed')
        .css(
          collapsed ? { maxHeight: 'none', overflow: 'auto', paddingBottom: '40px' } : collapsedCSS
        )
      $expandBtn.html(collapsed ? '收起回复' : '展开回复')
    }

    $expandBtn.on('click', () => {
      toggleContent()
    })

    $contentBox.append($replyContent.clone()).replaceAll($replyContent).append($expandBtn)
  }
}
