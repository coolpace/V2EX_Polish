/**
 * Popup 功能描述：
 * 1. 切换到某个 tab 时，如果该 tab 的内容没有加载过，则加载内容。
 * 2. 如果该 tab 的内容已经加载过，则直接显示。
 * 3. 如果该 tab 的内容已经加载过，但是数据过期了，则重新加载内容。
 * 4. 来回切换 tab 时，应当保持 tab 的滚动位置。
 */

import {
  ArrowUpRightFromCircle,
  AtSign,
  Check,
  ChevronRight,
  createElement,
  MoonStar,
  Settings,
  Shapes,
  Sun,
} from 'lucide'

import {
  buildCheckInDiagnostic,
  describeCheckInErrorCode,
  resolveCheckInDisplayState,
} from '../background/check-in-utils'
import { createButton } from '../components/button'
import { dataExpiryTime, Links, MessageKey, RequestMessage, StorageKey, V2EX } from '../constants'
import type { IconRoot } from '../contents/helpers'
import { initTheme, renderIcons, replaceEmojiWithHD, setFont } from '../contents/helpers'
import { iconLoading } from '../icons'
import {
  fetchHotTopics,
  fetchLatestTopics,
  fetchNotifications,
  getUnreadMessagesCount,
} from '../services'
import type { CheckInResult, DailyInfo, Notification, Topic } from '../types'
import {
  escapeHTML,
  formatTimestamp,
  getStorage,
  getStorageSync,
  setStorage,
} from '../utils'
import { initBackupForm } from './backup-form'
import {
  calculateLocalStorageSize,
  formatSizeUnits,
  generateReadingItmes,
  generateTopicItmes,
  isTabId,
} from './popup.helper'
import type { PopupStorageData, RemoteDataStore } from './popup.type'
import { defaultValue, TabId } from './popup.var'

/** localStorage 中存储未读消息信息的 key。 */
const UNREAD_MSG_STORAGE_KEY = 'v2p_last_fetch_unread_info'

interface LastFetchUnreadMsgInfoInfo {
  time: number
  count: number
}

function loadIcons(root?: IconRoot) {
  renderIcons(
    {
      Check,
      ChevronRight,
      Shapes,
      Settings,
      Sun,
      MoonStar,
    },
    root,
  )
}

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

const $tabMsg = $('.tabs > li[data-target="tab-message"]')

/**
 * 通过 background 执行签到，确保所有请求串行，且不随 popup 关闭而中断。
 */
async function requestCheckIn(
  options: { force?: boolean } = {},
): Promise<CheckInResult | undefined> {
  return await chrome.runtime.sendMessage<
    { [MessageKey.checkIn]: { force?: boolean } },
    CheckInResult | undefined
  >({
    [MessageKey.checkIn]: { force: options.force },
  })
}

/** popup 打开时只发起一次自动签到。 */
let popupCheckInPromise: Promise<void> | null = null

function ensurePopupCheckIn(): Promise<void> {
  if (!popupCheckInPromise) {
    popupCheckInPromise = requestCheckIn()
      .then(() => {})
      .catch((error: unknown) => {
        console.warn('[V2EX Polish] 自动签到出错：', error)
      })
  }

  return popupCheckInPromise
}

/**
 * 将未签到的原因转换成卡片提示。
 */
function describeNotAttempted(skipReason?: string): string {
  if (skipReason === '等待 V2EX 奖励日重置') {
    return '奖励日刚重置，稍后会自动签到'
  }

  if (skipReason === '上次签到失败，重试冷却中') {
    return '上次签到失败，冷却结束后自动重试'
  }

  if (skipReason === '已有签到任务进行中') {
    return '正在签到，请稍候'
  }

  return '点击立即签到'
}

/**
 * 渲染功能页的签到卡片。
 */
