import { defaultOptions, EXTENSION_NAME, StorageKey } from './constants'
import { deepMerge } from './deep-merge'
import type { StorageItems, StorageSettings } from './types'

/**
 * 获取用户的操作系统。
 */
export function getOS() {
  const userAgent = window.navigator.userAgent.toLowerCase()
  const macosPlatforms = /(macintosh|macintel|macppc|mac68k|macos)/i
  const windowsPlatforms = /(win32|win64|windows|wince)/i
  const iosPlatforms = /(iphone|ipad|ipod)/i

  let os: 'macos' | 'ios' | 'windows' | 'android' | 'linux' | null = null

  if (macosPlatforms.test(userAgent)) {
    os = 'macos'
  } else if (iosPlatforms.test(userAgent)) {
    os = 'ios'
  } else if (windowsPlatforms.test(userAgent)) {
    os = 'windows'
  } else if (userAgent.includes('android')) {
    os = 'android'
  } else if (userAgent.includes('linux')) {
    os = 'linux'
  }

  return os
}

/**
 * 将时间戳格式化为「年月日 时:分:秒」。
 */
export function formatTimestamp(
  timestamp: number,
  { format = 'YMD' }: { format?: 'YMD' | 'YMDHMS' } = {}
): string {
  const date = new Date(timestamp.toString().length === 10 ? timestamp * 1000 : timestamp)
  const year = date.getFullYear().toString()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  const YMD = `${year}-${month}-${day}`

  if (format === 'YMDHMS') {
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')
    const second = date.getSeconds().toString().padStart(2, '0')

    return `${YMD} ${hour}:${minute}:${second}`
  }

  return YMD
}

/**
 * 比较两个时间戳是否为同一天。
 */
export function isSameDay(timestamp1: number, timestamp2: number): boolean {
  const date1 = new Date(timestamp1)
  const date2 = new Date(timestamp2)

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

/**
 * 检查运行在哪个扩展中。
 */
export function getRunEnv(): 'chrome' | 'web-ext' | null {
  if (typeof chrome === 'object' && typeof chrome.extension !== 'undefined') {
    return 'chrome'
  }

  if (typeof browser === 'object' && typeof browser.extension !== 'undefined') {
    return 'web-ext'
  }

  return null
}

/**
 * 获取用户存储的应用数据。
 */
export function getStorage(useCache = true): Promise<StorageSettings> {
  return new Promise((resolve, reject) => {
    if (useCache) {
      if (typeof window !== 'undefined' && window.__V2P_StorageCache) {
        resolve(window.__V2P_StorageCache)
      }
    }

    const runEnv = getRunEnv()

    if (!(runEnv === 'chrome' || runEnv === 'web-ext')) {
      const data: StorageSettings = { [StorageKey.Options]: defaultOptions }
      if (typeof window !== 'undefined') {
        window.__V2P_StorageCache = data
      }
      resolve(data)
    } else {
      chrome.storage.sync
        .get()
        .then((items: StorageItems) => {
          let data: StorageSettings

          const options = items[StorageKey.Options]

          if (options) {
            data = { ...items, [StorageKey.Options]: deepMerge(defaultOptions, options) }
          } else {
            data = { ...items, [StorageKey.Options]: defaultOptions }
          }

          if (typeof window !== 'undefined') {
            window.__V2P_StorageCache = data
          }
          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
    }
  })
}

/**
 * 同步获取用户存储的应用数据。
 */
export function getStorageSync(): StorageSettings {
  const storage = window.__V2P_StorageCache

  if (!storage) {
    throw new Error(`${EXTENSION_NAME}: 无可用的 Storage 缓存数据`)
  }

  return storage
}

export async function setStorage<T extends StorageKey>(
  storageKey: T,
  storageItem: StorageItems[T]
) {
  switch (storageKey) {
    case StorageKey.Options:
    case StorageKey.API:
    case StorageKey.Daily:
    case StorageKey.MemberTag:
    case StorageKey.SyncInfo:
    case StorageKey.ReadingList:
      await chrome.storage.sync.set({ [storageKey]: storageItem })
      break

    default:
      throw new Error(`未知的 storageKey： ${storageKey}`)
  }
}

/**
 * 转义 HTML 字符串中的特殊字符。
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

/**
 * 向 HTML body 下动态插入脚本。
 */
export function injectScript(scriptSrc: string) {
  const script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', scriptSrc)
  document.body.appendChild(script)
}

/**
 * 简单地校验数据类型，更好的做法是使用 zod、yup 等库，但在此插件没必要。
 */
export function isValidSettings(settings: any): settings is StorageSettings {
  return !!settings && typeof settings === 'object' && StorageKey.Options in settings
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
