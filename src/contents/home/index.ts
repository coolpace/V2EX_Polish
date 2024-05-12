import { StorageKey } from '../../constants'
import { getStorage, isSameDay } from '../../utils'
import { $infoCard, $topicList } from '../globals'
import { loadIcons } from '../helpers'
import { handlingHotTopics } from './hot-topics'
import { handlingTopicList } from './topic-list'

void (async () => {
  const storage = await getStorage()
  const options = storage[StorageKey.Options]

  if (options.hideAccount) {
    $infoCard.find('a[href^="/member/"]').css('opacity', '0')
  }

  {
    $('#Main .tab').addClass('v2p-hover-btn')

    if (options.openInNewTab) {
      $('#Main .topic-link, .item_hot_topic_title > a, .item_node, a[href="/write"]').prop(
        'target',
        '_blank'
      )
    }
  }

  handlingTopicList()

  {
    const dailyInfo = storage[StorageKey.Daily]

    if (dailyInfo?.lastCheckInTime) {
      if (isSameDay(dailyInfo.lastCheckInTime, Date.now())) {
        const $info = $(`
          <a class="cell v2p-info-row" href="/mission/daily">
            今日已自动签到
          </a>
        `)

        $infoCard.append($info)
      }
    }
  }

  handlingHotTopics()

  loadIcons()

  {
    $topicList.each((_, ele) => {
      const $cell = $(ele)
      const bgImg = ($cell.prop('style') as CSSStyleDeclaration).backgroundImage

      if (bgImg.includes('/static/img/corner_star.png')) {
        $cell.find('.count_livid').append(' | 推荐').addClass('count_orange')
      }
    })
  }
})()