function renderCheckInFeature(
  dailyInfo: DailyInfo | undefined,
  autoCheckInEnabled: boolean,
  refresh: () => void,
) {
  const $checkIn = $('.feature-check-in')
  const $title = $checkIn.find('.feature-title')
  const $content = $checkIn.find('.feature-content')

  $checkIn.off('click')
  $title.text('每日签到')
  $content.text('')
  $('.feature-diagnostic').removeClass('is-highlighted')

  const state = resolveCheckInDisplayState({
    now: Date.now(),
    dailyInfo,
    autoCheckInEnabled,
  })

  const openMissionPage = () => window.open(`${V2EX.Origin}/mission/daily`)

  if (state.type === 'checked-in') {
    const date = formatTimestamp(state.checkInTime, { format: 'YMDHMS' })
    const days = state.checkInDays ? `，已连续登录 ${state.checkInDays} 天` : ''

    $title.text('✅ 今日已签到')
    $content.html(`于 ${date} 自动签到${days}`)
    $checkIn.on('click', openMissionPage)

    return
  }

  // 只有当天真正请求过才会展示失败，避免把前一天的失败当成当天状态。
  if (state.type === 'failed') {
    const { title, hint } = describeCheckInErrorCode(state.code)
    const date = formatTimestamp(state.attemptTime, { format: 'YMDHMS' })
    const status = state.httpStatus ? `（HTTP ${state.httpStatus}）` : ''
    const selfResolvable = state.code === 'unauthenticated' || state.code === 'challenge'

    $title.text(`⚠️ ${title}`)
    $content.html(
      `${escapeHTML(date)} 尝试${status}：${escapeHTML(hint)}`
      + (selfResolvable ? '' : '<br>点击下方「反馈问题」会带上诊断信息'),
    )

    // 登录失效或需要人机验证时重试没有意义，引导用户去对应页面处理。
    if (selfResolvable) {
      const target = state.code === 'unauthenticated'
        ? `${V2EX.Origin}/signin?next=/mission/daily`
        : `${V2EX.Origin}/mission/daily`

      $checkIn.on('click', () => {
        window.open(target)
      })

      return
    }

    $('.feature-diagnostic').addClass('is-highlighted')
  }
  else if (state.type === 'auto-disabled') {
    $title.text('自动签到已关闭')
    $content.text('点击手动签到，或在设置中开启自动签到')
  }
  else {
    $title.text('今日尚未签到')
    $content.text(describeNotAttempted(state.skipReason))
  }

  $checkIn.on('click', () => {
    void (async () => {
      $content.text('签到中...')

      try {
        const result = await requestCheckIn({ force: true })
        const unclear = state.type === 'failed'
          && (state.code === 'unexpected-page' || state.code === 'redeem-failed')

        // 结果不明时直接打开签到页，便于用户核对是否已领取奖励。
        if (result?.status === 'success' || result?.status === 'already' || unclear) {
          openMissionPage()
        }
      }
      catch (error) {
        console.warn('[V2EX Polish] 手动签到出错：', error)
      }

      refresh()
    })()
  })
}

/** 复制文本，剪贴板 API 不可用时退回隐藏的 textarea。 */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)

    return true
  }
  catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.append(textarea)
    textarea.select()

    try {
      return document.execCommand('copy')
    }
    catch {
      return false
    }
    finally {
      textarea.remove()
    }
  }
}

/** 生成当前签到诊断文本。 */
async function createCheckInDiagnostic(): Promise<string> {
  const storage = await getStorage(false)
  const browser = navigator.userAgent.includes('Firefox/') ? 'Firefox' : 'Chromium'

  return buildCheckInDiagnostic({
    now: Date.now(),
    dailyInfo: storage[StorageKey.Daily],
    autoCheckInEnabled: storage[StorageKey.Options].autoCheckIn.enabled,
    extensionVersion: chrome.runtime.getManifest().version,
    browser: `${browser}（${navigator.userAgent}）`,
    timezoneOffsetMinutes: new Date().getTimezoneOffset(),
  })
}

