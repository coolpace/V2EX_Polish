import { createButton } from '../components/button'
import { createModal, type ModalElements } from '../components/modal'
import { StorageKey } from '../constants'
import type { StorageSettings } from '../types'
import { formatTimestamp } from './date'

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
        modal.destroy()
      },
    })

    // 打开模态框
    modal.open()
  })
}
