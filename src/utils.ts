import { createButton } from './components/button'
import type { ModalElements } from './components/modal'
import { createModal } from './components/modal'
import { defaultOptions, EXTENSION_NAME, StorageKey, V2EX } from './constants'
import type { ReadingItem, SettingsSyncInfo, StorageItems, StorageSettings } from './types'

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
 * 合并两个 ReadingList，按 URL 去重，保留最新的添加时间。
 */
function mergeReadingList(
  local: ReadingItem[] | undefined,
  remote: ReadingItem[] | undefined,
): ReadingItem[] {
  if (!local) {
    return remote ?? []
  }

  if (!remote) {
    return local
  }

  const map = new Map<string, ReadingItem>()

  for (const item of local) {
    map.set(item.url, item)
  }

  for (const item of remote) {
    const existing = map.get(item.url)

    if (!existing || item.addedTime > existing.addedTime) {
      map.set(item.url, item)
    }
  }

  return [...map.values()].sort((a, b) => b.addedTime - a.addedTime)
}

/**
 * 准备用于远程备份的数据。排除不应备份的设备特定字段。
 *
 * - API（个人 Token）和 Daily（签到数据）是设备/账户特定的，不参与远程备份。
 */
export function prepareBackupData(storage: StorageSettings): StorageSettings {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [StorageKey.API]: _api,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [StorageKey.Daily]: _daily,
    ...backupData
  } = storage

  return backupData as StorageSettings
}

/**
 * 将远程配置正确分发到 sync 和 local storage。
 *
 * - MemberTag → chrome.storage.local（合并策略：本地优先）
 * - ReadingList → chrome.storage.sync（合并策略：按 URL 去重合并）
 * - 其他配置 → chrome.storage.sync（与当前本地配置 deepMerge）
 * - 排除设备特定数据（API、Daily）不被远程覆盖
 */
export async function applyRemoteSettings(
  remoteSettings: StorageSettings,
  syncInfoOverride?: Partial<SettingsSyncInfo>,
): Promise<void> {
  // 1. 从远程配置中提取 MemberTag，写入 local storage
  const remoteMemberTag = remoteSettings[StorageKey.MemberTag]

  if (remoteMemberTag) {
    const localData = await chrome.storage.local.get(StorageKey.MemberTag)
    const localMemberTag = (localData as Partial<StorageItems>)[StorageKey.MemberTag]
    // 合并 MemberTag：远程数据补充，本地已有的条目优先保留
    const mergedMemberTag = localMemberTag
      ? { ...remoteMemberTag, ...localMemberTag }
      : remoteMemberTag
    await chrome.storage.local.set({ [StorageKey.MemberTag]: mergedMemberTag })
  }

  // 2. 准备写入 sync storage 的数据（排除 MemberTag、API、Daily）
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [StorageKey.MemberTag]: _mt,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [StorageKey.API]: _api,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [StorageKey.Daily]: _daily,
    ...syncableRemoteSettings
  } = remoteSettings

  // 3. 合并 SyncInfo（允许调用方覆盖 lastCheckTime 等字段）
  const remoteSyncInfo = remoteSettings[StorageKey.SyncInfo]

  if (remoteSyncInfo ?? syncInfoOverride) {
    syncableRemoteSettings[StorageKey.SyncInfo] = {
      ...remoteSyncInfo,
      ...syncInfoOverride,
    } as SettingsSyncInfo
  }

  // 4. 与当前 sync storage 的数据合并后写入
  const currentSyncData = await chrome.storage.sync.get()
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [StorageKey.MemberTag]: _currentMt, // 排除 MemberTag 残留
    ...currentSyncOnly
  } = currentSyncData as StorageItems

  // 5. ReadingList 使用去重合并而非简单覆盖
  const remoteReadingList = syncableRemoteSettings[StorageKey.ReadingList]
  const localReadingList = currentSyncOnly[StorageKey.ReadingList]

  if (remoteReadingList?.data ?? localReadingList?.data) {
    syncableRemoteSettings[StorageKey.ReadingList] = {
      data: mergeReadingList(localReadingList?.data, remoteReadingList?.data),
    }
  }

  await chrome.storage.sync.set(deepMerge(currentSyncOnly, syncableRemoteSettings))
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
 * 校验远程配置数据的基本结构是否有效。
 *
 * 不使用 zod 等库，仅做核心字段的结构性检查，
 * 确保数据不是随意对象（如被用户误编辑的记事本内容）。
 */
