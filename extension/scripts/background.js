chrome.runtime.onMessage.addListener((message) => {
  chrome.action.setIcon({
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

chrome.contextMenus.create({
  contexts: ['all'],
  title: 'V2EX Polish',
  visible: true,
  id: 'v2p-ctx',
})

chrome.contextMenus.create({
  contexts: ['all'],
  title: 'Base64 解码',
  id: 'v2p-ctx-decode',
  parentId: 'v2p-ctx',
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'v2p-ctx-decode') {
    console.log(info, tab)
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['./scripts/decode-base64.min.js'],
    })
  }
})
