import { $topicContentBox } from '../globals'
import { iconIgnore, iconLove, iconStar, iconTwitter } from '../icons'

export function handlingContent() {
  {
    $topicContentBox.find('.topic_content a[href]').prop('target', '_blank')
  }

  {
    $topicContentBox.find('.subtle > .topic_content').each((_, topicContent) => {
      const text = topicContent.textContent
      if (text) {
        if (text.length >= 300) {
          topicContent.style.fontSize = '13px'
        } else if (text.length >= 120) {
          topicContent.style.fontSize = '14px'
        }
      }
    })
  }

  {
    const topicBtn = $('.topic_buttons .tb').addClass('v2p-tb')
    topicBtn.eq(0).append(`<span class="v2p-tb-icon">${iconStar}</span>`)
    topicBtn.eq(1).append(`<span class="v2p-tb-icon">${iconTwitter}</span>`)
    topicBtn.eq(2).append(`<span class="v2p-tb-icon">${iconIgnore}</span>`)
    topicBtn.eq(3).append(`<span class="v2p-tb-icon">${iconLove}</span>`)
  }
}