export function isValidSettings(settings: unknown): settings is StorageSettings {
  if (!settings || typeof settings !== 'object') {
    return false
  }

  // Options 必须存在且为对象
  if (!(StorageKey.Options in settings)) {
    return false
  }

  const options = (settings as Record<string, unknown>)[StorageKey.Options]

  if (!options || typeof options !== 'object') {
    return false
  }

  // 校验 Options 中的核心字段存在（theme 和 nestedReply 是必填项）
  const opts = options as Record<string, unknown>

  return 'theme' in opts && 'nestedReply' in opts
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * API 错误类型定义
 */
export interface ApiErrorOptions {
  /** 用户友好的错误消息 */
  message: string
  /** 原始错误，用于保留错误链 */
  cause?: unknown
  /** HTTP 状态码 */
  statusCode?: number
}

/**
 * 统一的 API 错误类
 * 继承自 Error，保留完整的错误链
 */
export class ApiError extends Error {
  readonly statusCode?: number

  constructor(options: ApiErrorOptions) {
    super(options.message, { cause: options.cause })
    this.name = 'ApiError'
    this.statusCode = options.statusCode
  }
}

/**
 * 判断错误是否为请求取消错误
 */
export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError'
}

/**
 * 包装 fetch 请求错误，提供用户友好的错误消息
 *
 * @param error - 原始错误
 * @param fallbackMessage - 默认的用户友好错误消息
 * @returns ApiError 实例
 */
export function wrapApiError(error: unknown, fallbackMessage: string): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (isAbortError(error)) {
    return new ApiError({
      message: '请求被取消',
      cause: error,
    })
  }

  if (error instanceof Error) {
    return new ApiError({
      message: fallbackMessage,
      cause: error,
    })
  }

  return new ApiError({
    message: fallbackMessage,
    cause: error,
  })
}

/**
 * 从 HTTP 响应创建 API 错误
 *
 * @param response - fetch 响应对象
 * @param fallbackMessage - 默认的用户友好错误消息
 */
export function createApiErrorFromResponse(
  response: Response,
  fallbackMessage: string,
): ApiError {
  return new ApiError({
    message: fallbackMessage,
    statusCode: response.status,
    cause: new Error(`HTTP ${response.status}: ${response.statusText}`),
  })
}

/**
 * 判断当前是否为移动端
 * 通过检查 `#site-header` 元素是否存在来判断
 * @returns 是否为移动端
 */