/** 复制诊断文本，并在按钮上给出短暂反馈。 */
async function copyCheckInDiagnostic($button: JQuery, idleText: string): Promise<boolean> {
  let copied = false

  try {
    copied = await copyText(await createCheckInDiagnostic())
  }
  catch (error) {
    console.warn('[V2EX Polish] 生成签到诊断信息失败：', error)
  }

  $button.text(copied ? '✅ 已复制诊断信息' : '复制失败，请手动选择')
  setTimeout(() => {
    $button.text(idleText)
  }, 2000)

  return copied
}

/** 绑定「复制签到诊断信息」按钮。 */
function initCheckInDiagnostic() {
  const $button = $('#copy-check-in-diagnostic')

  $button.on('click', () => {
    void copyCheckInDiagnostic($button, '复制签到诊断信息')
  })
}

/** 一键反馈：先复制诊断信息，再打开新建 Issue 页。 */
function initCheckInFeedback() {
  const $button = $('#report-check-in-issue')

  $button.on('click', () => {
    void (async () => {
      const copied = await copyCheckInDiagnostic($button, '反馈问题')

      if (copied) {
        window.open(Links.NewIssue)
      }
    })()
  })
}

function loadSettings() {
  const storage = getStorageSync()
  const api = storage[StorageKey.API]

  const $patInput = $('#pat')

  $patInput.on('change', (ev) => {
    const value = (ev.target as HTMLInputElement).value

    if (value) {
      $patInput.addClass('has-value')
    }
    else {
      $patInput.removeClass('has-value')
    }
  })

  if (api) {
    if (api.pat) {
      $patInput.val(api.pat).addClass('has-value')
    }
    else {
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
      // 不使用 `chrome.runtime.openOptionsPage()`：在 Dia、Arc 等定制 Chromium 中
      // 该 API 实现不完整、会静默 no-op。直接 `chrome.tabs.create` 更可靠。
      void chrome.tabs.create({ url: chrome.runtime.getURL('pages/options.html') })
    })
  }

  {
    initBackupForm({
      syncInfo: storage[StorageKey.SyncInfo],
      onSyncComplete: () => loadSettings(),
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

      const displayEmpty = () => {
        const $emptyTemp = $('#reading-empty')
        $tabContent.empty().append($emptyTemp.html())
        loadIcons($tabContent[0])
      }

      if (readingData && readingData.length > 0) {
        const $readingList = $('<div class="list">').append(generateReadingItmes(readingData))

        let currentReadingData = readingData

        $('<div style="padding: 0 var(--common-padding);"><hr /></div>').prependTo($readingList)

        const iconOpen = createElement(ArrowUpRightFromCircle)
        iconOpen.setAttribute('width', '100%')
        iconOpen.setAttribute('height', '100%')

        const $openFrom = $(`
        <button id="open-options" class="action-btn" style="margin: var(--common-padding) 0 0 var(--common-padding);">
          <span class="action-icon"></span>
          在浏览器中打开全部
        </button>
        `)
        $openFrom.find('.action-icon').append(iconOpen)

        $openFrom
          .on('click', () => {
            void (async () => {
              const tabs = await Promise.all(
                currentReadingData.map((it) => chrome.tabs.create({ url: it.url, active: false })),
              )
              const tabIds = tabs.map((it) => it.id).filter((id): id is number => id !== undefined)

              if (tabIds.length > 0) {
                const groupId = await chrome.tabs.group({
                  tabIds: tabIds as [number, ...number[]],
                })
                await chrome.tabGroups.update(groupId, { title: 'V2EX', color: 'grey' })
              }
            })()
          })
          .prependTo($readingList)

        $tabContent.empty().append($readingList)

        $('.topic-item-action-remove').on('click', (ev) => {
          ev.preventDefault()
          ev.stopPropagation()

          const url = ev.target.dataset.url

          if (url) {
            currentReadingData = currentReadingData.filter((it) => it.url !== url)

            void setStorage(StorageKey.ReadingList, { data: currentReadingData })

            if (currentReadingData.length > 0) {
              $tabContent
                .find(`.topic-item:has(.topic-item-action-remove[data-url="${url}"])`)
                .remove()
            }
            else {
              displayEmpty()
            }
          }
        })
      }
      else {
        displayEmpty()
      }
    }

    if (tabId === TabId.Hot || tabId === TabId.Latest) {
      const loaded = $tabContent.find('.list').length > 0

      if (loaded) {
        tabContentScrollTop = topicContentData[tabId].lastScrollTop ?? 0
      }
      else {
        const getData = async () => {
          $tabContent.html(loading)

          try {
            if (tabId === TabId.Hot) {
              const topics = await fetchHotTopics()
              topicContentData[tabId].data = topics
              topicContentData[tabId].lastFetchTime = Date.now()

              return topics
            }
            else {
              const topics = await fetchLatestTopics()
              topicContentData[tabId].data = topics
              topicContentData[tabId].lastFetchTime = Date.now()

              return topics
            }
          }
          catch (err) {
            if (err instanceof Error) {
              console.error(`获取列表数据出错：${err.message}`)
            }

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
          }
          else {
            topicList = data
          }
        }
        else {
          topicList = await getData()
        }

        if (topicList) {
          const $topicList = $('<ul class="list">').append(generateTopicItmes(topicList))
          $tabContent.empty().append($topicList)
        }
      }
    }

    if (tabId === TabId.Feature) {
      const renderCheckIn = async () => {
        const latestStorage = await getStorage(false)

        renderCheckInFeature(
          latestStorage[StorageKey.Daily],
          latestStorage[StorageKey.Options].autoCheckIn.enabled,
          () => {
            void renderCheckIn()
          },
        )
      }

      await renderCheckIn()

      // 首次渲染后补一次签到，完成后刷新当前卡片。
      void ensurePopupCheckIn().then(() => {
        if ($('#tab-feature').hasClass('active')) {
          void renderCheckIn()
        }
      })
    }

    if (tabId === TabId.Message) {
      const api = storage[StorageKey.API]

      if (api?.pat) {
        const loaded = $tabContent.find('.list').length > 0

        if (loaded) {
          return
        }

        $tabContent.html(loading)

        let notifications: Notification[]

        try {
          const { result } = await fetchNotifications()
          notifications = result ?? []
        }
        catch (err) {
          const isTokenError = err instanceof Error
            && (err.message.includes(RequestMessage.InvalidToken)
              || err.message.includes(RequestMessage.TokenExpired))

          if (isTokenError) {
            // PAT 无效或已过期，引导用户去重新设置。
            const $tipBtn = createButton({ children: '去设置' }).on('click', () => {
              activeTab({ tabId: TabId.Setting })
            })
            const $tip = $(
              '<div class="tip"><p>个人访问令牌无效或已过期，请重新设置</p></div>',
            ).append($tipBtn)
            $tabContent.empty().append($tip)
          }
          else {
            $tabContent.html(errorDisplay)
          }

          return
        }

        if (notifications.length > 0) {
          try {
            const $noticeList = $('<ul class="list">').append(
              notifications
                .map((notice) => {
                  return `
                  <li class="notice-item">
                    <div class="notice">
                      ${notice.text}
                    </div>
                    ${notice.payload ? `<div class="payload">${escapeHTML(notice.payload)}</div>` : ''}
                  </li>
                  `
                })
                .join(''),
            )

            // 为每个通知添加点击事件，点击后打开对应的主题链接。
            $noticeList.find('.notice-item .notice > a').each((_, a) => {
              const link = $(a)
              link.prop('target', '_blank').prop('href', `${V2EX.Origin}${link.attr('href') ?? ''}`)
            })

            const iconAtSign = createElement(AtSign)
            iconAtSign.setAttribute('width', '100%')
            iconAtSign.setAttribute('height', '100%')

            const $checkMsgBtn = $(`
              <a class="action-btn" href="${V2EX.Origin}/notifications" target="_blank">
                <span class="action-icon"></span>
                查看所有消息
              </a>
            `)
            $checkMsgBtn.find('.action-icon').append(iconAtSign)

            $checkMsgBtn.on('click', () => {
              // 当在 Popup 中主动点击查看消息时，应该重置未读数量。
              const storeInfo: LastFetchUnreadMsgInfoInfo = { time: Date.now(), count: 0 }
              window.localStorage.setItem(UNREAD_MSG_STORAGE_KEY, JSON.stringify(storeInfo))
              $tabMsg.text('消息')
            })

            const $tabHeader = $(`
              <div class="tab-header">
                <div class="message-actions"></div>
                <hr />
              </div>
           `)
            $tabHeader.find('.message-actions').append($checkMsgBtn)

            replaceEmojiWithHD($noticeList.find('.notice-item .embedded_image'))

            $tabContent.empty().append($tabHeader).append($noticeList)

            // 消息列表渲染完成后，重置未读计数徽标。
            const storeInfo: LastFetchUnreadMsgInfoInfo = { time: Date.now(), count: 0 }
            window.localStorage.setItem(UNREAD_MSG_STORAGE_KEY, JSON.stringify(storeInfo))
            $tabMsg.text('消息')
          }
          catch {
            $tabContent.html(`
              <div class="fetch-error">
                消息列表渲染出错。
              </div>
            `)
          }
        }
        else {
          $tabContent.empty().append('<div class="tip">无任何消息</div>')
        }
      }
      else {
        const $tipBtn = createButton({ children: '去设置' }).on('click', () => {
          activeTab({ tabId: TabId.Setting })
        })
        const $tip = $(
          '<div class="tip"><p>需要设置你的个人访问令牌才能获取消息通知</p></div>',
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

  const activeTab = ({ tabId, tabEle }: { tabId?: string, tabEle?: JQuery } = {}) => {
    if (tabId) {
      toggleActiveTab($(`.tabs > li[data-target="${tabId}"]`))
    }
    else if (tabEle) {
      toggleActiveTab(tabEle)
    }
    else {
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
  void getStorage().then((storage) => {
    const options = storage[StorageKey.Options]
    initTheme({ autoSwitch: options.theme.autoSwitch, themeType: options.theme.type })
    setFont(options.font?.type ?? 'system')
    initTabs()
  })

  initCheckInDiagnostic()
  initCheckInFeedback()

  // 打开 popup 时补一次签到，覆盖当天浏览器启动较晚或 alarm 被推迟的场景。
  void ensurePopupCheckIn()

  // 展示消息未读数量。
  {
    const infoStr = window.localStorage.getItem(UNREAD_MSG_STORAGE_KEY)
    const fiveMinutes = 5 * 1000 * 60

    const info: LastFetchUnreadMsgInfoInfo = infoStr ? JSON.parse(infoStr) : { time: 0, count: 0 }

    const now = Date.now()

    // 每 5 分钟获取一次未读消息数量。
    if (now - info.time >= fiveMinutes) {
      void getUnreadMessagesCount()
        .then((count) => {
          const storeInfo: LastFetchUnreadMsgInfoInfo = { time: now, count }
          window.localStorage.setItem(UNREAD_MSG_STORAGE_KEY, JSON.stringify(storeInfo))

          if (count > 0) {
            $tabMsg.text(`消息(${count})`)
          }
          else {
            $tabMsg.text('消息')
          }
        })
        .catch((err: unknown) => {
          console.warn('[V2EX Polish] 获取未读消息数量失败：', err)
        })
    }
    else {
      if (info.count > 0) {
        $tabMsg.text(`消息(${info.count})`)
      }
    }
  }

  loadIcons()
})
