import { setFontType, setThemeType } from '../../theme-state'
import type { FontType, ThemeType } from '../../types'
import { $wrapper } from '../globals'
import { loadIcons } from './icons'

export function setFont(type: FontType) {
  setFontType(type)
}

export function setTheme(type: ThemeType) {
  setThemeType(type)
}

/**
 * 设置 options、popup 主题。
 */
export function initTheme({
  autoSwitch,
  themeType = 'light-default',
}: {
  autoSwitch?: boolean
  themeType?: ThemeType
}) {
  // 优先按照设置执行自动切换主题。
  if (autoSwitch) {
    const colorMedia = window.matchMedia('(prefers-color-scheme: dark)')
    const perfersDark = colorMedia.matches

    if (perfersDark) {
      setTheme('dark-default')
    }
    else if (themeType === 'dark-default') {
      setTheme('light-default')
    }
    else {
      setTheme(themeType)
    }

    colorMedia.addEventListener('change', ({ matches }) => {
      if (matches) {
        setTheme('dark-default')
      }
      else if (themeType === 'dark-default') {
        setTheme('light-default')
      }
      else {
        setTheme(themeType)
      }
    })
  }
  else {
    setTheme(themeType)
  }
}

interface ToggleThemeParams {
  /** V2EX 原生页面中的主题切换按钮。 */
  $toggle: JQuery
  /** 用户是否要切换为暗色主题。 */
  prefersDark: boolean
  /** 自定义的主题类型。 */
  themeType?: ThemeType
}

/**
 * 处理主题类型变更后如何切换主题。
 */
export function toggleTheme({
  $toggle,
  prefersDark,
  themeType = 'light-default',
}: ToggleThemeParams) {
  const isPageDark = $wrapper.hasClass('Night')
  const shouldSync = prefersDark !== isPageDark

  // 如果检测到本地设置与用户偏好设置不一致：
  if (shouldSync) {
    const toggleThemeUrl = $toggle.attr('href') // href='/settings/night/toggle'

    // 调用远程接口修改 cookie，以便下次刷新页面时保持配置一致。
    if (typeof toggleThemeUrl === 'string') {
      void fetch(toggleThemeUrl)
    }

    // 同时修改切换按钮。
    if (prefersDark) {
      $toggle.prop('title', '使用浅色主题')
      $toggle.html('<i data-v2p-icon="sun"></i>')
    }
    else {
      $toggle.prop('title', '使用深色主题')
      $toggle.html('<i data-v2p-icon="moon"></i>')
    }
  }

  if (prefersDark) {
    setTheme('dark-default')
    $wrapper.addClass('Night')
  }
  else {
    setTheme(themeType)
    $wrapper.removeClass('Night')
  }

  loadIcons($toggle[0])
}
