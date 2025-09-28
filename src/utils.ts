import { defaultOptions, EXTENSION_NAME, StorageKey, V2EX } from './constants'
import type { SettingsSyncInfo, StorageItems, StorageSettings } from './types'

/** 动态获取 V2EX 的域名，防止跨域。 */
export const V2EX_ORIGIN
  = typeof window !== 'undefined' && window.location.origin.includes('v2ex.com')
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
  }
  else if (iosPlatforms.test(userAgent)) {
    os = 'ios'
  }
  else if (windowsPlatforms.test(userAgent)) {
    os = 'windows'
  }
  else if (userAgent.includes('android')) {
    os = 'android'
  }
  else if (userAgent.includes('linux')) {
    os = 'linux'
  }

  return os
}

/**
 * 将时间戳格式化为「年月日 时:分:秒」。
 */
export function formatTimestamp(
  timestamp: number,
  { format = 'YMD' }: { format?: 'YMD' | 'YMDHM' | 'YMDHMS' } = {},
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
 * 日期时间解析工具函数的配置选项类型定义
 */
interface ParseDateTimeOptions {
  /** 输出格式类型 */
  format?: 'YYYY/MM/DD HH:mm' | 'YYYY-MM-DD HH:mm' | 'YYYY-MM-DD HH:mm:ss' | 'YYYY/MM/DD' | 'MM/DD HH:mm' | 'HH:mm:ss' | 'timestamp'
  /** 是否返回本地时间，默认为true */
  useLocalTime?: boolean
}

/**
 * 日期时间解析工具函数的返回结果类型
 */
interface ParseDateTimeResult {
  /** 解析是否成功 */
  success: boolean
  /** 格式化后的日期时间字符串或时间戳 */
  formatted?: string | number
  /** 原始Date对象 */
  date?: Date
  /** 错误信息 */
  error?: string
}

/**
 * 解析日期时间字符串并转换为指定格式
 *
 * @param dateTimeString - 日期时间字符串，支持多种格式如 "2024-10-18 08:57:40 +08:00"
 * @param options - 配置选项
 * @returns 解析结果对象
 */
export function parseDateTime(
  dateTimeString: string,
  options: ParseDateTimeOptions = {},
): ParseDateTimeResult {
  const { format = 'YYYY-MM-DD HH:mm' } = options

  try {
    // 处理输入字符串，移除多余空格
    const trimmedInput = dateTimeString.trim()

    if (!trimmedInput) {
      return {
        success: false,
        error: '日期时间字符串不能为空',
      }
    }

    let date: Date

    // 尝试解析不同格式的日期时间字符串
    if (trimmedInput.includes('+') || trimmedInput.includes('Z')) {
      // 处理带时区信息的字符串，如 "2024-10-18 08:57:40 +08:00"
      date = new Date(trimmedInput)
    }
    else if (trimmedInput.includes('T')) {
      // 处理ISO格式，如 "2024-10-18T08:57:40"
      date = new Date(trimmedInput)
    }
    else {
      // 处理标准格式，如 "2024-10-18 08:57:40" 或 "2024/10/18 08:57:40"
      // 将斜杠替换为连字符以确保兼容性
      const normalizedString = trimmedInput.replace(/\//g, '-')
      date = new Date(normalizedString)
    }

    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return {
        success: false,
        error: '无效的日期时间格式',
      }
    }

    // 根据指定格式返回结果
    let formatted: string | number

    if (format === 'timestamp') {
      formatted = date.getTime()
    }
    else {
      // 获取日期时间组件
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')

      // 根据格式类型生成输出
      switch (format) {
        case 'YYYY-MM-DD HH:mm':
          formatted = `${year}-${month}-${day} ${hours}:${minutes}`
          break

        case 'YYYY/MM/DD HH:mm':
          formatted = `${year}/${month}/${day} ${hours}:${minutes}`
          break

        case 'YYYY-MM-DD HH:mm:ss':
          formatted = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
          break

        case 'YYYY/MM/DD':
          formatted = `${year}/${month}/${day}`
          break

        case 'MM/DD HH:mm':
          formatted = `${month}/${day} ${hours}:${minutes}`
          break

        case 'HH:mm:ss':
          formatted = `${hours}:${minutes}:${seconds}`
          break

        default:
          formatted = `${year}/${month}/${day} ${hours}:${minutes}`
      }
    }

    return {
      success: true,
      formatted,
      date,
    }
  }
  catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '解析日期时间时发生未知错误',
    }
  }
}

/**
 * 从字符串中提取天数。
 */
export function extractDays(str: string) {
  const match = str.match(/(\d+)\s*天前/)

  return match ? Number(match[1]) : null
}

/**
 * 比较两个时间戳是否为同一天。
 */
export function isSameDay(timestamp1: number, timestamp2: number): boolean {
  const date1 = new Date(timestamp1)
  const date2 = new Date(timestamp2)

  return (
    date1.getFullYear() === date2.getFullYear()
    && date1.getMonth() === date2.getMonth()
    && date1.getDate() === date2.getDate()
  )
}

