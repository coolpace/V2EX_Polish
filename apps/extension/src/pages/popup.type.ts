import type { Topic } from '../types'
import type { TabId } from './popup.var'

interface CommonTabStore {
  lastScrollTop?: number
}

export interface RemoteDataStore extends CommonTabStore {
  data?: Topic[]
  lastFetchTime?: number
}

export interface PopupStorageData {
  lastActiveTab: TabId
  [TabId.Hot]: RemoteDataStore
  [TabId.Latest]: RemoteDataStore
  [TabId.Setting]: CommonTabStore
}
