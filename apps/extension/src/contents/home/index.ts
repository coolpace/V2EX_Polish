import {
  resolveCheckInDisplayState,
  shouldPromptCheckInFailure,
} from '../../background/check-in-utils'
import { StorageKey } from '../../constants'
import { getRuntime } from '../../runtime'
import type { DailyInfo } from '../../types'
import { getStorage } from '../../utils'
import { $infoCard } from '../globals'
import { loadIcons } from '../helpers'
import { getCurrentMemberName } from '../member-name'
import { applyTopicListFilter } from '../topic-filter/apply-topic-list-filter'
import { handleHotTopics } from './hot-topics'
import { handleTopicList } from './topic-list'

const currentMemberName = getCurrentMemberName()

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

  function renderCheckInInfoRow(dailyInfo: DailyInfo | undefined) {
    $infoCard.find('.v2p-check-in-status').remove()

    const state = resolveCheckInDisplayState({
      now: Date.now(),
      dailyInfo,
      autoCheckInEnabled: options.autoCheckIn.enabled,
      currentMemberName,
    })

    function appendInfoRow(text: string, muted = false) {
      const className = muted
        ? 'cell v2p-info-row v2p-info-row-muted v2p-check-in-status'
        : 'cell v2p-info-row v2p-check-in-status'

      $infoCard.append(`
        <a class="${className}" href="/mission/daily">
          ${text}
        </a>
      `)
    }

    if (state.type === 'checked-in') {
      appendInfoRow('今日已自动签到')
    }
    else if (state.type === 'failed' && state.code === 'challenge') {
      appendInfoRow('V2EX 要求人机验证，点击处理', true)
    }
    else if (shouldPromptCheckInFailure(state, dailyInfo?.failureCount)) {
      // 同日连续失败多次才提醒，过滤偶发的网络抖动。
      appendInfoRow('今日签到未完成，查看详情', true)
    }
  }

  renderCheckInInfoRow(storage[StorageKey.Daily])

  getRuntime().storage.subscribe((areaName, changes) => {
    if (areaName === 'local' && changes[StorageKey.Daily]) {
      renderCheckInInfoRow(changes[StorageKey.Daily].newValue as DailyInfo | undefined)
    }
  })

  handleHotTopics()

  loadIcons()
})()
