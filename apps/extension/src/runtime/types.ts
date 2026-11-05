import type { StorageItems } from '../types'

export type StorageArea = 'sync' | 'local'

export type StorageChangeMap = Partial<Record<keyof StorageItems, StorageChange>>

export interface StorageChange {
  oldValue?: unknown
  newValue?: unknown
}

export interface RuntimeStorage {
  get: (area: StorageArea) => Promise<StorageItems>
  set: (area: StorageArea, items: Partial<StorageItems>) => Promise<void>
  remove: (area: StorageArea, keys: Array<keyof StorageItems>) => Promise<void>
  getBytesInUse: (area: StorageArea, keys?: Array<keyof StorageItems>) => Promise<number>
  subscribe: (
    listener: (area: StorageArea, changes: StorageChangeMap) => void,
  ) => () => void
}

export interface RuntimeUi {
  openOptions: (section?: string) => void
  openControlCenter: (tab?: string) => void
  openUrl: (url: string, options?: { newTab?: boolean, active?: boolean }) => void
}

export interface Runtime {
  readonly kind: 'extension' | 'userscript'
  readonly isBrowserExtension: boolean
  readonly storage: RuntimeStorage
  readonly ui: RuntimeUi
  executeInPage: <T>(expression: string) => T | Promise<T>
  registerMenuCommand: (label: string, callback: () => void) => void
}
