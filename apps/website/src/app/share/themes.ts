export interface ShareCardThemeConfig {
  id: 'light' | 'dark' | 'v2ex'
  name: string
  mode: 'light' | 'dark'
  rootClassName: string
  qrCode: { dark: string, light: string }
}

export const shareCardThemes: ShareCardThemeConfig[] = [
  {
    id: 'light',
    name: '浅色',
    mode: 'light',
    rootClassName: '',
    qrCode: { dark: '#1e293b', light: '#ffffff' },
  },
  {
    id: 'dark',
    name: '暗色',
    mode: 'dark',
    rootClassName: 'theme-dark',
    qrCode: { dark: '#adbac7', light: '#22272e' },
  },
  {
    id: 'v2ex',
    name: 'V2EX 经典',
    mode: 'light',
    rootClassName: 'theme-v2ex',
    qrCode: { dark: '#333333', light: '#ffffff' },
  },
]

export const defaultShareCardThemeId = 'light'

export const shareCardThemeStorageKey = 'v2p-share-theme'

export function getShareCardTheme(id: string): ShareCardThemeConfig {
  return shareCardThemes.find((theme) => theme.id === id) ?? shareCardThemes[0]
}
