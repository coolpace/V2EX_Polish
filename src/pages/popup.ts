/**
 * Popup 功能描述：
 * 1. 切换到某个 tab 时，如果该 tab 的内容没有加载过，则加载内容。
 * 2. 如果该 tab 的内容已经加载过，则直接显示。
 * 3. 如果该 tab 的内容已经加载过，但是数据过期了，则重新加载内容。
 * 4. 来回切换 tab 时，应当保持 tab 的滚动位置。
 */

import { checkIn } from '../background/daily-check-in'
import { createButton } from '../components/button'
import { dataExpiryTime, Links, StorageKey, V2EX } from '../constants'
import { deepMerge } from '../deep-merge'
import { iconChat, iconLoading } from '../icons'
import {
  fetchHotTopics,
  fetchLatestTopics,
  fetchNotifications,
  getV2P_Settings,
  setV2P_Settings,
} from '../services'
import type { Topic } from '../types'
import { formatTimestamp, getStorage, getStorageSync, isSameDay, setStorage } from '../utils'
import {
  calculateLocalStorageSize,
  formatSizeUnits,
  generateReadingItmes,
  generateTopicItmes,
  isTabId,
} from './popup.helper'
import type { PopupStorageData, RemoteDataStore } from './popup.type'
import { defaultValue, TabId } from './popup.var'

const loading = `
<div class="tab-loading">
  <span class="loading">
    ${iconLoading}
  </span>
</div>
`

const errorDisplay = `
<div class="fetch-error">
  无法获取列表数据，请稍后再试，或<a class="link" href="${Links.Feedback}" target="_blank">报告问题</a>。
</div>
`

const topicContentData: Record<TabId, RemoteDataStore> = {
  [TabId.Reading]: {},
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
  [TabId.Message]: {
    data: undefined,
    lastFetchTime: undefined,
  },
  [TabId.Feature]: {},
  [TabId.Setting]: {},
}

