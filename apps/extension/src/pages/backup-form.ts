import { StorageKey } from '../constants'
import type { SettingsSyncInfo } from '../types'
import {
  applyRemoteSettings,
  formatTimestamp,
  getStorage,
  getV2P_Settings,
  isValidSettings,
  prepareBackupData,
  setV2P_Settings,
} from '../utils'
import { defaultValue } from './popup.var'

interface BackupFormParams {
  syncInfo: SettingsSyncInfo | undefined
  onSyncComplete: () => void | Promise<void>
}

/**
 * 初始化备份表单的 UI 和交互逻辑。
 *
 * 被 popup 和 options 页面共同使用，避免重复代码。
 */
export function initBackupForm({ syncInfo, onSyncComplete }: BackupFormParams): void {
  const $localVersion = $('#local-version')
  const $remoteVersion = $('#remote-version')
  const $syncTime = $('#last-sync-time')
  const $checkTime = $('#last-check-time')

  $localVersion.val(syncInfo?.version ?? defaultValue)

  if (syncInfo?.lastCheckTime) {
    $checkTime.val(formatTimestamp(syncInfo.lastCheckTime, { format: 'YMDHMS' }))
  }

  void getV2P_Settings()
    .then((res) => {
      const settings = res?.config
      const remoteSyncInfo = settings?.[StorageKey.SyncInfo]

      const version = remoteSyncInfo?.version
      const lastSyncTime = remoteSyncInfo?.lastSyncTime

      $remoteVersion.val(version ?? defaultValue)
      $syncTime.val(
        lastSyncTime ? formatTimestamp(lastSyncTime, { format: 'YMDHMS' }) : defaultValue,
      )

      const $syncBtn = $('#sync-settings')

      const backupAvailable
        = syncInfo && remoteSyncInfo && syncInfo.version >= remoteSyncInfo.version

      if (!remoteSyncInfo || backupAvailable) {
        if (!remoteSyncInfo) {
          $('.storage-tip').text('未发现远程存储的配置')
        }

        if (backupAvailable) {
          $('.storage-tip').text('你可以将目前使用的配置备份到远程')
        }

        $syncBtn
          .text('开始备份')
          .prop('disabled', false)
          .on('click', () => {
            void (async () => {
              const txt = $syncBtn.text()

              try {
                $syncBtn.text('备份中...').css('pointer-events', 'none')
                const storage = await getStorage(false)
                const newSyncInfo = await setV2P_Settings(storage)
                $localVersion.val(newSyncInfo.version)
                $remoteVersion.val(newSyncInfo.version)
                $syncTime.val(formatTimestamp(newSyncInfo.lastSyncTime, { format: 'YMDHMS' }))
                $('.storage-tip').text('备份成功')
              }
              catch (err) {
                console.error('[V2EX Polish] 备份失败：', err)
                $('.storage-tip').text('备份失败，请检查网络或登录状态')
              }
              finally {
                $syncBtn.text(txt).css('pointer-events', 'auto')
              }
            })()
          })
      }
      else {
        if (!syncInfo || syncInfo.version < remoteSyncInfo.version) {
          $('.storage-tip').text('远程备份的版本较新')
          $syncBtn
            .text('同步至本地')
            .prop('disabled', false)
            .on('click', () => {
              void (async () => {
                const txt = $syncBtn.text()

                try {
                  $syncBtn.text('同步中...').css('pointer-events', 'none')
                  await applyRemoteSettings(settings)
                  await getStorage(false)
                  await onSyncComplete()
                }
                finally {
                  $syncBtn.text(txt).css('pointer-events', 'auto')
                }
              })()
            })
        }
      }
    })
    .catch(() => {
      $('.storage-tip').text('无法获取远程备份，请检查网络或登录状态')
      $('#sync-settings').text('重试').prop('disabled', true)
    })

  bindImportExportButtons()
}

function bindImportExportButtons(): void {
  $('#export-file').on('click', () => {
    void exportToFile()
  })

  $('#import-file').on('click', () => {
    $('#import-file-input').trigger('click')
  })

  $('#import-file-input').on('change', (ev) => {
    const file = (ev.target as HTMLInputElement).files?.[0]
    if (file) {
      void importFromFile(file)
    }
    // 重置 input，允许重复选择同一个文件
    ;(ev.target as HTMLInputElement).value = ''
  })
}

async function exportToFile(): Promise<void> {
  const $btn = $('#export-file')
  const txt = $btn.text()

  try {
    $btn.text('导出中...').prop('disabled', true)
    const storage = await getStorage(false)
    const backupData = prepareBackupData(storage)
    const json = JSON.stringify(backupData, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const date = new Date().toISOString().slice(0, 10)
    const a = document.createElement('a')
    a.href = url
    a.download = `v2ex-polish-backup-${date}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    $('.storage-tip').text('配置已导出')
  }
  catch (err) {
    console.error('[V2EX Polish] 导出失败：', err)
    $('.storage-tip').text('导出失败')
  }
  finally {
    $btn.text(txt).prop('disabled', false)
  }
}

async function importFromFile(file: File): Promise<void> {
  const $btn = $('#import-file')
  const txt = $btn.text()

  try {
    $btn.text('导入中...').prop('disabled', true)

    const text = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error('文件读取失败'))
      reader.readAsText(file)
    })

    let data: unknown
    try {
      data = JSON.parse(text)
    }
    catch {
      $('.storage-tip').text('文件格式错误，无法解析 JSON')
      return
    }

    if (!isValidSettings(data)) {
      $('.storage-tip').text('无效的配置文件格式')
      return
    }

    await applyRemoteSettings(data)
    const storage = await getStorage(false)
    const syncInfo = storage[StorageKey.SyncInfo]

    $('#local-version').val(syncInfo?.version ?? defaultValue)
    $('#remote-version').val(syncInfo?.version ?? defaultValue)

    if (syncInfo?.lastSyncTime) {
      $('#last-sync-time').val(formatTimestamp(syncInfo.lastSyncTime, { format: 'YMDHMS' }))
    }

    $('.storage-tip').text('导入成功')
  }
  catch (err) {
    console.error('[V2EX Polish] 导入失败：', err)
    $('.storage-tip').text('导入失败，请检查文件内容')
  }
  finally {
    $btn.text(txt).prop('disabled', false)
  }
}
