import { Menu, MessageKey, StorageKey, V2EX_DOMAINS } from '../constants'
import type { StorageItems } from '../types'
import { getRunEnv } from '../utils'
import { checkIn } from './daily-check-in'

interface Message {
  [MessageKey.action]?: 'openPopup'
  [MessageKey.colorScheme]?: 'dark' | 'light'
  [MessageKey.showOptions]?: true
}

function generateUrlPatterns(path: string): string[] {
  return V2EX_DOMAINS.map((domain) => `https://${domain}${path}`)
}

function generateOrigins(): string[] {
  return V2EX_DOMAINS.map((domain) => `https://${domain}`)
}

chrome.runtime.onMessage.addListener((message: Message) => {
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
