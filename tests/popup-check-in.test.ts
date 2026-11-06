import { describe, expect, it, vi } from 'vitest'

import { StorageKey } from '../apps/extension/src/constants'
import { watchCheckInStatus } from '../apps/extension/src/pages/popup.check-in'
import type { StorageChangeMap } from '../apps/extension/src/runtime'

type StorageListener = (
  areaName: 'sync' | 'local',
  changes: StorageChangeMap,
) => void

function setupWatcher(visible: boolean) {
  let emit: StorageListener | undefined
  const refresh = vi.fn()

  const stop = watchCheckInStatus({
    subscribe(listener) {
      emit = listener

      return () => {}
    },
    isVisible: () => visible,
    refresh,
  })

  return {
    emit(areaName: 'sync' | 'local', changes: StorageChangeMap) {
      emit?.(areaName, changes)
    },
    refresh,
    stop,
  }
}

describe('popup check-in status subscription', () => {
  it('Feature 激活时响应今日签到成功和失败状态', () => {
    const watcher = setupWatcher(true)

    watcher.emit('local', {
      [StorageKey.Daily]: {
        newValue: { schemaVersion: 3, memberName: 'alice', phase: 'succeeded' },
      },
    })
    watcher.emit('local', {
      [StorageKey.Daily]: {
        newValue: {
          schemaVersion: 3,
          memberName: 'alice',
          phase: 'scheduled',
          lastResult: 'failed',
        },
      },
    })
    watcher.emit('sync', {
      [StorageKey.Options]: {
        newValue: { autoCheckIn: { enabled: false } },
      },
    })

    expect(watcher.refresh).toHaveBeenCalledTimes(3)
    watcher.stop()
  })

  it('Feature 未激活或无关配置变化时不重绘', () => {
    const inactiveWatcher = setupWatcher(false)
    const activeWatcher = setupWatcher(true)
    const dailyChange = {
      [StorageKey.Daily]: { newValue: { schemaVersion: 3, memberName: 'alice' } },
    }

    inactiveWatcher.emit('local', dailyChange)
    activeWatcher.emit('local', {
      [StorageKey.ReadingList]: { newValue: { data: [] } },
    })
    activeWatcher.emit('sync', {
      [StorageKey.SyncInfo]: { newValue: {} },
    })

    expect(inactiveWatcher.refresh).not.toHaveBeenCalled()
    expect(activeWatcher.refresh).not.toHaveBeenCalled()

    inactiveWatcher.stop()
    activeWatcher.stop()
  })
})
