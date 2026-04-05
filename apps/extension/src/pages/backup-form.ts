import { StorageKey } from '../constants'
import type { SettingsSyncInfo } from '../types'
import {
  applyRemoteSettings,
  formatTimestamp,
  getStorage,
  getV2P_Settings,
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
}
