import { EXTENSION_NAME, imgurClientIdPool, StorageKey, V2EX } from './constants'
import type {
  API_Info,
  DataWrapper,
  ImgurResponse,
  Member,
  Notification,
  StorageData,
  Topic,
  TopicReply,
} from './types'
import { getPAT, isValidConfig } from './utils'

// 动态获取 V2EX 的域名，防止跨域。
const V2EX_ORIGIN = window.location.origin.includes('v2ex.com')
  ? window.location.origin
  : V2EX.Origin

const V2EX_LEGACY_API = `${V2EX_ORIGIN}/api`
const V2EX_API = `${V2EX_ORIGIN}/api/v2`

/**
 * V2EX API v1
 *
 * 相关的接口文档参考：https://www.v2ex.com/p/7v9TEc53
 */
async function legacyRequest<Data>(url: string, options?: RequestInit): Promise<Data> {
  const res = await fetch(url, options)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res.json()
}

export function fetchUserInfo(memberName: Member['username'], options?: RequestInit) {
  return legacyRequest<Member>(
    `${V2EX_LEGACY_API}/members/show.json?username=${memberName}`,
    options
  )
}

export function fetchLatestTopics(options?: RequestInit) {
  // return Promise.resolve(mockTopics)
  return legacyRequest<Topic[]>(`${V2EX_LEGACY_API}/topics/latest.json`, options)
}

export function fetchHotTopics(options?: RequestInit) {
  // return Promise.resolve(mockTopics)
  return legacyRequest<Topic[]>(`${V2EX_LEGACY_API}/topics/hot.json`, options)
}

async function request<Data>(url: string, options?: RequestInit): Promise<DataWrapper<Data>> {
  const PAT = await getPAT()

  const res = await fetch(url, {
    ...options,
    headers: { Authorization: PAT ? `Bearer ${PAT}` : '', ...options?.headers },
  })

  const limit = res.headers.get('X-Rate-Limit-Limit')
  const reset = res.headers.get('X-Rate-Limit-Reset')
  const remaining = res.headers.get('X-Rate-Limit-Remaining')

  chrome.storage.sync.get(StorageKey.API, (result: StorageData) => {
    const api: API_Info = {
      pat: result[StorageKey.API]?.pat,
      limit: limit ? Number(limit) : undefined,
      reset: reset ? Number(reset) : undefined,
      remaining: remaining ? Number(remaining) : undefined,
    }
    void chrome.storage.sync.set({ [StorageKey.API]: api })
  })

  const resultData: DataWrapper<Data> = await res.json()

  if (typeof resultData.success === 'boolean' && !resultData.success) {
    throw new Error(resultData.message, { cause: resultData })
  }

  return resultData
}

export function fetchProfile() {
  return request<Member>(`${V2EX_API}/member`, { method: 'GET' })
}

export function fetchTopic(topicId: string, options?: RequestInit) {
  return request<Topic>(`${V2EX_API}/topics/${topicId}`, { method: 'GET', ...options })
}

export function fetchTopicReplies(topicId: string, options?: RequestInit) {
  return request<TopicReply[]>(`${V2EX_API}/topics/${topicId}/replies`, {
    method: 'GET',
    ...options,
  })
}

export function fetchNotifications(page = 1) {
  return request<Notification[]>(`${V2EX_API}/notifications?p=${page}`, { method: 'GET' })
}

export function deleteNotification(notification_id: string) {
  return request(`${V2EX_API}/notifications/${notification_id}`, { method: 'GET' })
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('image', file)

  // 随机获取一个 Imgur Client ID。
  const randomIndex = Math.floor(Math.random() * imgurClientIdPool.length)
  const clidenId = imgurClientIdPool[randomIndex]

  // 使用详情参考 Imgur API 文档：https://apidocs.imgur.com/
  const res = await fetch('https://api.imgur.com/3/upload', {
    method: 'POST',
    headers: { Authorization: `Client-ID ${clidenId}` },
    body: formData,
  })

  if (res.ok) {
    const resData: ImgurResponse = await res.json()

    if (resData.success) {
      return resData.data.link
    }
  }

  throw new Error('上传失败')
}

const mark = `${EXTENSION_NAME}_config`

export async function getV2P_Config(): Promise<
  { noteId: string; config: StorageData } | undefined
> {
  let noteId: string | undefined

  {
    const res = await fetch(`${V2EX_ORIGIN}/notes`)
    const htmlText = await res.text()
    const $page = $(htmlText)
    const $note = $page.find('.note_item > .note_item_title > a[href^="/notes"]')

    $note.each((_, dom) => {
      const $dom = $(dom)

      if ($dom.text().startsWith(mark)) {
        const href = $dom.attr('href')

        if (typeof href === 'string') {
          const id = href.split('/').at(2)
          noteId = id
        }

        return false
      }
    })
  }

  if (noteId) {
    const res = await fetch(`${V2EX_ORIGIN}/notes/edit/${noteId}`)
    const htmlText = await res.text()

    const $editor = $(htmlText).find('#note_content.note_editor')
    const value = $editor.val()

    if (typeof value === 'string') {
      const config = JSON.parse(value.replace(mark, ''))

      if (isValidConfig(config)) {
        return { noteId, config }
      }
    }
  }
}

export async function setV2P_Config(storageData: StorageData) {
  const data = await getV2P_Config()

  if (!data) {
    return
  }

  const { noteId } = data

  const formData = new FormData()

  formData.append('content', mark + JSON.stringify(storageData))
  formData.append('syntax', '0')

  if (noteId) {
    await fetch(`${V2EX_ORIGIN}/notes/edit/${noteId}`, {
      method: 'POST',
      body: formData,
    })
  } else {
    formData.append('parent_id', '0')

    await fetch(`${V2EX_ORIGIN}/notes/new`, {
      method: 'POST',
      body: formData,
    })
  }
}
