import { isBrowserExtension } from '../utils/env'
import { extensionRuntime } from './extension'
import type { Runtime } from './types'
import { userscriptRuntime } from './userscript'

let runtime: Runtime | undefined

export function setRuntime(nextRuntime: Runtime): void {
  runtime = nextRuntime
}

export function getRuntime(): Runtime {
  runtime ??= isBrowserExtension() ? extensionRuntime : userscriptRuntime

  return runtime
}

export type {
  Runtime,
  RuntimeStorage,
  StorageArea,
  StorageChange,
  StorageChangeMap,
} from './types'
