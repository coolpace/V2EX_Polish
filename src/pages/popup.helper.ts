export const enum TabId {
  Hot = 'tab-hot',
  Latest = 'tab-latest',
  Message = 'tab-message',
  Setting = 'tab-setting',
}

export function isTabId(tabId: any): tabId is TabId {
  if (typeof tabId === 'string') {
    if (
      tabId === TabId.Hot ||
      tabId === TabId.Latest ||
      tabId === TabId.Message ||
      tabId === TabId.Setting
    ) {
      return true
    }
  }
  return false
}

/**
 * 计算 local storage 的数据大小。
 */
export function calculateLocalStorageSize(): number {
  let total = 0

  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i)
    if (key) {
      const value = window.localStorage.getItem(key)
      if (value) {
        total += key.length + value.length
      }
    }
  }

  return total
}

/**
 * 将字节数格式化易读的单位。
 */
export function formatSizeUnits(bytes: number): string {
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB']
  let i = 0

  while (bytes >= 1024 && i < 4) {
    bytes /= 1024
    i++
  }

  return bytes.toFixed(2) + ' ' + units[i]
}

/**
 * 转义 HTML 字符。
 */
export function escapeHTML(htmlString: string): string {
  return htmlString.replace(/[<>&"'']/g, (match) => {
    switch (match) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '&':
        return '&amp;'
      case '"':
        return '&quot;'
      case "'":
        return '&#39;'
      default:
        return match
    }
  })
}
