import { afterEach, describe, expect, it, vi } from 'vitest'

import { defaultOptions, StorageKey } from '../apps/extension/src/constants'
import type { DailyInfo } from '../apps/extension/src/types'
import { getStorage, setStorage } from '../apps/extension/src/utils/storage'

describe('签到状态存储', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('本地状态优先于旧的 sync 记录', async () => {
    const legacy: DailyInfo = {
      lastAttemptTime: 1,
      lastResult: 'failed',
      lastErrorCode: 'network',
    }
    const current: DailyInfo = {
      schemaVersion: 2,
      rewardDay: '2026-11-5',
      phase: 'scheduled',
      nextActionAt: 2,
    }

    vi.stubGlobal('chrome', {
      extension: {},
      storage: {
        sync: {
          get: vi.fn().mockResolvedValue({
            [StorageKey.Options]: defaultOptions,
            [StorageKey.Daily]: legacy,
          }),
        },
        local: {
          get: vi.fn().mockResolvedValue({
            [StorageKey.MemberTag]: {},
            [StorageKey.Daily]: current,
          }),
        },
      },
    })

    const storage = await getStorage(false)

    expect(storage[StorageKey.Daily]).toEqual(current)
  })

  it('新的签到状态写入 local 而不是 sync', async () => {
    const daily: DailyInfo = {
      schemaVersion: 2,
      rewardDay: '2026-11-5',
      phase: 'scheduled',
      nextActionAt: 2,
    }
    const localSet = vi.fn().mockResolvedValue(undefined)
    const syncSet = vi.fn().mockResolvedValue(undefined)

    vi.stubGlobal('chrome', {
      extension: {},
      storage: {
        sync: { set: syncSet },
        local: { set: localSet },
      },
    })

    await setStorage(StorageKey.Daily, daily)

    expect(localSet).toHaveBeenCalledWith({ [StorageKey.Daily]: daily })
    expect(syncSet).not.toHaveBeenCalled()
  })
})
