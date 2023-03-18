// chrome.runtime.openOptionsPage()

/**
 * Popup 功能描述：
 * 1. 切换到某个 tab 时，如果该 tab 的内容没有加载过，则加载内容。
 * 2. 如果该 tab 的内容已经加载过，则直接显示。
 * 3. 如果该 tab 的内容已经加载过，但是数据过期了，则重新加载内容。
 * 4. 来回切换 tab 时，应当保持 tab 的滚动位置。
 */

import { StorageKey } from '../constants'
import { fetchHotTopics, fetchLatestTopics } from '../services'
import type { StorageData, Topic } from '../types'
import { formatTimestamp } from '../utils'

const enum TabId {
  Hot = 'tab1',
  Latest = 'tab2',
  Setting = 'tab3',
}

interface TopicsStore {
  data?: Topic[]
  lastFetchTime?: number
  lastScrollTop?: number
}

interface PopupStorageData {
  lastActiveTab: TabId
  [TabId.Hot]: TopicsStore
  [TabId.Latest]: TopicsStore
  [TabId.Setting]: TopicsStore
}

function loadSettings() {
  chrome.storage.sync.get(StorageKey.API, (result: StorageData) => {
    const api = result[StorageKey.API]

    if (api) {
      $('#pat').val(api.pat ?? '')
      $('#limit').val(api.limit ?? '')
      $('#reset').val(api.reset ? formatTimestamp(api.reset) : '')
      $('#remaining').val(api.remaining ?? '')
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

  $('#settings-form').on('submit', function (ev) {
    ev.preventDefault() // 阻止默认的表单提交行为

    const PAT = $('#pat').val()

    if (typeof PAT === 'string') {
      chrome.storage.sync.set({ [StorageKey.API]: { pat: PAT } }, () => {
        console.log('保存成功')
      })
    }
  })

  $('#clear-storage').on('click', () => {
    window.localStorage.clear()
  })
}

function loadTabs() {
  const generateTopicItmes = (topics: Topic[]) => {
    return topics
      .map((topic) => {
        // 已知问题：如果 topic.content 中包含了 a 标签字符串，会导致渲染异常，因为 a 标签不允许嵌套 a 标签。
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

  const getCurrentActiveTab = () => {
    return $('.tabs > li.active')
  }

  const isTabId = (tabId: any): tabId is TabId => {
    if (typeof tabId === 'string') {
      if (tabId === TabId.Hot || tabId === TabId.Latest || tabId === TabId.Setting) {
        return true
      }
    }
    return false
  }

  const topicContentData: Record<TabId, TopicsStore> = {
    [TabId.Hot]: {
      data: undefined,
      lastFetchTime: undefined,
      lastScrollTop: undefined,
    },
    [TabId.Latest]: {
      data: undefined,
      lastFetchTime: undefined,
      lastScrollTop: undefined,
    },
    [TabId.Setting]: {},
  }

  const dataString = window.localStorage.getItem('v2p_popup')
  const storageData = dataString ? (JSON.parse(dataString) as PopupStorageData) : null

  const setupTabContent = async ({ tabId }: { tabId: TabId }) => {
    let topicList: Topic[] | undefined
    let tabContentScrollTop = 0

    const $tabContent = $(`#${tabId}`)

    if (tabId === TabId.Hot || tabId === TabId.Latest) {
      const loadedTopics = $tabContent.find('.topics').length > 0

      if (loadedTopics) {
        tabContentScrollTop = topicContentData[tabId].lastScrollTop ?? 0
      } else {
        const loading = `
        <div class="tab-loading">
          <span class="loading">
            <svg version="1.1" id="L4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
              viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
              <circle fill="currentcolor" stroke="none" cx="6" cy="50" r="6">
                <animate
                  attributeName="opacity"
                  dur="1s"
                  values="0;1;0"
                  repeatCount="indefinite"
                  begin="0.1"/>    
              </circle>
              <circle fill="currentcolor" stroke="none" cx="26" cy="50" r="6">
                <animate
                  attributeName="opacity"
                  dur="1s"
                  values="0;1;0"
                  repeatCount="indefinite" 
                  begin="0.2"/>       
              </circle>
              <circle fill="currentcolor" stroke="none" cx="46" cy="50" r="6">
                <animate
                  attributeName="opacity"
                  dur="1s"
                  values="0;1;0"
                  repeatCount="indefinite" 
                  begin="0.3"/>     
              </circle>
            </svg>
          </span>
        </div>
        `
        const getData = async () => {
          $tabContent.html(loading)

          try {
            if (tabId === TabId.Hot) {
              const topics = await fetchHotTopics()
              topicContentData[tabId].data = topics
              topicContentData[tabId].lastFetchTime = Date.now()
              return topics
            } else {
              const topics = await fetchLatestTopics()
              topicContentData[tabId].data = topics
              topicContentData[tabId].lastFetchTime = Date.now()
              return topics
            }
          } catch {
            $tabContent.html('无法获取到列表数据。')
          }
        }

        if (storageData) {
          const { data, lastFetchTime, lastScrollTop } = storageData[tabId]

          if (lastScrollTop) {
            tabContentScrollTop = lastScrollTop
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

        if (topicList) {
          const $topicList = $(`<ul class="topics">`).append(generateTopicItmes(topicList))
          $tabContent.empty().append($topicList)
        }
      }
    }

    setTimeout(() => {
      // 每次切换 tab 都滚动到最顶部，防止受上一个 tab 的滚动位置影响。
      // 加入 setTimeout 是为了等待 tab 内容完成插入，防止出现滚动位置不正确的情况。
      $tabContent.scrollTop(tabContentScrollTop)
    }, 0)
  }

  const toggleActiveTab = ($tab: JQuery) => {
    const tabId = $tab.data('target')

    if (isTabId(tabId)) {
      const $currentActiveTab = getCurrentActiveTab()
      const currentActiveTabId = $currentActiveTab.data('target')

      if (isTabId(currentActiveTabId)) {
        const $currentActiveTabContent = $(`#${currentActiveTabId}`)
        topicContentData[currentActiveTabId].lastScrollTop = $currentActiveTabContent.scrollTop()
        $currentActiveTab.removeClass('active')
        $currentActiveTabContent.removeClass('active')
      }

      $tab.addClass('active')
      $(`#${tabId}`).addClass('active')

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

  $('.tabs > li').on('click', (e) => {
    activeTab({ tabEle: $(e.currentTarget) })
  })

  loadSettings()

  activeTab({ tabId: storageData?.lastActiveTab })

  window.addEventListener('unload', () => {
    const activeTabId = getCurrentActiveTab().data('target')

    if (isTabId(activeTabId)) {
      const $content = $(`#${activeTabId}`)
      const scrollTop = $content.scrollTop()

      const data: PopupStorageData = {
        lastActiveTab: activeTabId,
        [TabId.Hot]: {
          data: topicContentData[TabId.Hot].data,
          lastFetchTime: topicContentData[TabId.Hot].lastFetchTime,
          lastScrollTop: activeTabId === TabId.Hot ? scrollTop : undefined,
        },
        [TabId.Latest]: {
          data: topicContentData[TabId.Latest].data,
          lastFetchTime: topicContentData[TabId.Latest].lastFetchTime,
          lastScrollTop: activeTabId === TabId.Latest ? scrollTop : undefined,
        },
        [TabId.Setting]: {
          lastScrollTop: activeTabId === TabId.Setting ? scrollTop : undefined,
        },
      }
      window.localStorage.setItem('v2p_popup', JSON.stringify(data))
    }
  })
}

window.addEventListener('load', () => {
  loadTabs()
})
