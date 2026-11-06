import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createCheckInStateForMember } from '../apps/extension/src/background/check-in-scheduler'
import { StorageKey } from '../apps/extension/src/constants'
import type { StorageSettings } from '../apps/extension/src/types'

vi.mock('../apps/extension/src/utils', () => ({
  getStorage: vi.fn(),
  setStorage: vi.fn(),
}))

import { checkIn, observeCheckInMember } from '../apps/extension/src/background/daily-check-in'
import { getStorage, setStorage } from '../apps/extension/src/utils'

const now = Date.UTC(2026, 10, 5, 0, 10)

function mockDailyStorage(
  readDaily: () => StorageSettings[StorageKey.Daily],
  writeDaily: (value: StorageSettings[StorageKey.Daily]) => void,
): void {
  vi.mocked(getStorage).mockImplementation(async () => ({
    [StorageKey.Options]: { autoCheckIn: { enabled: true } },
    [StorageKey.Daily]: readDaily(),
  } as StorageSettings))
  vi.mocked(setStorage).mockImplementation(async (key, value) => {
    if (key === StorageKey.Daily) {
      writeDaily(value as StorageSettings[StorageKey.Daily])
    }
  })
}

function createSignInResponse(): Response {
  return new Response(
    '<a href="/signin?next=/mission/daily">登录</a>',
    { status: 200 },
  )
}

describe('签到状态并发', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('旧签到读取期间切换账号不会覆盖新账号状态', async () => {
    let dailyInfo: StorageSettings[StorageKey.Daily] = {
      schemaVersion: 3,
      memberName: 'alice',
      rewardDay: '2026-11-5',
      phase: 'scheduled',
      targetAt: now - 1000,
      nextActionAt: now - 1000,
    }
    let releaseFirstRead: (() => void) | undefined
    const firstReadStarted = Promise.withResolvers<void>()
    const firstReadGate = new Promise<void>((resolve) => {
      releaseFirstRead = resolve
    })
    let readCount = 0

    vi.mocked(getStorage).mockImplementation(async () => {
      const snapshot = dailyInfo
      readCount += 1

      if (readCount === 1) {
        firstReadStarted.resolve()
        await firstReadGate
      }

      return {
        [StorageKey.Options]: { autoCheckIn: { enabled: true } },
        [StorageKey.Daily]: snapshot,
      } as StorageSettings
    })
    vi.mocked(setStorage).mockImplementation(async (key, value) => {
      if (key === StorageKey.Daily) {
        dailyInfo = value as StorageSettings[StorageKey.Daily]
      }
    })
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => createSignInResponse()),
    )

    const checkInPromise = checkIn({ force: true, trigger: 'manual' })
    await firstReadStarted.promise
    const switchAccountPromise = observeCheckInMember('bob', now)

    await new Promise((resolve) => setTimeout(resolve, 0))
    releaseFirstRead?.()
    await Promise.all([checkInPromise, switchAccountPromise])

    expect(dailyInfo?.memberName).toBe('bob')
  })

  it('签到入口会在读取调度状态前确认页面账号', async () => {
    let dailyInfo: StorageSettings[StorageKey.Daily] = {
      schemaVersion: 2,
      lastCheckInTime: now - 1000,
    }

    mockDailyStorage(
      () => dailyInfo,
      (value) => {
        dailyInfo = value
      },
    )
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => createSignInResponse()),
    )

    await checkIn({ memberName: 'alice', force: true, trigger: 'manual' })

    expect(dailyInfo?.memberName).toBe('alice')
  })

  it('旧请求进行中仍会记录新账号并丢弃旧结果', async () => {
    let dailyInfo: StorageSettings[StorageKey.Daily] = createCheckInStateForMember(
      'alice',
      now,
      0,
    )
    const fetchStarted = Promise.withResolvers<void>()
    const fetchGate = Promise.withResolvers<void>()

    mockDailyStorage(
      () => dailyInfo,
      (value) => {
        dailyInfo = value
      },
    )
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        fetchStarted.resolve()
        await fetchGate.promise

        return createSignInResponse()
      }),
    )

    const oldCheckIn = checkIn({
      memberName: 'alice',
      force: true,
      trigger: 'manual',
    })
    await fetchStarted.promise

    await expect(
      checkIn({ memberName: 'bob', force: true, trigger: 'manual' }),
    ).resolves.toMatchObject({
      status: 'skipped',
      reason: '已有签到任务进行中',
    })
    fetchGate.resolve()
    await oldCheckIn

    expect(dailyInfo?.memberName).toBe('bob')
  })
})
