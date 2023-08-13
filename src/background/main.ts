import { Menu, MessageKey, StorageKey } from '../constants'
import { getRunEnv, getStorage } from '../utils'
import { checkIn } from './daily-check-in'

interface Message {
  [MessageKey.action]?: 'openPopup'
  [MessageKey.colorScheme]?: 'dark' | 'light'
}

chrome.runtime.onMessage.addListener((message: Message) => {
  // if (Reflect.has(message, MessageKey.action)) {
  // if (message[MessageKey.action] === 'openPopup') {
  //   void chrome.action.openPopup()
  // }
  // }

  if (Reflect.has(message, MessageKey.colorScheme)) {
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
})

chrome.contextMenus.removeAll(() => {
  const runEnv = getRunEnv()

  chrome.contextMenus.create({
    documentUrlPatterns: ['https://v2ex.com/*', 'https://www.v2ex.com/*', 'https://cn.v2ex.com/*'],
    contexts: ['page'],
    title: 'V2EX Polish',
    visible: true,
    id: Menu.Root,
  })

  if (runEnv === 'chrome' && typeof chrome.sidePanel.open === 'function') {
    chrome.contextMenus.create({
      documentUrlPatterns: [
        'https://v2ex.com/*',
        'https://www.v2ex.com/*',
        'https://cn.v2ex.com/*',
      ],
      contexts: ['page'],
      title: '选项设置',
      id: Menu.Options,
      parentId: Menu.Root,
    })
  }

  chrome.contextMenus.create({
    documentUrlPatterns: [
      'https://v2ex.com/t/*',
      'https://www.v2ex.com/t/*',
      'https://cn.v2ex.com/t/*',
    ],
    contexts: ['page'],
    title: '解析本页 Base64',
    id: Menu.Decode,
    parentId: Menu.Root,
  })

  chrome.contextMenus.create({
    documentUrlPatterns: [
      'https://v2ex.com/t/*',
      'https://www.v2ex.com/t/*',
      'https://cn.v2ex.com/t/*',
    ],
    contexts: ['page'],
    title: '添加进稍后阅读',
    id: Menu.Reading,
    parentId: Menu.Root,
  })

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (tab?.id) {
      switch (info.menuItemId) {
        case Menu.Options: {
          chrome.sidePanel.open({ windowId: tab.windowId })
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

    if (
      url.origin === 'https://www.v2ex.com' ||
      url.origin === 'https://v2ex.com' ||
      url.origin === 'https://cn.v2ex.com'
    ) {
      await chrome.sidePanel.setOptions({
        tabId,
        path: 'pages/options.html',
        enabled: true,
      })
    } else {
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
    void getStorage(false).then((storage) => {
      const options = storage[StorageKey.Options]

      if (options.autoCheckIn.enabled) {
        void checkIn()
      }
    })
  }
})
