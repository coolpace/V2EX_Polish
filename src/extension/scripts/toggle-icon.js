if (window.matchMedia) {
  const { matches } = window.matchMedia('(prefers-color-scheme: dark)')
  const colorScheme = matches ? 'dark' : 'light'
  chrome.runtime.sendMessage({ colorScheme })

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({ matches }) => {
    const colorScheme = matches ? 'dark' : 'light'
    chrome.runtime.sendMessage({ colorScheme })
  })
}