export function isMobileView(): boolean {
  return $('#site-header').length > 0
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
 * @param signal - 可选的 AbortSignal，用于取消请求
 * @throws 网络请求失败时可能抛出错误
 */
export async function getV2P_Settings(signal?: AbortSignal): Promise<
  { noteId: string, config: StorageSettings } | undefined
> {
  let noteId: string | undefined

  {
    const res = await fetch(`${V2EX_ORIGIN}/notes`, { signal })

    if (!res.ok) {
      console.warn(`[${EXTENSION_NAME}] 获取记事本列表失败：HTTP ${res.status}`)

      return undefined
    }

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
    const res = await fetch(`${V2EX_ORIGIN}/notes/edit/${noteId}`, { signal })

    if (!res.ok) {
      console.warn(`[${EXTENSION_NAME}] 获取记事本内容失败：HTTP ${res.status}`)

      return undefined
    }

    const htmlText = await res.text()

    const $editor = $(htmlText).find('#note_content.note_editor')
    const value = $editor.val()

    if (typeof value === 'string') {
      try {
        const syncSettings = JSON.parse(value.replace(mark, '')) as unknown

        if (isValidSettings(syncSettings)) {
          return { noteId, config: syncSettings }
        }
      }
      catch {
        console.warn(`[${EXTENSION_NAME}] 解析远程配置数据失败，记事本内容可能已损坏`)
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
  const data = await getV2P_Settings(signal)

  const updating = !!data // 判断操作是「初始化数据」还是「更新数据」。

  const formData = new FormData()

  // 安全获取远程版本号：如果远程数据存在但缺少 SyncInfo，则视为版本 0。
  const remoteVersion = updating
    ? data.config[StorageKey.SyncInfo]?.version ?? 0
    : 0
  const syncVersion = remoteVersion + 1

  const syncInfo: SettingsSyncInfo = {
    version: syncVersion,
    lastSyncTime: Date.now(),
    lastCheckTime: Date.now(), // 备份后视为已检查，避免 neverChecked 陷阱
  }

  // 备份前过滤掉设备特定数据（API Token、Daily 签到信息）
  const backupData = prepareBackupData(storageSettings)

  formData.append(
    'content',
    mark + JSON.stringify({ ...backupData, [StorageKey.SyncInfo]: syncInfo }),
  )
  formData.append('syntax', '0')

  if (updating) {
    const { noteId } = data

    const res = await fetch(`${V2EX_ORIGIN}/notes/edit/${noteId}`, {
      method: 'POST',
      body: formData,
      signal,
    })

    if (!res.ok) {
      throw new Error(`备份配置失败：HTTP ${res.status}`)
    }
  }
  else {
    // 如果是第一次备份，则新建一个 V2EX 记事本来存储。
    formData.append('parent_id', '0')

    const res = await fetch(`${V2EX_ORIGIN}/notes/new`, {
      method: 'POST',
      body: formData,
      signal,
    })

    if (!res.ok) {
      throw new Error(`创建备份记事本失败：HTTP ${res.status}`)
    }
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

        return
      }
    }

    if (!isBrowserExtension()) {
      const data: StorageSettings = { [StorageKey.Options]: defaultOptions }

      if (typeof window !== 'undefined') {
        window.__V2P_StorageCache = data
      }

      resolve(data)

      return
    }
    else {
      Promise.all([
        chrome.storage.sync.get(),
        chrome.storage.local.get(StorageKey.MemberTag),
      ])
        .then(([syncItems, localItems]: [StorageItems, Partial<StorageItems>]) => {
          let data: StorageSettings

          const options = syncItems[StorageKey.Options]

          // 合并 sync 和 local 的数据，MemberTag 优先从 local 读取。
          const mergedItems: StorageItems = {
            ...syncItems,
            [StorageKey.MemberTag]: localItems[StorageKey.MemberTag]
              ?? syncItems[StorageKey.MemberTag],
          }

          if (options) {
            data = { ...mergedItems, [StorageKey.Options]: deepMerge(defaultOptions, options) }
          }
          else {
            data = { ...mergedItems, [StorageKey.Options]: defaultOptions }
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

/**
 * 判断当前环境是否支持自动备份。
 *
 * 自动备份依赖 jQuery 解析 V2EX 页面 HTML（getV2P_Settings / setV2P_Settings），
 * 在 Service Worker（后台脚本）中 jQuery 不可用，因此仅在页面上下文中启用。
 */
function canAutoBackup(): boolean {
  return typeof $ === 'function'
}

let controller: AbortController | null = null
let backupTimer: ReturnType<typeof setTimeout> | null = null
const BACKUP_DEBOUNCE_MS = 3000

/**
 * 延迟调度自动备份。
 *
 * 连续配置变更会重置计时器，确保在最后一次变更后的 3 秒才触发备份，
 * 避免短时间内产生大量网络请求。
 */
function scheduleBackup() {
  if (backupTimer) {
    clearTimeout(backupTimer)
  }

  if (controller) {
    controller.abort()
  }

  backupTimer = setTimeout(() => {
    backupTimer = null
    controller = new AbortController()
    const { signal } = controller

    void getStorage(false)
      .then((settings) => setV2P_Settings(settings, signal))
      .catch((err) => {
        // AbortError 是正常的取消行为，无需报告
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }

        console.warn(`[${EXTENSION_NAME}] 自动备份失败：`, err)
      })
  }, BACKUP_DEBOUNCE_MS)
}

export async function setStorage<T extends StorageKey>(
  storageKey: T,
  storageItem: StorageItems[T],
) {
  switch (storageKey) {
    case StorageKey.MemberTag:
      try {
        await chrome.storage.local.set({ [storageKey]: storageItem })

        // 当检测到配置更新时，延迟自动备份到远程。
        if (canAutoBackup()) {
          scheduleBackup()
        }
      }
      catch (err) {
        console.error(err)
        throw new Error(`❌ 无法设置：${storageKey}`)
      }

      break

    case StorageKey.Options:
      // fall through

    case StorageKey.API:
      // fall through

    case StorageKey.Daily:
      // fall through

    case StorageKey.SyncInfo:
      // fall through

    case StorageKey.ReadingList:
      try {
        await chrome.storage.sync.set({ [storageKey]: storageItem })

        // 当检测到配置更新时，延迟自动备份到远程。
        if (
          storageKey !== StorageKey.API
          && storageKey !== StorageKey.SyncInfo
          && canAutoBackup()
        ) {
          scheduleBackup()
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

/**
 * 计算配置复杂度（配置项数量）。
 */
function calculateConfigComplexity(settings: StorageSettings): number {
  return Object.keys(settings).filter(
    (key) =>
      key as StorageKey !== StorageKey.SyncInfo
      && key as StorageKey !== StorageKey.API
      && key as StorageKey !== StorageKey.Daily
      && settings[key as StorageKey] !== undefined,
  ).length
}

/**
 * 远程配置同步对话框的类型。
 */
type SyncDialogType = 'gentle' | 'confirm' | 'auto'

/**
 * 远程配置同步对话框的选项。
 */
interface ShowRemoteSyncDialogOptions {
  /** 对话框类型，根据配置复杂度和新鲜度自动选择 */
  type?: SyncDialogType
  /** 是否显示详细信息（如配置项数量） */
  showDetails?: boolean
}

/**
 * 显示远程配置同步确认对话框。
 *
 * @param settings - 远程配置数据
 * @param options - 对话框选项
 * @returns Promise<boolean> - 用户是否选择同步
 */
export async function showRemoteSyncDialog(
  settings: StorageSettings,
  options: ShowRemoteSyncDialogOptions = {},
): Promise<boolean> {
  const { type: explicitType, showDetails: explicitShowDetails } = options

  const remoteSyncInfo = settings[StorageKey.SyncInfo]

  if (!remoteSyncInfo) {
    return false
  }

  // 计算配置复杂度和新鲜度
  const configComplexity = calculateConfigComplexity(settings)
  const backupAge = Date.now() - (remoteSyncInfo.lastSyncTime || remoteSyncInfo.lastCheckTime || 0)
  const daysSinceBackup = backupAge / (1000 * 60 * 60 * 24)

  // 根据场景自动决定对话框类型
  let dialogType: SyncDialogType = explicitType || 'confirm'
  let showDetails = explicitShowDetails ?? false

  if (!explicitType) {
    // 场景 1: 备份简单且新鲜（<7天，<10项）→ 温和提示
    if (configComplexity < 10 && daysSinceBackup < 7) {
      dialogType = 'gentle'
    }
    // 场景 2: 备份复杂（≥10项）或陈旧（≥30天）→ 需要用户确认
    else if (configComplexity >= 10 || daysSinceBackup >= 30) {
      dialogType = 'confirm'
      showDetails = true
    }
    // 场景 3: 只有基础配置（≤3项）→ 可以考虑自动同步（但在首次安装时仍需确认）
    else if (configComplexity <= 3 && daysSinceBackup < 7) {
      dialogType = 'gentle'
    }
  }

  return new Promise<boolean>((resolve) => {
    const lastSyncTime = formatTimestamp(
      remoteSyncInfo.lastSyncTime || remoteSyncInfo.lastCheckTime || 0,
      { format: 'YMDHM' },
    )

    // 构建消息内容
    let message = ''

    if (dialogType === 'gentle') {
      message = `
        <p class="v2p-sync-dialog-message">检测到您在其他设备上保存了插件配置备份</p>
        <p class="v2p-sync-dialog-message-sub">
          备份时间：<strong>${lastSyncTime}</strong>
          ${showDetails ? `<br>包含 <strong>${configComplexity}</strong> 项个性化设置` : ''}
        </p>
        <p class="v2p-sync-dialog-message-question">是否同步这些设置到当前设备？</p>
      `
    }
    else {
      // confirm 类型
      const ageText
        = daysSinceBackup < 1
          ? '今天'
          : daysSinceBackup < 7
            ? `${Math.floor(daysSinceBackup)} 天前`
            : `${Math.floor(daysSinceBackup / 7)} 周前`

      message = `
        <p class="v2p-sync-dialog-message">检测到远程插件配置备份（${ageText}创建）</p>
        ${showDetails
          ? `<p class="v2p-sync-dialog-message-sub">
          该备份包含 <strong>${configComplexity}</strong> 项设置，同步后将覆盖当前设备的插件默认配置
        </p>`
          : ''}
        <p class="v2p-sync-dialog-message-question">是否同步这些设置到当前设备？</p>
        <p class="v2p-sync-dialog-message-tip">
          你也可以稍后在插件设置中手动同步
        </p>
      `
    }

    const modal = createModal({
      root: $(document.body),
      title: 'V2EX Polish - 发现远程配置备份',
      footer: true,
      onMount: (elements: ModalElements) => {
        const { $main, $content, $footer, $actions } = elements

        $main.addClass('v2p-sync-dialog-main')

        // 添加消息内容
        $content.html(message)

        // 清空默认的操作区域
        $actions.empty()

        const $skipBtn = createButton({
          children: '稍后同步',
          className: 'v2p-sync-skip-btn',
        })
        $skipBtn.on('click', () => {
          modal.close()
          resolve(false)
        })

        const $syncBtn = createButton({
          children: '立即同步配置',
          className: 'v2p-sync-confirm-btn super',
        })
        $syncBtn.on('click', () => {
          modal.close()
          resolve(true)
        })

        // 添加按钮到页脚
        $footer.append($skipBtn, $syncBtn)
      },
      onClose: () => {
        // 用户关闭对话框时，视为拒绝同步
        resolve(false)
      },
    })

    // 打开模态框
    modal.open()
  })
}
