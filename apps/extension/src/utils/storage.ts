import { defaultOptions, EXTENSION_NAME, StorageKey } from '../constants'
import type { SettingsSyncInfo, StorageItems, StorageSettings } from '../types'
import { isBrowserExtension, V2EX_ORIGIN } from './env'
import { deepMerge } from './object'
import { getV2P_Settings, prepareBackupData, settingsMark } from './remote-backup'

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
    settingsMark + JSON.stringify({ ...backupData, [StorageKey.SyncInfo]: syncInfo }),
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
            const mergedOptions = deepMerge(defaultOptions, options)

            // TODO: 临时迁移逻辑，用于兼容旧版 `openInNewTab` 字段。
            // 当旧数据中存在 openInNewTab === true 且新字段 topic 尚未写入时，
            // 自动将 topic.openMode 迁移为 'newTab'，避免用户设置静默丢失。
            // 待大多数用户升级后（建议下一个大版本发布时）可安全删除此块。
            const legacyOptions = options as unknown as Record<string, unknown>

            if (legacyOptions['openInNewTab'] === true && !legacyOptions['topic']) {
              mergedOptions.topic = { openMode: 'newTab' }
            }

            data = { ...mergedItems, [StorageKey.Options]: mergedOptions }
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

    const timeoutId = setTimeout(() => {
      if (controller) {
        controller.abort()
      }
    }, 15000)

    void getStorage(false)
      .then((settings) => setV2P_Settings(settings, signal))
      .catch((err) => {
        clearTimeout(timeoutId)

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
        throw new Error(`❌ 无法设置：${storageKey}`, { cause: err })
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
        throw new Error(`❌ 无法设置：${storageKey}`, { cause: err })
      }

      break

    default:
      throw new Error(`未知的 storageKey： ${storageKey}`)
  }
}
