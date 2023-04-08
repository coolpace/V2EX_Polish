import { iconIgnore, iconLove, iconStar, iconTwitter } from '../../icons'
import { $topicContentBox } from '../globals'
import { getOptions } from '../helpers'

/**
 * 处理主题的正文内容。
 */
export function handlingContent() {
  {
    void getOptions().then((options) => {
      if (options.openInNewTab) {
        $topicContentBox
          .find('.topic_content a[href]')
          .prop('target', '_blank')
          .prop('rel', 'noopener noreferrer')
      }
    })
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
