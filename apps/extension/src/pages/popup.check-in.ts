import { StorageKey } from '../constants'
import type { RuntimeStorage, StorageChangeMap } from '../runtime'

interface CheckInStatusWatchOptions {
  subscribe: RuntimeStorage['subscribe']
  isVisible: () => boolean
  refresh: () => void
}

/** 判断存储变化是否可能影响签到卡片。 */
function isCheckInStatusChange(
  areaName: 'sync' | 'local',
  changes: StorageChangeMap,
): boolean {
  if (areaName === 'local') {
    return Object.hasOwn(changes, StorageKey.Daily)
  }

  return Object.hasOwn(changes, StorageKey.Options)
}

/**
 * 在 popup 打开期间跟随后台持久化的签到状态。
 *
 * 签到可能由页面、定时任务或另一个上下文发起。popup 自己的请求被并发任务
 * 跳过时，仍需通过 storage 事件接收该任务最终写入的成功或失败状态。
 */
export function watchCheckInStatus(options: CheckInStatusWatchOptions): () => void {
  return options.subscribe((areaName, changes) => {
    if (options.isVisible() && isCheckInStatusChange(areaName, changes)) {
      options.refresh()
    }
  })
}
