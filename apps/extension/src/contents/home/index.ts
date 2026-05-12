import { StorageKey } from '../../constants'
import { getStorage, isSameDay } from '../../utils'
import { $infoCard } from '../globals'
import { loadIcons } from '../helpers'
import { applyTopicListFilter } from '../topic-filter/apply-topic-list-filter'
import { handleHotTopics } from './hot-topics'
import { handleTopicList } from './topic-list'

void (async () => {
  const storage = await getStorage()
  const options = storage[StorageKey.Options]

  {
    $('#Main .tab').addClass('v2p-hover-btn')

    if (options.topic?.openMode !== 'default') {
      $('#Main .topic-link, .item_hot_topic_title > a, .item_node, a[href="/write"]').prop(
        'target',
        '_blank',
      )
    }
  }

  handleTopicList()

  applyTopicListFilter('home')

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

  handleHotTopics()

  loadIcons()
})()
