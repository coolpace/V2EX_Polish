// chrome.runtime.openOptionsPage()

import { StorageKey } from '../constants'
import { fetchHotTopics, fetchLatestTopics } from '../services'
import type { API, StorageData, Topic } from '../types'
import { formatTimestamp } from '../utils'

interface PopupStorageData {
  lastActiveTab: string
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

function loadTopics() {
  const activeTab = ({ tabId, tabEle }: { tabId?: string; tabEle?: JQuery } = {}) => {
    const toggle = ($tab: JQuery) => {
      const target = $tab.data('target')
      if (typeof target === 'string') {
        const $content = $(`#${target}`)
        $tab.addClass('active').siblings().removeClass('active')
        $content.addClass('active').siblings().removeClass('active')
        // 每次切换 tab 都滚动到最顶部，防止受上一个 tab 的滚动位置影响。
        window.scrollTo(0, 0)
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

  const dataString = window.localStorage.getItem('v2p_popup')

  if (dataString) {
    const data: PopupStorageData = JSON.parse(dataString)
    activeTab({ tabId: data.lastActiveTab })
  } else {
    activeTab()
  }

  $('.tabs > li').on('click', (e) => {
    activeTab({ tabEle: $(e.currentTarget) })
  })

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

  fetchHotTopics()
    .then((topics) => {
      $('.topics.hot').append(generateTopicItmes(topics))
    })
    .catch((err) => {
      console.error(err)
    })

  fetchLatestTopics()
    .then((topics) => {
      $('.topics.latest').append(generateTopicItmes(topics))
    })
    .catch((err) => {
      console.error(err)
    })
}

window.addEventListener('load', () => {
  loadAPIInfo()
  loadTopics()
})

window.addEventListener('beforeunload', () => {
  const lastActiveTab = $('.tabs > li.active').data('target')

  if (typeof lastActiveTab === 'string') {
    const data: PopupStorageData = { lastActiveTab }
    window.localStorage.setItem('v2p_popup', JSON.stringify(data))
  }
})
