import { beforeEach, describe, expect, it, vi } from 'vitest'

import { StorageKey } from '../apps/extension/src/constants'

vi.mock('../apps/extension/src/utils', () => ({
  getStorage: vi.fn(),
  setStorage: vi.fn(),
}))

import { observeCheckInMember } from '../apps/extension/src/background/daily-check-in'
import type { StorageSettings } from '../apps/extension/src/types'
import { getStorage, setStorage } from '../apps/extension/src/utils'

const now = Date.UTC(2026, 10, 5, 0, 10)

describe('observeCheckInMember', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('账号切换时清除旧账号的签到状态', async () => {
    vi.mocked(getStorage).mockResolvedValue({
      [StorageKey.Options]: { autoCheckIn: { enabled: true } },
      [StorageKey.Daily]: {
        schemaVersion: 3,
        memberName: 'alice',
        lastCheckInTime: now - 1000,
        lastCheckInDay: '2026-11-5',
        checkInDays: 10,
        phase: 'succeeded',
      },
    } as StorageSettings)

    await expect(observeCheckInMember('bob', now)).resolves.toBe(true)

    expect(setStorage).toHaveBeenCalledWith(
      StorageKey.Daily,
      expect.objectContaining({
        schemaVersion: 3,
        memberName: 'bob',
        rewardDay: '2026-11-5',
        phase: 'scheduled',
      }),
    )

    const nextState = vi.mocked(setStorage).mock.calls[0]?.[1]

    expect(nextState?.lastCheckInTime).toBeUndefined()
    expect(nextState?.lastCheckInDay).toBeUndefined()
    expect(nextState?.checkInDays).toBeUndefined()
  })

  it('同一账号不会重置现有状态', async () => {
    vi.mocked(getStorage).mockResolvedValue({
      [StorageKey.Options]: { autoCheckIn: { enabled: true } },
      [StorageKey.Daily]: {
        schemaVersion: 3,
        memberName: 'alice',
        phase: 'succeeded',
        lastCheckInTime: now - 1000,
      },
    } as StorageSettings)

    await expect(observeCheckInMember('alice', now)).resolves.toBe(false)
    expect(setStorage).not.toHaveBeenCalled()
  })

  it('旧版无账号状态会被替换为待确认的当前账号状态', async () => {
    vi.mocked(getStorage).mockResolvedValue({
      [StorageKey.Options]: { autoCheckIn: { enabled: true } },
      [StorageKey.Daily]: {
        schemaVersion: 2,
        lastCheckInTime: now - 1000,
        lastCheckInDay: '2026-11-5',
      },
    } as StorageSettings)

    await observeCheckInMember('alice', now)

    expect(setStorage).toHaveBeenCalledWith(
      StorageKey.Daily,
      expect.objectContaining({
        schemaVersion: 3,
        memberName: 'alice',
        phase: 'scheduled',
      }),
    )
  })

  it('空身份不会覆盖已有账号状态', async () => {
    await expect(observeCheckInMember('   ', now)).resolves.toBe(false)
    expect(getStorage).not.toHaveBeenCalled()
    expect(setStorage).not.toHaveBeenCalled()
  })

  it('并发确认同一账号时只迁移一次签到状态', async () => {
    let dailyInfo: StorageSettings[StorageKey.Daily]

    vi.mocked(getStorage).mockImplementation(async () => ({
      [StorageKey.Options]: { autoCheckIn: { enabled: true } },
      [StorageKey.Daily]: dailyInfo,
    } as StorageSettings))
    vi.mocked(setStorage).mockImplementation(async (key, value) => {
      if (key === StorageKey.Daily) {
        dailyInfo = value as StorageSettings[StorageKey.Daily]
      }
    })

    await Promise.all([
      observeCheckInMember('alice', now),
      observeCheckInMember('alice', now),
    ])

    expect(setStorage).toHaveBeenCalledTimes(1)
    expect(dailyInfo?.memberName).toBe('alice')
  })
})
