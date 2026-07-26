export interface ShareCardThemeConfig {
  id: 'light' | 'dark'
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
]

export const defaultShareCardThemeId = 'light'

export const shareCardThemeStorageKey = 'v2p-share-theme'

export function getShareCardTheme(id: string): ShareCardThemeConfig {
  return shareCardThemes.find((theme) => theme.id === id) ?? shareCardThemes[0]
}
