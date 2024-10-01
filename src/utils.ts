import { defaultOptions, EXTENSION_NAME, StorageKey, V2EX } from './constants'
import type { SettingsSyncInfo, StorageItems, StorageSettings } from './types'

// 动态获取 V2EX 的域名，防止跨域。
export const V2EX_ORIGIN =
  typeof window !== 'undefined' && window.location.origin.includes('v2ex.com')
    ? window.location.origin
    : V2EX.Origin

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
  { format = 'YMD' }: { format?: 'YMD' | 'YMDHM' | 'YMDHMS' } = {}
): string {
  const date = new Date(timestamp.toString().length === 10 ? timestamp * 1000 : timestamp)
  const year = date.getFullYear().toString()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  const YMD = `${year}-${month}-${day}`

  if (format === 'YMDHM') {
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')

    return `${YMD} ${hour}:${minute}`
  }

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
 * 判断是否为简单 JS 对象（不包括 Array）。
 */
function isObject(value: any): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * 深度合并两个对象。
 */
export function deepMerge<
  T extends Record<string, any> = Record<string, any>,
  U extends Record<string, any> = Record<string, any>,
>(target: T, source: U): T & U {
  const result = {} as Record<string, any>

  for (const key in target) {
    const targetProp = target[key]
    const sourceProp = source[key]

    if (isObject(targetProp) && isObject(sourceProp)) {
      // 如果是对象，递归调用函数进行合并
      result[key] = deepMerge(targetProp, sourceProp)
    } else if (Reflect.has(source, key)) {
      // 如果 obj2 中也有这个属性，则进行覆盖
      result[key] = sourceProp
    } else {
      // 否则直接拷贝 obj1 中的属性
      result[key] = targetProp
    }
  }

  // 将 obj2 中剩余的属性拷贝到结果对象中
  for (const key in source) {
    if (!Reflect.has(target, key)) {
      result[key] = source[key]
    }
  }

  return result as T & U
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

const mark = `${EXTENSION_NAME}_settings`

/**
 * 获取存储的个人配置备份。
 */
export async function getV2P_Settings(): Promise<
  { noteId: string; config: StorageSettings } | undefined
> {
  let noteId: string | undefined

  {
    const res = await fetch(`${V2EX_ORIGIN}/notes`)
    const htmlText = await res.text()
    const $page = $(htmlText)
    const $note = $page.find('.note_item > .note_item_title > a[href^="/notes"]')

    $note.each((_, dom) => {
      const $dom = $(dom)

      if ($dom.text().startsWith(mark)) {
        const href = $dom.attr('href')

        if (typeof href === 'string') {
          const id = href.split('/').at(2)
          noteId = id
        }

        return false
      }
    })
  }

  if (noteId) {
    const res = await fetch(`${V2EX_ORIGIN}/notes/edit/${noteId}`)
    const htmlText = await res.text()

    const $editor = $(htmlText).find('#note_content.note_editor')
    const value = $editor.val()

    if (typeof value === 'string') {
      const syncSettings = JSON.parse(value.replace(mark, ''))

      if (isValidSettings(syncSettings)) {
        return { noteId, config: syncSettings }
      }
    }
  }
}

/**
 * 将个人配置备份存储。
 */
export async function setV2P_Settings(
  storageSettings: StorageSettings,
  signal?: AbortSignal
): Promise<SettingsSyncInfo> {
  const data = await getV2P_Settings()

  const updating = !!data // 判断操作是「初始化数据」还是「更新数据」。

  const formData = new FormData()

  const syncVersion = updating ? data.config[StorageKey.SyncInfo]!.version + 1 : 1

  const syncInfo: SettingsSyncInfo = {
    version: syncVersion,
    lastSyncTime: Date.now(),
  }

  formData.append(
    'content',
    mark + JSON.stringify({ ...storageSettings, [StorageKey.SyncInfo]: syncInfo })
  )
  formData.append('syntax', '0')

  if (updating) {
    const { noteId } = data

    await fetch(`${V2EX_ORIGIN}/notes/edit/${noteId}`, {
      method: 'POST',
      body: formData,
      signal,
    })
  } else {
    // 如果是第一次备份，则新建一个 V2EX 记事本来存储。
    formData.append('parent_id', '0')

    await fetch(`${V2EX_ORIGIN}/notes/new`, {
      method: 'POST',
      body: formData,
      signal,
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  await setStorage(StorageKey.SyncInfo, syncInfo)

  return syncInfo
}

/**
 * 获取用户存储的应用数据。
 */
export function getStorage(useCache = true): Promise<StorageSettings> {
  return new Promise((resolve, reject) => {
    if (useCache) {
      if (window.__V2P_StorageCache) {
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
        .catch(() => {
          reject(new Error('获取扩展配置失败。'))
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

let controller: AbortController | null = null

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
      try {
        await chrome.storage.sync.set({ [storageKey]: storageItem })

        // 当检测到配置更新时，自动备份到远程。
        if (
          storageKey !== StorageKey.API &&
          storageKey !== StorageKey.SyncInfo &&
          typeof $ !== 'undefined'
        ) {
          const settings = await getStorage(false)

          if (controller) {
            controller.abort()
          }
          controller = new AbortController()

          setV2P_Settings(settings, controller.signal)
        }
      } catch (err) {
        if (String(err).includes('QUOTA_BYTES_PER_ITEM quota exceeded')) {
          console.error(
            `${EXTENSION_NAME}: 无法设置 ${storageKey}， 单个 item 不能超出 8 KB，详情查看：https://developer.chrome.com/docs/extensions/reference/storage/#storage-areas`
          )
        }

        console.error(err)
        throw new Error(`❌ 无法设置：${storageKey}`)
      }
      break

    default:
      throw new Error(`未知的 storageKey： ${storageKey}`)
  }
}
