import {
  HOT_TOPICS_API_URL,
  HOT_TOPICS_CLIENT_HEADER,
  HOT_TOPICS_CLIENT_VALUE,
  Menu,
  MessageKey,
  StorageKey,
  V2EX_DOMAINS,
} from '../constants'
import type { DataWrapper, HotTopic, HotTopicRange, LegacyTag, MemberTag, StorageItems } from '../types'
import { getRunEnv } from '../utils'
import { checkIn } from './daily-check-in'

/**
 * 旧格式的 MemberTag 数据，用于迁移时的类型兼容。
 * tags 可能是旧格式 `LegacyTag[]` 或新格式 `string[]`。
 */
type OldMemberTag = Record<string, { tags?: (LegacyTag | string)[], avatar?: string }>

/**
 * 一次性迁移：将 MemberTag 从 chrome.storage.sync 迁移到 chrome.storage.local，
 * 并将旧的 Tag 格式 `{name: string}[]` 转换为新的 `string[]` 格式。
 */
async function migrateMemberTagToLocal() {
  try {
    const syncData = await chrome.storage.sync.get(StorageKey.MemberTag)
    const localData = await chrome.storage.local.get(StorageKey.MemberTag)

    // 如果 local 中已经有数据，说明已经迁移过了，跳过。
    if (localData[StorageKey.MemberTag]) {
      return
    }

    const oldTagData = syncData[StorageKey.MemberTag] as OldMemberTag | undefined

    if (!oldTagData) {
      return
    }

    // 转换旧格式标签到新格式。
    const newTagData: MemberTag = {}

    for (const [memberName, memberInfo] of Object.entries(oldTagData)) {
      const oldTags = memberInfo.tags

      if (oldTags && oldTags.length > 0) {
        // 兼容旧格式：如果 tag 是对象 {name: string} 则提取 name，否则保留字符串。
        const newTags: string[] = oldTags.map((tag): string => {
          if (typeof tag === 'object' && tag !== null && 'name' in tag) {
            return tag.name
          }

          return String(tag)
        })
        newTagData[memberName] = { tags: newTags, avatar: memberInfo.avatar }
      }
      else {
        newTagData[memberName] = { avatar: memberInfo.avatar }
      }
    }

    // 写入到 local。
    await chrome.storage.local.set({ [StorageKey.MemberTag]: newTagData })

    // 从 sync 中删除旧数据以释放配额。
    await chrome.storage.sync.remove(StorageKey.MemberTag as string)
  }
  catch (err) {
    console.error('[V2EX Polish] MemberTag 迁移失败：', err)
  }
}

// 在扩展安装或更新时执行迁移。
chrome.runtime.onInstalled.addListener(() => {
  void migrateMemberTagToLocal()
})

interface Message {
  [MessageKey.action]?: 'openPopup'
  [MessageKey.colorScheme]?: 'dark' | 'light'
  [MessageKey.hotTopics]?: {
    range: HotTopicRange
    limits?: number
  }
  [MessageKey.showOptions]?: true
}

type HotTopicsPayload = {
  range: HotTopicRange
  limits?: number
}

type HotTopicsMessageResponse
  = | {
    ok: true
    data: DataWrapper<HotTopic[]>
  }
  | {
    ok: false
    error: {
      message: string
      statusCode?: number
    }
  }

function generateUrlPatterns(path: string): string[] {
  return V2EX_DOMAINS.map((domain) => `https://${domain}${path}`)
}

function generateOrigins(): string[] {
  return V2EX_DOMAINS.map((domain) => `https://${domain}`)
}

async function fetchWithTimeout(
  url: string,
  timeout: number,
  options?: RequestInit,
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    })
  }
  finally {
    clearTimeout(timeoutId)
  }
}

function isV2EXSender(sender: chrome.runtime.MessageSender): boolean {
  if (!sender.url) {
    return false
  }

  try {
    const url = new URL(sender.url)

    return V2EX_DOMAINS.includes(url.hostname)
  }
  catch {
    return false
  }
}

async function handleHotTopicsRequest(
  payload: HotTopicsPayload,
  sender: chrome.runtime.MessageSender,
): Promise<HotTopicsMessageResponse> {
  if (!isV2EXSender(sender)) {
    return {
      ok: false,
      error: {
        message: '非法来源，已拒绝请求',
        statusCode: 403,
      },
    }
  }

  const url = new URL(HOT_TOPICS_API_URL)
  url.searchParams.set('range', payload.range)

  if (payload.limits) {
    url.searchParams.set('limits', String(payload.limits))
  }

  try {
    const res = await fetchWithTimeout(url.toString(), 10000, {
      method: 'GET',
      headers: {
        [HOT_TOPICS_CLIENT_HEADER]: HOT_TOPICS_CLIENT_VALUE,
      },
    })

    if (!res.ok) {
      return {
        ok: false,
        error: {
          message: '获取热议主题失败',
          statusCode: res.status,
        },
      }
    }

    const data = await res.json() as DataWrapper<HotTopic[]>

    if (!data.success) {
      return {
        ok: false,
        error: {
          message: data.message ?? '获取热议主题失败',
          statusCode: res.status,
        },
      }
    }

    return {
      ok: true,
      data,
    }
  }
  catch (err) {
    console.error('[V2EX Polish] 获取热议主题失败：', err)

    return {
      ok: false,
      error: {
        message: '获取热议主题失败',
      },
    }
  }
}

chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
  if (Object.hasOwn(message, MessageKey.colorScheme)) {
    void chrome.action.setIcon({
      path:
        message[MessageKey.colorScheme] === 'dark'
          ? {
              16: '../images/icon-16-dark.png',
              32: '../images/icon-32-dark.png',
              48: '../images/icon-48-dark.png',
              128: '../images/icon-128-dark.png',
            }
          : {
              16: '../images/icon-16.png',
              32: '../images/icon-32.png',
              48: '../images/icon-48.png',
              128: '../images/icon-128.png',
            },
    })
  }
  else if (Object.hasOwn(message, MessageKey.showOptions)) {
    if (message[MessageKey.showOptions] === true) {
      void chrome.runtime.openOptionsPage()
    }
  }
  else if (Object.hasOwn(message, MessageKey.hotTopics)) {
    const payload = message[MessageKey.hotTopics]

    if (!payload) {
      sendResponse({
        ok: false,
        error: {
          message: '缺少热议主题请求参数',
          statusCode: 400,
        },
      } satisfies HotTopicsMessageResponse)

      return false
    }

    void handleHotTopicsRequest(payload, sender).then(sendResponse)

    return true
  }
})

chrome.contextMenus.removeAll(() => {
  void chrome.storage.sync.get().then((items: StorageItems) => {
    const options = items[StorageKey.Options]

    if (options?.contextMenu?.enabled) {
      const runEnv = getRunEnv()

      chrome.contextMenus.create({
        documentUrlPatterns: generateUrlPatterns('/*'),
        contexts: ['page'],
        title: 'V2EX Polish',
        visible: true,
        id: Menu.Root,
      })

      const hasSidePanel
        = runEnv === 'chrome' && 'sidePanel' in chrome && typeof chrome.sidePanel.open === 'function'

      if (hasSidePanel) {
        chrome.contextMenus.create({
          documentUrlPatterns: generateUrlPatterns('/*'),
          contexts: ['page'],
          title: '选项设置',
          id: Menu.Options,
          parentId: Menu.Root,
        })
      }

      chrome.contextMenus.create({
        documentUrlPatterns: generateUrlPatterns('/t/*'),
        contexts: ['page'],
        title: '解析本页 Base64',
        id: Menu.Decode,
        parentId: Menu.Root,
      })

      chrome.contextMenus.create({
        documentUrlPatterns: generateUrlPatterns('/t/*'),
        contexts: ['page'],
        title: '添加进稍后阅读',
        id: Menu.Reading,
        parentId: Menu.Root,
      })

      chrome.contextMenus.onClicked.addListener((info, tab) => {
        if (tab?.id) {
          switch (info.menuItemId) {
            case Menu.Options: {
              void chrome.sidePanel.open({ tabId: tab.id })
              break
            }

            case Menu.Decode: {
              void chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['scripts/decode-base64.min.js'],
              })
              break
            }

            case Menu.Reading: {
              void chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['scripts/reading-list.min.js'],
              })
              break
            }
          }
        }
      })
    }
    else {
      void chrome.contextMenus.remove(Menu.Root)
    }
  })
})

chrome.tabs.onUpdated.addListener((tabId, _, tab) => {
  if (!('sidePanel' in chrome)) {
    return
  }

  void (async () => {
    if (!tab.url) {
      return
    }

    const url = new URL(tab.url)
    const origins = generateOrigins()

    if (origins.includes(url.origin)) {
      await chrome.sidePanel.setOptions({
        tabId,
        path: 'pages/options.html',
        enabled: true,
      })
    }
    else {
      await chrome.sidePanel.setOptions({
        tabId,
        enabled: false,
      })
    }
  })()
})

const checkInAlarmName = 'dailyCheckIn'

chrome.alarms.get(checkInAlarmName, (alarm) => {
  if (typeof alarm === 'undefined') {
    // background 脚本无法持久运行，在 Chrome 中 5 分钟内会关闭连接，所以需要使用 alarm 来保持定时任务。
    void chrome.alarms.create(checkInAlarmName, {
      periodInMinutes: 4.9,
    })
  }
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === checkInAlarmName) {
    void chrome.storage.sync.get().then((items: StorageItems) => {
      const options = items[StorageKey.Options]

      if (options?.autoCheckIn.enabled) {
        void checkIn()
      }
    })
  }
})
