import { MessageKey } from '../constants'

const setColorScheme = (perfersDark: boolean) => {
  void chrome.runtime.sendMessage({ [MessageKey.colorScheme]: perfersDark ? 'dark' : 'light' })
}

const perfersDark = window.matchMedia('(prefers-color-scheme: dark)')

setColorScheme(perfersDark.matches)

perfersDark.addEventListener('change', ({ matches }) => {
  setColorScheme(matches)
})