function loadSettings() {
  const storage = getStorageSync()
  const api = storage[StorageKey.API]

  const $patInput = $('#pat')

  $patInput.on('change', (ev) => {
    const value = (ev.target as HTMLInputElement).value
    if (value) {
      $patInput.addClass('has-value')
    } else {
      $patInput.removeClass('has-value')
    }
  })

  if (api) {
    if (api.pat) {
      $patInput.val(api.pat).addClass('has-value')
    } else {
      $('.details').prop('open', true)
    }
    $('#limit').val(api.limit ?? defaultValue)
    $('#reset').val(api.reset ? formatTimestamp(api.reset, { format: 'YMDHMS' }) : defaultValue)
    $('#remaining').val(api.remaining ?? defaultValue)
  }

  $('#settings-form').on('submit', (ev) => {
    ev.preventDefault() // 阻止默认的表单提交行为

    const PAT = $patInput.val()

    if (typeof PAT === 'string') {
      void setStorage(StorageKey.API, { pat: PAT }).then(() => {
        const $submitBtn = $('.submit-btn')
        const submitText = $submitBtn.text()
        $submitBtn.text('保存成功').prop('disabled', true)
        setTimeout(() => {
          $submitBtn.text(submitText).prop('disabled', false)
        }, 1500)
      })
    }
  })

  {
    const calculate = () => {
      const storageSize = calculateLocalStorageSize()
      const size = formatSizeUnits(storageSize)
      $('.storage-size').text(size)
    }

    calculate()

    $('#clear-storage').on('click', () => {
      topicContentData[TabId.Hot].data = undefined
      topicContentData[TabId.Latest].data = undefined
      window.localStorage.clear()
      calculate()
    })
  }

  {
    $('#open-options').on('click', () => {
      chrome.runtime.openOptionsPage()
    })
  }

  {
    const syncInfo = storage[StorageKey.SyncInfo]
    $('#local-version').val(syncInfo?.version ?? defaultValue)

    void getV2P_Settings().then((res) => {
      const settings = res?.config
      const remoteSyncInfo = settings?.[StorageKey.SyncInfo]

      const version = remoteSyncInfo?.version
      const lastSyncTime = remoteSyncInfo?.lastSyncTime

      $('#remote-version').val(version ?? defaultValue)
      $('#last-sync-time').val(
        lastSyncTime ? formatTimestamp(lastSyncTime, { format: 'YMDHMS' }) : defaultValue
      )

      const $syncBtn = $('#sync-settings')

      const backupAvailable =
        syncInfo && remoteSyncInfo && syncInfo.version >= remoteSyncInfo.version

      if (!remoteSyncInfo || backupAvailable) {
        if (!remoteSyncInfo) {
          $('.storage-tip').text('未发现远程存储的配置')
        }

        if (backupAvailable) {
          $('.storage-tip').text('你可以将目前使用的配置备份到远程')
        }

        $syncBtn
          .text('开始备份')
          .prop('disabled', false)
          .on('click', () => {
            void (async () => {
              const txt = $syncBtn.text()
              try {
                $syncBtn.text('备份中...').css('pointer-events', 'none')
                const storage = await getStorage(false)
                await setV2P_Settings(storage)
              } finally {
                $syncBtn.text(txt).css('pointer-events', 'auto')
              }
            })()
          })
      } else {
        if (!syncInfo || syncInfo.version < remoteSyncInfo.version) {
          $('.storage-tip').text('远程备份的版本较新')
          $syncBtn
            .text('同步至本地')
            .prop('disabled', false)
            .on('click', () => {
              void (async () => {
                const txt = $syncBtn.text()
                try {
                  $syncBtn.text('同步中...').css('pointer-events', 'none')
                  await new Promise((resolve) =>
                    setTimeout(() => {
                      resolve(undefined)
                    }, 1000)
                  )
                  const storage = await getStorage(false)
                  await chrome.storage.sync.set(deepMerge(storage, settings))
                  $('#local-version').val(settings[StorageKey.SyncInfo]?.version ?? defaultValue)
                } finally {
                  $syncBtn.text(txt).css('pointer-events', 'auto')
                }
              })()
            })
        }
      }
    })
  }
}