/**
 * 判断是否为简单 JS 对象（不包括 Array）。
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * 深度合并两个对象。
 */
export function deepMerge<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any> = Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  U extends Record<string, any> = Record<string, any>,
>(target: T, source: U): T & U {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = {} as Record<string, any>

  for (const key in target) {
    const targetProp = target[key]
    const sourceProp = source[key]

    if (isObject(targetProp) && isObject(sourceProp)) {
      // 如果是对象，递归调用函数进行合并
      result[key] = deepMerge(targetProp, sourceProp)
    }
    else if (Reflect.has(source, key)) {
      // 如果 obj2 中也有这个属性，则进行覆盖
      result[key] = sourceProp
    }
    else {
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
 * 判断当前运行环境是否为浏览器扩展。
 */
export function isBrowserExtension() {
  const runEnv = getRunEnv()

  return runEnv === 'chrome' || runEnv === 'web-ext'
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

      case '\'':
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
export function isValidSettings(settings: unknown): settings is StorageSettings {
  return !!settings && typeof settings === 'object' && StorageKey.Options in settings
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const mark = `${EXTENSION_NAME}_settings`

/**
 * 从 V2EX 记事本中获取插件配置的云端备份数据。
 *
 * @description
 * 该函数通过解析 V2EX 记事本页面，查找并读取插件配置的云端备份，
 * 实现插件配置在不同设备间的同步功能。
 *
 * @returns
 * - 成功时返回包含记事本 ID 和配置数据的对象
 * - 未找到有效配置或解析失败时返回 undefined
 *
 * @throws 网络请求失败或 HTML 解析异常时可能抛出错误
 */
export async function getV2P_Settings(): Promise<
  { noteId: string, config: StorageSettings } | undefined
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
      const syncSettings = JSON.parse(value.replace(mark, '')) as unknown

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
  signal?: AbortSignal,
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
    mark + JSON.stringify({ ...storageSettings, [StorageKey.SyncInfo]: syncInfo }),
  )
  formData.append('syntax', '0')

  if (updating) {
    const { noteId } = data

    await fetch(`${V2EX_ORIGIN}/notes/edit/${noteId}`, {
      method: 'POST',
      body: formData,
      signal,
    })
  }
  else {
    // 如果是第一次备份，则新建一个 V2EX 记事本来存储。
    formData.append('parent_id', '0')

    await fetch(`${V2EX_ORIGIN}/notes/new`, {
      method: 'POST',
      body: formData,
      signal,
    })
  }

  await setStorage(StorageKey.SyncInfo, syncInfo)

  return syncInfo
}

/**
 * 获取用户存储的应用数据。
 *
 * @description
 * 该方法会按以下顺序获取数据：
 * 1. 如果启用缓存且存在缓存数据，直接返回缓存
 * 2. 如果不在浏览器扩展环境中，返回默认配置
 * 3. 如果在浏览器扩展环境中，从 chrome.storage.sync 获取数据
 *
 * @param useCache - 是否使用缓存数据，默认为 true
 */
export function getStorage(useCache = true): Promise<StorageSettings> {
  return new Promise((resolve, reject) => {
    if (useCache) {
      if (window.__V2P_StorageCache) {
        resolve(window.__V2P_StorageCache)
      }
    }

    if (!isBrowserExtension()) {
      const data: StorageSettings = { [StorageKey.Options]: defaultOptions }

      if (typeof window !== 'undefined') {
        window.__V2P_StorageCache = data
      }

      resolve(data)
    }
    else {
      chrome.storage.sync
        .get()
        .then((items: StorageItems) => {
          let data: StorageSettings

          const options = items[StorageKey.Options]

          if (options) {
            data = { ...items, [StorageKey.Options]: deepMerge(defaultOptions, options) }
          }
          else {
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
  storageItem: StorageItems[T],
) {
  switch (storageKey) {
    case StorageKey.Options:
      // fall through

    case StorageKey.API:
      // fall through

    case StorageKey.Daily:

      // fall through
    case StorageKey.MemberTag:

      // fall through
    case StorageKey.SyncInfo:

      // fall through
    case StorageKey.ReadingList:
      try {
        await chrome.storage.sync.set({ [storageKey]: storageItem })

        // 当检测到配置更新时，自动备份到远程。
        if (
          storageKey !== StorageKey.API
          && storageKey !== StorageKey.SyncInfo
          && typeof $ !== 'undefined'
        ) {
          const settings = await getStorage(false)

          if (controller) {
            controller.abort()
          }

          controller = new AbortController()

          await setV2P_Settings(settings, controller.signal)
        }
      }
      catch (err) {
        if (String(err).includes('QUOTA_BYTES_PER_ITEM quota exceeded')) {
          console.error(
            `${EXTENSION_NAME}: 无法设置 ${storageKey}， 单个 item 不能超出 8 KB，详情查看：https://developer.chrome.com/docs/extensions/reference/storage/#storage-areas`,
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
