import { StorageKey, V2EX } from './constants'
import type { API, DataWrapper, LegacyAPI, Member, Notification, StorageData, Topic } from './types'

/**
 * V2EX API v1
 *
 * 相关的接口文档参考：https://www.v2ex.com/p/7v9TEc53
 */
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
  return legacyRequest<Member>(
    `${V2EX.LegacyAPI}/members/show.json?username=${memberName}`,
    options
  )
}

export function fetchLatestTopics(options?: RequestInit) {
  // return Promise.resolve(mockTopics)
  return legacyRequest<Topic[]>(`${V2EX.LegacyAPI}/topics/latest.json`, options)
}

export function fetchHotTopics(options?: RequestInit) {
  // return Promise.resolve(mockTopics)
  return legacyRequest<Topic[]>(`${V2EX.LegacyAPI}/topics/hot.json`, options)
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

export function fetchProfile(PAT: string) {
  return request<Member>(`${V2EX.API}/member`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${PAT}` },
  })
}

export function fetchTopic(topicId: string, PAT: string) {
  return request<Topic>(`${V2EX.API}/topics/${topicId}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${PAT}` },
  })
}

export function fetchNotifications(PAT: string, page = 1) {
  return request<Notification[]>(`${V2EX.API}/notifications?p=${page}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${PAT}` },
  })
}

export function deleteNotification(PAT: string, notification_id: string) {
  return request(`${V2EX.API}/notifications/${notification_id}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${PAT}` },
  })
}
