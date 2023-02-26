if (window.matchMedia) {
  const setColorScheme = (perfersDark) => {
    const colorScheme = perfersDark ? 'dark' : 'light'
    chrome.runtime.sendMessage({ colorScheme })
  }

  const perfersDark = window.matchMedia('(prefers-color-scheme: dark)')

  setColorScheme(perfersDark.matches)

  perfersDark.addEventListener('change', ({ matches }) => {
    setColorScheme(matches)
  })
}
