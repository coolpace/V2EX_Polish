import { type StorageKey } from './constants'

export interface Options {
  [StorageKey.OptPAT]?: string
}

export interface StorageData {
  [StorageKey.Options]?: Options
}
