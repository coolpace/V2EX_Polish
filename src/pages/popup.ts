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
  data: Topic[]
  lastFetchTime: number
  lastScrollTop?: number
}

interface PopupStorageData {
  lastActiveTab: TabId
  [TabId.Hot]: topicsStore
  [TabId.Latest]: topicsStore
  [TabId.Setting]: topicsStore
}

function loadAPIInfo() {
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
}

async function loadTopics() {
  const isTabId = (tabId: any): tabId is TabId => {
    return typeof tabId === 'string'
  }

  const activeTab = ({
    tabId,
    tabEle,
    scrollTop = 0,
  }: { tabId?: string; tabEle?: JQuery; scrollTop?: number } = {}) => {
    const toggle = ($tab: JQuery) => {
      const target = $tab.data('target')
      if (isTabId(target)) {
        const $content = $(`#${target}`)
        $tab.addClass('active').siblings().removeClass('active')
        $content.addClass('active').siblings().removeClass('active')

        setTimeout(() => {
          // 每次切换 tab 都滚动到最顶部，防止受上一个 tab 的滚动位置影响。
          // 加入 setTimeout 是为了等待 tab 内容完成插入，否则会出现滚动位置不正确的情况。
          window.scrollTo(0, scrollTop)
        }, 0)
      }
    }

    if (tabId) {
      toggle($(`.tabs > li[data-target="${tabId}"]`))
    } else if (tabEle) {
      toggle(tabEle)
    } else {
      toggle($('.tabs > li:first-child'))
    }
  }

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

  let hotTopicList: Topic[] = []
  let latestTopicList: Topic[] = []

  const dataString = window.localStorage.getItem('v2p_popup')

  if (dataString) {
    const data: PopupStorageData = JSON.parse(dataString)
    hotTopicList = data[TabId.Hot].data
    latestTopicList = data[TabId.Latest].data
    const { lastScrollTop, lastFetchTime } = data[data.lastActiveTab]

    if (Date.now() - lastFetchTime > 1000 * 60 * 5) {
      // 5 分钟内不再重新请求数据。
      const [hotTopics, latestTopics] = await Promise.all([fetchHotTopics(), fetchLatestTopics()])

      hotTopicList = hotTopics
      latestTopicList = latestTopics
    }

    activeTab({ tabId: data.lastActiveTab, scrollTop: lastScrollTop })
  } else {
    activeTab()

    const [hotTopics, latestTopics] = await Promise.all([fetchHotTopics(), fetchLatestTopics()])

    hotTopicList = hotTopics
    latestTopicList = latestTopics
  }

  $('.topics.hot').append(generateTopicItmes(hotTopicList))
  $('.topics.latest').append(generateTopicItmes(latestTopicList))

  $('.tabs > li').on('click', (e) => {
    activeTab({ tabEle: $(e.currentTarget) })
  })

  window.addEventListener('unload', () => {
    const lastActiveTab = $('.tabs > li.active').data('target')

    if (isTabId(lastActiveTab)) {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0

      const data: PopupStorageData = {
        lastActiveTab,
        [TabId.Hot]: {
          data: hotTopicList,
          lastFetchTime: Date.now(),
          lastScrollTop: lastActiveTab === TabId.Hot ? scrollTop : undefined,
        },
        [TabId.Latest]: {
          data: latestTopicList,
          lastFetchTime: Date.now(),
          lastScrollTop: lastActiveTab === TabId.Latest ? scrollTop : undefined,
        },
        [TabId.Setting]: {
          data: [],
          lastFetchTime: Date.now(),
          lastScrollTop: lastActiveTab === TabId.Setting ? scrollTop : undefined,
        },
      }
      window.localStorage.setItem('v2p_popup', JSON.stringify(data))
    }
  })
}

window.addEventListener('load', () => {
  loadAPIInfo()
  void loadTopics()
})
