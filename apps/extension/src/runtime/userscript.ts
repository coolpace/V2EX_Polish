import { StorageKey } from '../constants'
import type { StorageItems } from '../types'
import type { Runtime, RuntimeStorage, StorageArea, StorageChangeMap } from './types'

const STORAGE_PREFIX = 'v2p:v1'

const STORAGE_AREA_KEYS: Record<StorageArea, Array<keyof StorageItems>> = {
  sync: [
    StorageKey.SyncInfo,
    StorageKey.Options,
    StorageKey.ReadingList,
  ],
  local: [
    StorageKey.API,
    StorageKey.Daily,
    StorageKey.MemberTag,
  ],
}

const STORAGE_AREA_ENTRIES = Object.entries(STORAGE_AREA_KEYS) as Array<
  [StorageArea, Array<keyof StorageItems>]
>

const AREA_BY_KEY = new Map<keyof StorageItems, StorageArea>(
  STORAGE_AREA_ENTRIES.flatMap(([area, keys]) =>
    keys.map((key) => [key, area] as const),
  ),
)

function storageKey(area: StorageArea, key: keyof StorageItems): string {
  return `${STORAGE_PREFIX}:${area}:${key}`
}

function parseStoredValue<T>(raw: unknown): T | undefined {
  if (raw === undefined || raw === null || raw === '') {
    return undefined
  }

  if (typeof raw !== 'string') {
    return raw as T
  }

  try {
    return JSON.parse(raw) as T
  }
  catch {
    console.warn('[V2EX Polish] GM 存储中的 JSON 无法解析，已忽略该值。')

    return undefined
  }
}

function readValue<T>(key: string): T | undefined {
  if (typeof GM_getValue !== 'function') {
    return undefined
  }

  return parseStoredValue<T>(GM_getValue<unknown>(key))
}

async function writeValue(key: string, value: unknown): Promise<void> {
  if (typeof GM_setValue !== 'function') {
    throw new Error('当前用户脚本管理器不支持 GM_setValue，无法保存设置')
  }

  await GM_setValue(key, JSON.stringify(value))
}

function deleteValue(key: string): void {
  if (typeof GM_deleteValue === 'function') {
    GM_deleteValue(key)
  }
}

const subscribers = new Set<
  (area: StorageArea, changes: StorageChangeMap) => void
>()

let unsubscribeGM: (() => void) | undefined

function emitStorageChanges(area: StorageArea, changes: StorageChangeMap): void {
  for (const subscriber of subscribers) {
    subscriber(area, changes)
  }
}

function ensureGMSubscription(): void {
  if (unsubscribeGM || typeof GM_addValueChangeListener !== 'function') {
    return
  }

  const listenerIds: number[] = []

  for (const [area, keys] of STORAGE_AREA_ENTRIES) {
    for (const key of keys) {
      const prefixedKey = storageKey(area, key)
      const listenerId = GM_addValueChangeListener<unknown>(
        prefixedKey,
        (_name, oldValue, newValue) => {
          window.__V2P_StorageCache = undefined
          emitStorageChanges(area, {
            [key]: {
              oldValue: parseStoredValue(oldValue),
              newValue: parseStoredValue(newValue),
            },
          })
        },
      )

      if (typeof listenerId === 'number') {
        listenerIds.push(listenerId)
      }
    }
  }

  unsubscribeGM = () => {
    if (typeof GM_removeValueChangeListener !== 'function') {
      return
    }

    for (const listenerId of listenerIds) {
      GM_removeValueChangeListener(listenerId)
    }
  }
}

const storage: RuntimeStorage = {
  get(area) {
    const items: StorageItems = {}

    for (const key of STORAGE_AREA_KEYS[area]) {
      const value = readValue<StorageItems[typeof key]>(storageKey(area, key))

      if (value !== undefined) {
        Object.assign(items, { [key]: value })
      }
    }

    return Promise.resolve(items)
  },

  async set(area, items) {
    const entries = Object.entries(items) as Array<[keyof StorageItems, unknown]>
    const changes: StorageChangeMap = {}

    for (const [key, value] of entries) {
      const expectedArea = AREA_BY_KEY.get(key)

      if (expectedArea !== undefined && expectedArea !== area) {
        throw new Error(`存储键 ${key} 不属于 ${area} 存储区`)
      }

      const prefixedKey = storageKey(area, key)
      const oldValue = readValue(prefixedKey)

      await writeValue(prefixedKey, value)
      changes[key] = { oldValue, newValue: value }
    }

    window.__V2P_StorageCache = undefined
    emitStorageChanges(area, changes)
  },

  remove(area, keys) {
    const changes: StorageChangeMap = {}

    for (const key of keys) {
      const prefixedKey = storageKey(area, key)
      const oldValue = readValue(prefixedKey)

      deleteValue(prefixedKey)
      changes[key] = { oldValue, newValue: undefined }
    }

    window.__V2P_StorageCache = undefined
    emitStorageChanges(area, changes)

    return Promise.resolve()
  },

  getBytesInUse(area, keys = STORAGE_AREA_KEYS[area]) {
    let bytes = 0

    for (const key of keys) {
      const value = readValue(storageKey(area, key))

      if (value !== undefined) {
        bytes += new TextEncoder().encode(JSON.stringify(value)).byteLength
      }
    }

    return Promise.resolve(bytes)
  },

  subscribe(listener) {
    subscribers.add(listener)
    ensureGMSubscription()

    return () => {
      subscribers.delete(listener)

      if (subscribers.size === 0) {
        unsubscribeGM?.()
        unsubscribeGM = undefined
      }
    }
  },
}

export const userscriptRuntime: Runtime = {
  kind: 'userscript',
  isBrowserExtension: false,
  storage,

  ui: {
    openOptions(section) {
      window.dispatchEvent(new CustomEvent('v2p:open-options', { detail: { section } }))
    },

    openControlCenter(tab) {
      window.dispatchEvent(new CustomEvent('v2p:open-control-center', { detail: { tab } }))
    },

    openUrl(url, options = {}) {
      if (options.newTab === false) {
        window.location.assign(url)
      }
      else {
        window.open(url, '_blank', options.active === false ? 'noopener,noreferrer' : undefined)
      }
    },
  },

  executeInPage<T>(expression: string): T {
    const pageWindow = typeof unsafeWindow === 'undefined' ? window : unsafeWindow
    const PageFunction = pageWindow.Function
    const execute = new PageFunction(`"use strict"; ${expression}`)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return execute() as T
  },

  registerMenuCommand(label, callback) {
    if (typeof GM_registerMenuCommand === 'function') {
      GM_registerMenuCommand(label, callback)
    }
  },
}