function initTabs() {
  const getCurrentActiveTab = () => {
    return $('.tabs > li.active')
  }

  const dataString = window.localStorage.getItem('v2p_popup')
  const storageData = dataString ? (JSON.parse(dataString) as PopupStorageData) : null

  const setupTabContent = async ({ tabId }: { tabId: TabId }) => {
    const storage = getStorageSync()

    let topicList: Topic[] | undefined
    let tabContentScrollTop = 0

    const $tabContent = $(`#${tabId}`)

    if (tabId === TabId.Reading) {
      const readingData = storage[StorageKey.ReadingList]?.data
      if (readingData) {
        const $readingList = $(`<ul class="list">`).append(generateReadingItmes(readingData))

        $tabContent.empty().append($readingList)

        $('.topic-item-action-remove').on('click', (ev) => {
          ev.preventDefault()
          ev.stopPropagation()

          const url = ev.target.dataset.url

          if (url) {
            const newReadingData = readingData.filter((it) => it.url !== url)

            void setStorage(StorageKey.ReadingList, { data: newReadingData })

            $tabContent
              .find(`.topic-item:has(.topic-item-action-remove[data-url="${url}"])`)
              .remove()
          }
        })
      } else {
        $tabContent.empty().append('<div>暂未添加稍后阅读</div>')
      }
    }

    if (tabId === TabId.Hot || tabId === TabId.Latest) {
      const loaded = $tabContent.find('.list').length > 0

      if (loaded) {
        tabContentScrollTop = topicContentData[tabId].lastScrollTop ?? 0
      } else {
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
            $tabContent.html(errorDisplay)
          }
        }

        if (storageData) {
          const { data, lastFetchTime, lastScrollTop } = storageData[tabId]

          if (lastScrollTop) {
            tabContentScrollTop = lastScrollTop
          }

          if (!data || !lastFetchTime || Date.now() - lastFetchTime > dataExpiryTime) {
            topicList = await getData()
          } else {
            topicList = data
          }
        } else {
          topicList = await getData()
        }

        if (topicList) {
          const $topicList = $(`<ul class="list">`).append(generateTopicItmes(topicList))
          $tabContent.empty().append($topicList)
        }
      }
    }

    if (tabId === TabId.Feature) {
      const $checkIn = $('.feature-check-in').on('click', () => {
        window.open(`${V2EX.Origin}/mission/daily`)
      })

      const dailyInfo = storage[StorageKey.Daily]

      if (dailyInfo?.lastCheckInTime) {
        if (isSameDay(dailyInfo.lastCheckInTime, Date.now())) {
          const date = formatTimestamp(dailyInfo.lastCheckInTime, { format: 'YMDHMS' })
          $checkIn.find('.feature-title').text('✅ 今日已签到')
          $checkIn
            .find('.feature-content')
            .html(
              `于 ${date} 自动签到${
                dailyInfo.checkInDays ? `，已连续登录 ${dailyInfo.checkInDays} 天` : ''
              }`
            )
        }
      } else {
        $checkIn.on('click', () => {
          void checkIn()
        })
      }
    }

    if (tabId === TabId.Message) {
      const api = storage[StorageKey.API]

      if (api?.pat) {
        const loaded = $tabContent.find('.list').length > 0

        if (loaded) {
          return
        }

        $tabContent.html(loading)

        fetchNotifications()
          .then(({ result: notifications }) => {
            if (notifications.length > 0) {
              const $noticeList = $(`<ul class="list">`).append(
                notifications
                  .map((notice) => {
                    return `
                    <li class="notice-item">
                      <div class="notice">
                        ${notice.text}
                      </div>
                      ${notice.payload ? `<div class="payload">${notice.payload}</div>` : ''}
                    </li>
                    `
                  })
                  .join('')
              )

              $noticeList.find('.notice-item .notice > a').each((_, a) => {
                const link = $(a)
                link
                  .prop('target', '_blank')
                  .prop('href', `${V2EX.Origin}${link.attr('href') ?? ''}`)
              })

              $tabContent
                .empty()
                .append(
                  `
                    <div class="tab-header">
                      <div class="message-actions">
                        <a class="action-btn" href="${V2EX.Origin}/notifications" target="_blank">
                          <span class="action-icon">${iconChat}</span>
                          查看所有消息
                        </a>
                      </div>
                      <hr />
                    </div>
                   `
                )
                .append($noticeList)
            } else {
              $tabContent.empty().append('<div class="tip">无任何消息</div>')
            }
          })
          .catch(() => {
            $tabContent.html(errorDisplay)
          })
      } else {
        const $tipBtn = createButton({ children: '去设置' }).on('click', () => {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          activeTab({ tabId: TabId.Setting })
        })
        const $tip = $(
          '<div class="tip"><p>需要设置您的个人访问令牌才能获取消息通知</p></div>'
        ).append($tipBtn)
        $tabContent.empty().append($tip)
      }
    }

    setTimeout(() => {
      // 每次切换 tab 都滚动到最顶部，防止受上一个 tab 的滚动位置影响。
      // 加入 setTimeout 是为了等待 tab 内容完成插入，防止出现滚动位置不正确的情况。
      $tabContent.scrollTop(tabContentScrollTop)
    })
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
      toggleActiveTab($('nav > .tabs > li:first-child'))
    }
  }

  $('.tabs > li').on('click', (ev) => {
    activeTab({ tabEle: $(ev.currentTarget) })
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
  void getStorage().then(() => {
    initTabs()
  })
})
