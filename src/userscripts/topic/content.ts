import { $topicContentBox } from '../globals'
import { iconIgnore, iconLove, iconStar, iconTwitter } from '../icons'

export function handlingContent() {
  {
    $topicContentBox.find('.topic_content a[href]').prop('target', '_blank')
  }

  {
    const $topicContents = $topicContentBox.find('.subtle > .topic_content')

    const textLength = $topicContents.text().length

    if (textLength >= 200) {
      $topicContents.each((_, topicContent) => {
        if (textLength >= 400) {
          topicContent.style.fontSize = '13px'
        }
        topicContent.style.fontSize = '14px'
      })
    }
  }

  {
    const topicBtn = $('.topic_buttons .tb').addClass('v2p-tb')
    topicBtn.eq(0).append(`<span class="v2p-tb-icon">${iconStar}</span>`)
    topicBtn.eq(1).append(`<span class="v2p-tb-icon">${iconTwitter}</span>`)
    topicBtn.eq(2).append(`<span class="v2p-tb-icon">${iconIgnore}</span>`)
    topicBtn.eq(3).append(`<span class="v2p-tb-icon">${iconLove}</span>`)
  }
}
