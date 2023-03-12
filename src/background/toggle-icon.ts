const setColorScheme = (perfersDark: boolean) => {
  const colorScheme = perfersDark ? 'dark' : 'light'
  void chrome.runtime.sendMessage({ colorScheme })
}

const perfersDark = window.matchMedia('(prefers-color-scheme: dark)')

setColorScheme(perfersDark.matches)

perfersDark.addEventListener('change', ({ matches }) => {
  setColorScheme(matches)
})
