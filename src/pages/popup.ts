// chrome.runtime.openOptionsPage()

import { StorageKey } from '../constants'
import { fetchHotTopics, fetchLatestTopics } from '../services'
import type { API, StorageData, Topic } from '../types'
import { formatTimestamp } from '../utils'

const enum TabId {
  Hot = 'tab1',
  Latest = 'tab2',
  Setting = 'tab3',
}

interface topicsStore {
  data?: Topic[]
  lastFetchTime?: number
  lastScrollTop?: number
}

interface PopupStorageData {
  lastActiveTab: TabId
  [TabId.Hot]: topicsStore
  [TabId.Latest]: topicsStore
  [TabId.Setting]: topicsStore
}

function loadSettings() {
  const saveBtn = document.querySelector('#save')

  chrome.storage.sync.get(StorageKey.API, (result: StorageData) => {
    const patInput = document.querySelector('#pat')
    const limit = document.querySelector('#limit')
    const reset = document.querySelector('#reset')
    const remaining = document.querySelector('#remaining')

    const api = result[StorageKey.API]

    if (
      patInput instanceof HTMLInputElement &&
      limit instanceof HTMLInputElement &&
      reset instanceof HTMLInputElement &&
      remaining instanceof HTMLInputElement &&
      api
    ) {
      patInput.value = api.pat ?? ''
      limit.value = String(api.limit)
      reset.value = api.reset ? formatTimestamp(api.reset) : ''
      remaining.value = String(api.remaining)
    }
  })

  chrome.storage.sync.get(StorageKey.LegacyAPI, (result: StorageData) => {
    const limitv1 = document.querySelector('#limitv1')
    const resetv1 = document.querySelector('#resetv1')
    const remainingv1 = document.querySelector('#remainingv1')

    const apiv1 = result[StorageKey.LegacyAPI]

    if (
      limitv1 instanceof HTMLInputElement &&
      resetv1 instanceof HTMLInputElement &&
      remainingv1 instanceof HTMLInputElement &&
      apiv1
    ) {
      limitv1.value = String(apiv1.limit)
      resetv1.value = String(apiv1.reset)
      remainingv1.value = String(apiv1.remaining)
    }
  })

  async function saveOptions() {
    const patInput = document.querySelector('#pat')

    if (patInput instanceof HTMLInputElement && patInput.value.length > 0) {
      const api: API = {
        pat: patInput.value,
      }
      await chrome.storage.sync.set({ [StorageKey.API]: api })
    }
  }

  if (saveBtn instanceof HTMLButtonElement) {
    saveBtn.addEventListener('click', () => {
      void saveOptions()
    })
  }

  $('#clear-storage').on('click', () => {
    window.localStorage.clear()
  })
}

function loadTabs() {
  const generateTopicItmes = (topics: Topic[]) => {
    return topics
      .map((topic) => {
        return `
          <li class="topic-item">
            <a href="${topic.url}" target="_blank">
              <span class="title">${topic.title}</span>
              <span class="content">${topic.content}</span>
            </a>
          </li>
          `
      })
      .join('')
  }

  const isTabId = (tabId: any): tabId is TabId => {
    if (typeof tabId === 'string') {
      if (tabId === TabId.Hot || tabId === TabId.Latest || tabId === TabId.Setting) {
        return true
      }
    }
    return false
  }

  let hotTopicList: Topic[]
  let latestTopicList: Topic[]
  let hotTopicLastFetchTime: number
  let latestTopicLastFetchTime: number

  const dataString = window.localStorage.getItem('v2p_popup')
  const storageData = dataString ? (JSON.parse(dataString) as PopupStorageData) : null

  const setupTabContent = async ({ tabId }: { tabId: TabId }) => {
    let topicList: Topic[] = []
    let scrollTop = 0

    const $tabContent = $(`#${tabId}`)

    if (tabId === TabId.Hot || tabId === TabId.Latest) {
      const getData = async () => {
        $tabContent.html('Loading...')

        if (tabId === TabId.Hot) {
          const topics = await fetchHotTopics()
          hotTopicList = topics
          hotTopicLastFetchTime = Date.now()
          return topics
        } else if (tabId === TabId.Latest) {
          const topics = await fetchLatestTopics()
          latestTopicList = topics
          latestTopicLastFetchTime = Date.now()
          return topics
        }
        return []
      }

      if (storageData) {
        const { data, lastFetchTime, lastScrollTop } = storageData[tabId]

        if (lastScrollTop) {
          scrollTop = lastScrollTop
        }

        if (
          !data ||
          !lastFetchTime ||
          Date.now() - lastFetchTime > 1000 * 60 * 10 // 10 分钟内不再重新请求数据
        ) {
          topicList = await getData()
        } else {
          topicList = data
        }
      } else {
        topicList = await getData()
      }

      const $topicList = $(`<ul class="topics">`).append(generateTopicItmes(topicList))
      $tabContent.empty().append($topicList)
    }

    setTimeout(() => {
      // 每次切换 tab 都滚动到最顶部，防止受上一个 tab 的滚动位置影响。
      // 加入 setTimeout 是为了等待 tab 内容完成插入，否则会出现滚动位置不正确的情况。
      window.scrollTo(0, scrollTop)
    }, 0)
  }

  const toggleActiveTab = ($tab: JQuery) => {
    const tabId = $tab.data('target')

    if (isTabId(tabId)) {
      $tab.addClass('active').siblings().removeClass('active')
      $(`#${tabId}`).addClass('active').siblings().removeClass('active')

      void setupTabContent({ tabId })
    }
  }

  const activeTab = ({ tabId, tabEle }: { tabId?: string; tabEle?: JQuery } = {}) => {
    if (tabId) {
      toggleActiveTab($(`.tabs > li[data-target="${tabId}"]`))
    } else if (tabEle) {
      toggleActiveTab(tabEle)
    } else {
      toggleActiveTab($('.tabs > li:first-child'))
    }
  }

  activeTab({ tabId: storageData?.lastActiveTab })

  $('.tabs > li').on('click', (e) => {
    activeTab({ tabEle: $(e.currentTarget) })
  })

  loadSettings()

  window.addEventListener('unload', () => {
    const lastActiveTab = $('.tabs > li.active').data('target')

    if (isTabId(lastActiveTab)) {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0

      const data: PopupStorageData = {
        lastActiveTab,
        [TabId.Hot]: {
          data: hotTopicList,
          lastFetchTime: hotTopicLastFetchTime,
          lastScrollTop: lastActiveTab === TabId.Hot ? scrollTop : undefined,
        },
        [TabId.Latest]: {
          data: latestTopicList,
          lastFetchTime: latestTopicLastFetchTime,
          lastScrollTop: lastActiveTab === TabId.Latest ? scrollTop : undefined,
        },
        [TabId.Setting]: {
          lastScrollTop: lastActiveTab === TabId.Setting ? scrollTop : undefined,
        },
      }
      window.localStorage.setItem('v2p_popup', JSON.stringify(data))
    }
  })
}

window.addEventListener('load', () => {
  loadTabs()
})
