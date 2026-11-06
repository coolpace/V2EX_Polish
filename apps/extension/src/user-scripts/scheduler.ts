import { checkIn } from '../background/daily-check-in'
import { StorageKey } from '../constants'
import { getCurrentMemberName } from '../contents/member-name'
import { getRuntime } from '../runtime'
import type { CheckInResult, CheckInTrigger } from '../types'
import { getStorage } from '../utils'

const CHECK_INTERVAL_MS = 60 * 1000
const LOCK_NAME = 'v2p-userscript-check-in'
const LEASE_KEY = '__v2p_userscript_check_in_lease'
const LEASE_MS = 2 * 60 * 1000

let intervalId: ReturnType<typeof setInterval> | undefined
let running = false

interface CheckInLease {
  owner?: string
  expiresAt?: number
}

function isAuthPage(): boolean {
  return ['/signin', '/signup', '/forgot', '/2fa'].some((path) =>
    window.location.pathname.startsWith(path),
  )
}

function readLease(): CheckInLease | undefined {
  try {
    const lease = JSON.parse(localStorage.getItem(LEASE_KEY) ?? 'null') as
      | CheckInLease
      | null

    return lease ?? undefined
  }
  catch {
    return undefined
  }
}

function acquireLease(owner: string, now: number): boolean {
  const current = readLease()

  if (current?.expiresAt && current.expiresAt > now) {
    return false
  }

  localStorage.setItem(LEASE_KEY, JSON.stringify({
    owner,
    expiresAt: now + LEASE_MS,
  }))

  return true
}

function releaseLease(owner: string): void {
  if (readLease()?.owner === owner) {
    localStorage.removeItem(LEASE_KEY)
  }
}

async function withLeaseLock<T>(callback: () => Promise<T>): Promise<T | undefined> {
  const owner = crypto.randomUUID()

  if (!acquireLease(owner, Date.now())) {
    return undefined
  }

  try {
    return await callback()
  }
  finally {
    releaseLease(owner)
  }
}

async function withCrossTabLock<T>(callback: () => Promise<T>): Promise<T | undefined> {
  const locks = navigator.locks

  if (!locks?.request) {
    return withLeaseLock(callback)
  }

  let result: T | undefined

  await locks.request(LOCK_NAME, { ifAvailable: true }, async (lock) => {
    if (!lock) {
      return
    }

    result = await callback()
  })

  return result
}

export async function runPageCheckIn(options: {
  force?: boolean
  trigger?: CheckInTrigger
  memberName?: string
} = {}): Promise<CheckInResult | undefined> {
  if (running) {
    return { status: 'skipped', reason: '已有页面签到任务进行中' }
  }

  running = true

  try {
    return await withCrossTabLock(async () => {
      const memberName = options.memberName ?? getCurrentMemberName()

      return checkIn({
        force: options.force,
        trigger: options.trigger ?? 'manual',
        memberName,
      })
    })
  }
  finally {
    running = false
  }
}

function handleOnline(): void {
  void runPageCheckIn({
    trigger: 'online',
    memberName: getCurrentMemberName(),
  })
}

async function runScheduledCheckIn(trigger: 'tab' | 'refresh'): Promise<void> {
  if (isAuthPage()) {
    return
  }

  const storage = await getStorage(false)

  if (!storage[StorageKey.Options].autoCheckIn.enabled) {
    return
  }

  await runPageCheckIn({
    trigger,
    memberName: getCurrentMemberName(),
  })
}

export function startUserscriptScheduler(): void {
  if (
    getRuntime().kind !== 'userscript'
    || window.top !== window
    || intervalId !== undefined
    || isAuthPage()
  ) {
    return
  }

  const tick = (trigger: 'tab' | 'refresh' = 'refresh') => {
    void runScheduledCheckIn(trigger).catch((error: unknown) => {
      console.warn('[V2EX Polish] 油猴签到调度失败：', error)
    })
  }

  tick('tab')
  intervalId = setInterval(tick, CHECK_INTERVAL_MS)
  window.addEventListener('online', handleOnline)
}

export function stopUserscriptScheduler(): void {
  if (intervalId !== undefined) {
    clearInterval(intervalId)
    intervalId = undefined
  }

  window.removeEventListener('online', handleOnline)
}
