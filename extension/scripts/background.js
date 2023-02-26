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
