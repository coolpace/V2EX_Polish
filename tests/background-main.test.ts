import { beforeAll, describe, expect, it, vi } from 'vitest'

import { createCheckInStateForMember } from '../apps/extension/src/background/check-in-scheduler'

const control = vi.hoisted(() => ({
  daily: {
    schemaVersion: 2,
    lastCheckInTime: Date.UTC(2026, 10, 5, 0, 1),
    lastCheckInDay: '2026-11-5',
    checkInDays: 10,
  } as Record<string, unknown> | undefined,
  writes: 0,
  maxWrites: 20,
  alarmCreates: 0,
  autoCheckInEnabled: true,
  fetchCalls: 0,
  currentAlarm: undefined as
  | { name: string, scheduledTime: number, periodInMinutes?: number }
  | undefined,
  alarmListeners: [] as Array<(alarm: { name: string }) => void>,
  storageListeners: [] as Array<(changes: Record<string, unknown>, area: string) => void>,
}))

vi.mock('../apps/extension/src/utils', () => ({
  getStorage: vi.fn(async () => ({
    daily: control.daily,
    options: {
      autoCheckIn: { enabled: control.autoCheckInEnabled },
      contextMenu: { enabled: false },
    },
  })),
  setStorage: vi.fn(async (key: string, value: unknown) => {
    if (key !== 'daily') {
      return
    }

    control.writes += 1
    control.daily = value as Record<string, unknown>

    // 模拟 Chromium 对自身写入派发的 storage.onChanged。
    if (control.writes < control.maxWrites) {
      for (const listener of control.storageListeners) {
        listener({ daily: { newValue: value } }, 'local')
      }
    }
  }),
  getRunEnv: vi.fn(() => 'chrome'),
}))

function createEvent() {
  return {
    addListener: vi.fn(),
    removeListener: vi.fn(),
    hasListener: vi.fn(() => false),
  }
}

function settleBackgroundTasks() {
  return new Promise((resolve) => setTimeout(resolve, 20))
}

describe('background daily state reconciliation', () => {
  beforeAll(async () => {
    const storageChanged = createEvent()
    storageChanged.addListener.mockImplementation((listener) => {
      control.storageListeners.push(listener)
    })
    const alarmChanged = createEvent()
    alarmChanged.addListener.mockImplementation((listener) => {
      control.alarmListeners.push(listener)
    })

    vi.stubGlobal('addEventListener', vi.fn())
    vi.stubGlobal('fetch', vi.fn(async () => {
      control.fetchCalls += 1
      throw new Error('unexpected fetch')
    }))
    vi.stubGlobal('chrome', {
      runtime: {
        id: 'test-extension',
        getURL: (path: string) => `chrome-extension://test-extension/${path}`,
        onInstalled: createEvent(),
        onMessage: createEvent(),
        onStartup: createEvent(),
      },
      contextMenus: {
        removeAll: vi.fn((callback: () => void) => callback()),
        create: vi.fn(),
        remove: vi.fn(),
        onClicked: createEvent(),
      },
      tabs: {
        onUpdated: createEvent(),
        create: vi.fn(),
      },
      alarms: {
        clear: vi.fn(async (name: string) => {
          if (control.currentAlarm?.name === name) {
            control.currentAlarm = undefined
          }

          return true
        }),
        get: vi.fn(async (name: string) =>
          control.currentAlarm?.name === name ? control.currentAlarm : undefined,
        ),
        create: vi.fn(async (name: string, info: { when?: number, periodInMinutes?: number }) => {
          control.alarmCreates += 1
          control.currentAlarm = {
            name,
            scheduledTime: info.when ?? Date.now(),
            periodInMinutes: info.periodInMinutes,
          }
        }),
        onAlarm: alarmChanged,
      },
      storage: {
        onChanged: storageChanged,
      },
    })

    await import('../apps/extension/src/background/main')
    await settleBackgroundTasks()
  })

  it('旧版 daily 状态迁移后不会由自身 storage 事件持续写回', async () => {
    expect(control.writes).toBe(1)

    const writesAfterStartup = control.writes

    for (const listener of control.storageListeners) {
      for (let index = 0; index < 250; index += 1) {
        listener({ daily: { newValue: control.daily } }, 'local')
        listener({ options: { newValue: {} } }, 'sync')
      }
    }

    await settleBackgroundTasks()

    expect(control.writes).toBe(writesAfterStartup)
    expect(control.alarmCreates).toBe(0)
  })

  it('旧版残留 alarm 在账号身份未确认时不会发起网络请求', async () => {
    const writesBeforeAlarm = control.writes

    for (const listener of control.alarmListeners) {
      listener({ name: 'dailyCheckInV2' })
    }

    await settleBackgroundTasks()

    expect(control.fetchCalls).toBe(0)
    expect(control.writes).toBe(writesBeforeAlarm)
  })

  it('重复 storage 事件风暴只创建一个 alarm', async () => {
    control.daily = createCheckInStateForMember('alice', Date.now(), 60_000) as
      Record<string, unknown>

    const alarmCreatesBeforeStorm = control.alarmCreates
    const writesBeforeStorm = control.writes

    for (const listener of control.storageListeners) {
      for (let index = 0; index < 500; index += 1) {
        listener({ daily: { newValue: control.daily } }, 'local')
      }
    }

    await settleBackgroundTasks()

    expect(control.writes).toBe(writesBeforeStorm)
    expect(control.alarmCreates).toBe(alarmCreatesBeforeStorm + 1)
  })

  it('关闭自动签到后迁移旧状态仍只写入一次', async () => {
    control.autoCheckInEnabled = false
    control.daily = {
      schemaVersion: 2,
      lastCheckInTime: Date.UTC(2026, 10, 5, 0, 1),
    }

    const writesBeforeMigration = control.writes

    for (const listener of control.storageListeners) {
      listener({ daily: { newValue: control.daily } }, 'local')
    }

    await settleBackgroundTasks()

    expect(control.writes).toBe(writesBeforeMigration + 1)
  })
})
