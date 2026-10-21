import { EXTENSION_NAME, StorageKey } from '../constants'
import type { ReadingItem, SettingsSyncInfo, StorageItems, StorageSettings } from '../types'
import { V2EX_ORIGIN } from './env'
import { deepMerge } from './object'

export const settingsMark = `${EXTENSION_NAME}_settings`

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
    [StorageKey.API]: _api,
    [StorageKey.Daily]: _daily,
    ...backupData
  } = storage

  return backupData
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
    [StorageKey.MemberTag]: _mt,
    [StorageKey.API]: _api,
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

      if ($dom.text().startsWith(settingsMark)) {
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
        const syncSettings = JSON.parse(value.replace(settingsMark, '')) as unknown

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
