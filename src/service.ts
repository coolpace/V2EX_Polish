import { StorageKey, V2EX } from './constants'
import type { API, DataWrapper, LegacyAPI, Member, StorageData, Topic } from './types'

async function legacyRequest<Data>(url: string, options?: RequestInit): Promise<Data> {
  const res = await fetch(url, options)

  const limit = res.headers.get('X-Rate-Limit-Limit')
  const reset = res.headers.get('X-Rate-Limit-Reset')
  const remaining = res.headers.get('X-Rate-Limit-Remaining')

  const api: LegacyAPI = {
    limit: limit ? Number(limit) : undefined,
    reset: reset ? Number(reset) : undefined,
    remaining: remaining ? Number(remaining) : undefined,
  }
  await chrome.storage.sync.set({ [StorageKey.LegacyAPI]: api })

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res.json()
}

export function fetchUserInfo(memberName: Member['username'], options?: RequestInit) {
  return legacyRequest<Member>(`${V2EX.API}/members/show.json?username=${memberName}`, options)
}

async function request<Data>(url: string, options?: RequestInit): Promise<DataWrapper<Data>> {
  const res = await fetch(url, options)

  const limit = res.headers.get('X-Rate-Limit-Limit')
  const reset = res.headers.get('X-Rate-Limit-Reset')
  const remaining = res.headers.get('X-Rate-Limit-Remaining')

  chrome.storage.sync.get(StorageKey.API, (result: StorageData) => {
    const api: API = {
      pat: result[StorageKey.API]?.pat,
      limit: limit ? Number(limit) : undefined,
      reset: reset ? Number(reset) : undefined,
      remaining: remaining ? Number(remaining) : undefined,
    }
    void chrome.storage.sync.set({ [StorageKey.API]: api })
  })

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res.json()
}

export function fetchTopic(topicId: string, PAT: string) {
  return request<Topic>(`${V2EX.APIV2}/topics/${topicId}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${PAT}` },
  })
}
