import { imgurClientIdPool, StorageKey, V2EX } from './constants'
import { postTask } from './contents/helpers'
import type {
  API_Info,
  DataWrapper,
  HotTopic,
  ImgurResponse,
  Member,
  Notification,
  Once,
  Topic,
  TopicReply,
  V2EX_Response,
} from './types'
import { getStorage, setStorage, V2EX_ORIGIN } from './utils'

const V2EX_LEGACY_API = `${V2EX_ORIGIN}/api`
const V2EX_API = `${V2EX_ORIGIN}/api/v2`

/**
 * V2EX API v1
 *
 * 相关的接口文档参考：https://www.v2ex.com/p/7v9TEc53
 */
async function legacyRequest<Data>(url: string, options?: RequestInit): Promise<Data> {
  const res = await fetch(url, options)

  if (res.ok) {
    return res.json() as Data
  }

  throw new Error('调用 V2EX API v1 出错', { cause: res.status })
}

export async function fetchUserInfo(memberName: Member['username'], options?: RequestInit) {
  try {
    const member = await legacyRequest<Member>(
      `${V2EX_LEGACY_API}/members/show.json?username=${memberName}`,
      options
    )

    return member
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        throw new Error('请求被取消')
      } else if (err.cause === 404) {
        throw new Error('查无此用户，疑似已被封禁', { cause: err.cause })
      }
    }

    throw new Error('获取用户信息失败')
  }
}

export function fetchLatestTopics(options?: RequestInit) {
  return legacyRequest<Topic[]>(`${V2EX_LEGACY_API}/topics/latest.json?r=${Date.now()}`, options)
}

export function fetchHotTopics(options?: RequestInit) {
  return legacyRequest<Topic[]>(`${V2EX_LEGACY_API}/topics/hot.json?r=${Date.now()}`, options)
}

async function request<Data>(url: string, options?: RequestInit): Promise<DataWrapper<Data>> {
  const storage = await getStorage()
  const PAT = storage[StorageKey.API]?.pat

  const res = await fetch(url, {
    ...options,
    headers: { Authorization: PAT ? `Bearer ${PAT}` : '', ...options?.headers },
  })

  {
    const limit = res.headers.get('X-Rate-Limit-Limit')
    const reset = res.headers.get('X-Rate-Limit-Reset')
    const remaining = res.headers.get('X-Rate-Limit-Remaining')

    const api: API_Info = {
      pat: PAT,
      limit: limit ? Number(limit) : undefined,
      reset: reset ? Number(reset) : undefined,
      remaining: remaining ? Number(remaining) : undefined,
    }
    void setStorage(StorageKey.API, api)
  }

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
  // Test:
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(`https://xxx.com/${file.name}`)
  //   }, 1000)
  // })

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

// ==================== 以下为非官方提供的接口 ====================

/**
 * 获取最新的金币，返回 HTML 字符串。
 */
async function refreshMoney(): Promise<void> {
  const res = await fetch('/ajax/money', { method: 'POST' })
  const data = await res.text()
  $('#money').html(data)
}

export async function thankReply(params: {
  replyId: string
  onSuccess?: () => void
  onFail?: () => void
}): Promise<void> {
  try {
    const res = await fetch(`/thank/reply/${params.replyId}?once=${window.once}`, {
      method: 'POST',
    })
    const data: V2EX_Response & { once: Once } = await res.json()

    // 从接口获取到最新的 once 后需要更新回 Web 页。
    postTask(`window.once = ${data.once}`)
    window.once = data.once

    if (data.success) {
      $('#thank_area_' + params.replyId)
        .addClass('thanked')
        .html('感谢已发送')

      params.onSuccess?.()

      await refreshMoney()
    } else {
      alert(data.message)
    }
  } catch {
    params.onFail?.()
  }
}

/**
 * 爬取主题内容页，返回 HTML 纯文本。
 */
export async function crawlTopicPage(path: string, page = '1'): Promise<string> {
  const res = await fetch(`${V2EX_ORIGIN}${path}?p=${page}`)
  const htmlText = await res.text()
  return htmlText
}

export async function addFavorite(url: string): Promise<void> {
  const res = await fetch(url)

  if (res.redirected) {
    const htmlText = await res.text()

    if (htmlText.includes('取消收藏')) {
      return
    }
  }

  throw new Error('加入收藏失败')
}

export async function unfavorite(url: string): Promise<void> {
  const res = await fetch(url)

  if (res.redirected) {
    const htmlText = await res.text()

    if (htmlText.includes('加入收藏')) {
      return
    }
  }

  throw new Error('取消收藏失败')
}

/**
 * 获取回复的预览渲染内容。
 */
export async function getCommentPreview(params: {
  text: string
  syntax: 'default' | 'markdown'
}): Promise<string> {
  const formData = new FormData()
  formData.append('text', params.text)

  const res = await fetch(`${V2EX_ORIGIN}/preview/${params.syntax}`, {
    method: 'POST',
    body: formData,
  })

  if (res.ok) {
    const renderedContent = await res.text()
    return renderedContent
  } else {
    throw new Error('预览失败')
  }
}

export async function getUnreadMessagesCount(): Promise<number> {
  const res = await fetch(`${V2EX.Origin}/mission`)
  const htmlText = await res.text()
  const $page = $(htmlText)
  const text = $page.find('#Rightbar a[href^="/notifications"]').text()

  if (text.includes('未读提醒')) {
    const countStr = text.match(/\d+/)?.at(0)

    if (countStr) {
      const count = Number(text.match(/\d+/)?.at(0))
      return count
    }
  } else {
    return 0
  }

  throw new Error('无法获取未读消息数量')
}

/**
 * 获取近期热议主题。
 */
export async function getHotTopics(params: {
  /** 开始时间，单位：秒。 */
  startTime: number
  /** 结束时间，单位：秒。 */
  endTime: number
  /** 限制返回数据条数。 */
  limits?: number
  signal?: AbortSignal
}): Promise<DataWrapper<HotTopic[]>> {
  const { startTime, endTime, limits = 8, signal } = params

  const url = new URL('https://wbhvzt9dzy.us.aircode.run/hot-topics')

  url.searchParams.set('startTime', String(startTime))
  url.searchParams.set('endTime', String(endTime))

  if (limits) {
    url.searchParams.set('limits', String(limits))
  }

  const res = await fetch(url, {
    method: 'GET',
    signal,
  })

  const data: DataWrapper<HotTopic[]> = await res.json()

  return data
}
