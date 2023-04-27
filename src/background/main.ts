import { Menu, MessageKey } from '../constants'
import { getOptions } from '../utils'
import { checkIn } from './daily-check-in'

interface Message {
  [MessageKey.action]?: 'openPopup'
  [MessageKey.colorScheme]?: 'dark' | 'light'
}

chrome.runtime.onMessage.addListener((message: Message) => {
  // if (message[MessageKey.action] === 'openPopup') {
  //   void chrome.action.openPopup()
  // }

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
})

chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create({
    documentUrlPatterns: ['https://v2ex.com/*', 'https://www.v2ex.com/*'],
    contexts: ['page'],
    title: 'V2EX Polish',
    visible: true,
    id: Menu.Root,
  })

  chrome.contextMenus.create({
    documentUrlPatterns: ['https://v2ex.com/t/*', 'https://www.v2ex.com/t/*'],
    contexts: ['page'],
    title: '解析本页 Base64',
    id: Menu.Decode,
    parentId: Menu.Root,
  })

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === Menu.Decode) {
      if (tab?.id) {
        void chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['scripts/decode-base64.min.js'],
        })
      }
    }
  })
})

const checkInAlarmName = 'dailyCheckIn'

chrome.alarms.get(checkInAlarmName, (alarm) => {
  if (typeof alarm === 'undefined') {
    // background 脚本无法持久运行，在 Chrome 中 5 分钟内会关闭连接，所以需要使用 alarm 来保持定时任务。
    chrome.alarms.create(checkInAlarmName, {
      periodInMinutes: 4.9,
    })
  }
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === checkInAlarmName) {
    void getOptions(false).then((options) => {
      if (options.autoCheckIn.enabled) {
        void checkIn()
      }
    })
  }
})
