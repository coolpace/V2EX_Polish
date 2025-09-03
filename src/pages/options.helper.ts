import { StorageKey } from '../constants'
import {
  deepMerge,
  formatTimestamp,
  getStorage,
  getV2P_Settings,
  setStorage,
  setV2P_Settings,
} from '../utils'
import { defaultValue } from './popup.var'

async function loadSettings() {
  const storage = await getStorage()
  const api = storage[StorageKey.API]

  const $patInput = $('#pat')

  $patInput.on('change', (ev) => {
    const value = (ev.target as HTMLInputElement).value

    if (value) {
      $patInput.addClass('has-value')
    }
    else {
      $patInput.removeClass('has-value')
    }
  })

  if (api) {
    if (api.pat) {
      $patInput.val(api.pat).addClass('has-value')
    }
    else {
      $('.details').prop('open', true)
    }

    $('#limit').val(api.limit ?? defaultValue)
    $('#reset').val(api.reset ? formatTimestamp(api.reset, { format: 'YMDHMS' }) : defaultValue)
    $('#remaining').val(api.remaining ?? defaultValue)
  }

  $('#token-form').on('submit', (ev) => {
    ev.preventDefault() // 阻止默认的表单提交行为

    const PAT = $patInput.val()

    if (typeof PAT === 'string') {
      void setStorage(StorageKey.API, { pat: PAT }).then(() => {
        const $submitBtn = $('.submit-btn')
        const submitText = $submitBtn.text()

        $submitBtn.text('保存成功').prop('disabled', true)

        setTimeout(() => {
          $submitBtn.text(submitText).prop('disabled', false)
        }, 1500)
      })
    }
  })
}

export async function handleTokenForm() {
  await loadSettings()
}

export async function handleBackupForm() {
  const storage = await getStorage()

  const $localVersion = $('#local-version')
  const $remoteVersion = $('#remote-version')
  const $syncTime = $('#last-sync-time')
  const $checkTime = $('#last-check-time')

  const syncInfo = storage[StorageKey.SyncInfo]
  $localVersion.val(syncInfo?.version ?? defaultValue)

  if (syncInfo?.lastCheckTime) {
    $checkTime.val(formatTimestamp(syncInfo.lastCheckTime, { format: 'YMDHMS' }))
  }

  void getV2P_Settings().then((res) => {
    const settings = res?.config
    const remoteSyncInfo = settings?.[StorageKey.SyncInfo]

    const version = remoteSyncInfo?.version
    const lastSyncTime = remoteSyncInfo?.lastSyncTime

    $remoteVersion.val(version ?? defaultValue)
    $syncTime.val(lastSyncTime ? formatTimestamp(lastSyncTime, { format: 'YMDHMS' }) : defaultValue)

    const $syncBtn = $('#sync-settings')

    const backupAvailable = syncInfo && remoteSyncInfo && syncInfo.version >= remoteSyncInfo.version

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
                await new Promise((resolve) =>
                  setTimeout(() => {
                    resolve(undefined)
                  }, 1000),
                )
                const storage = await getStorage(false)
                await chrome.storage.sync.set(deepMerge(storage, settings))
                await getStorage(false)

                void loadSettings() // 同步配置后重新加载以应用最新配置。
              }
              finally {
                $syncBtn.text(txt).css('pointer-events', 'auto')
              }
            })()
          })
      }
    }
  })
}
