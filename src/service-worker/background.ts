import { Menu } from '../constants'

interface Message {
  colorScheme: 'dark' | 'light'
}

chrome.runtime.onMessage.addListener((message: Message) => {
  void chrome.action.setIcon({
    path:
      message.colorScheme === 'dark'
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
    documentUrlPatterns: ['https://*.v2ex.com/*'],
    contexts: ['page'],
    title: 'V2EX Polish',
    visible: true,
    id: Menu.Root,
  })

  chrome.contextMenus.create({
    documentUrlPatterns: ['https://*.v2ex.com/*'],
    contexts: ['page'],
    title: 'Base64 解码',
    id: Menu.ItemDecode,
    parentId: Menu.Root,
  })

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === Menu.ItemDecode) {
      if (tab?.id) {
        void chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['scripts/decode-base64.min.js'],
        })
      }
    }
  })
})

chrome.storage.onChanged.addListener((changes, namespace) => {
  console.log(changes, `Storage namespace "${namespace}" changed.`)
})
