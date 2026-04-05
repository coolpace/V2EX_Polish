import {
  HOT_TOPICS_API_URL,
  imgurClientIdPool,
  StorageKey,
  V2EX,
} from './constants'
import { postTask } from './post-task'
import type {
  API_Info,
  DataWrapper,
  HotTopic,
  HotTopicRange,
  ImgurResponse,
  Member,
  Notification,
  Once,
  Topic,
  TopicReply,
  UserTopicItem,
  V2EX_Response,
} from './types'
import {
  ApiError,
  createApiErrorFromResponse,
  getStorage,
  isAbortError,
  setStorage,
  V2EX_ORIGIN,
  wrapApiError,
} from './utils'

const V2EX_LEGACY_API = `${V2EX_ORIGIN}/api`
const V2EX_API = `${V2EX_ORIGIN}/api/v2`

/**
 * V2EX API v1
 *
 * 相关的接口文档参考：https://www.v2ex.com/p/7v9TEc53
 */
async function legacyRequest<Data>(
  url: string,
  options?: RequestInit & { timeout?: number },
): Promise<Data> {
  // 从 options 中排除 timeout，避免传递给 fetch
  const opts = options ?? ({} as RequestInit & { timeout?: number })
  const { timeout: timeoutValue, ...restOptions } = opts
  const timeout = timeoutValue ?? FETCH_TIMEOUT.DEFAULT
  const res = await fetchWithTimeout(url, timeout, restOptions)

  if (res.ok) {
    return res.json() as Data
  }

  throw await createApiErrorFromResponse(res, '调用 V2EX API v1 出错')
}

export async function fetchUserInfo(memberName: Member['username'], options?: RequestInit) {
  try {
    const member = await legacyRequest<Member>(
      `${V2EX_LEGACY_API}/members/show.json?username=${memberName}`,
      options,
    )

    return member
  }
  catch (err) {
    if (isAbortError(err)) {
      throw new ApiError({ message: '请求被取消', cause: err })
    }

    if (err instanceof ApiError && err.statusCode === 404) {
      throw new ApiError({
        message: '查无此用户，疑似已被封禁',
        cause: err,
        statusCode: 404,
      })
    }

    throw wrapApiError(err, '获取用户信息失败')
  }
}

export function fetchLatestTopics(options?: RequestInit) {
  return legacyRequest<Topic[]>(`${V2EX_LEGACY_API}/topics/latest.json?r=${Date.now()}`, options)
}

export function fetchHotTopics(options?: RequestInit) {
  return legacyRequest<Topic[]>(`${V2EX_LEGACY_API}/topics/hot.json?r=${Date.now()}`, options)
}

async function request<Data>(
  url: string,
  options?: RequestInit & { timeout?: number },
): Promise<DataWrapper<Data>> {
  const storage = await getStorage()
  const PAT = storage[StorageKey.API]?.pat

  // 从 options 中排除 timeout，避免传递给 fetch
  const opts = options ?? ({} as RequestInit & { timeout?: number })
  const { timeout: timeoutValue, ...restOptions } = opts
  const timeout = timeoutValue ?? FETCH_TIMEOUT.DEFAULT

  const res = await fetchWithTimeout(url, timeout, {
    ...restOptions,
    headers: { Authorization: PAT ? `Bearer ${PAT}` : '', ...restOptions?.headers },
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

  const resultData = await res.json() as DataWrapper<Data>

  if (typeof resultData.success === 'boolean' && !resultData.success) {
    throw new Error(resultData.message, { cause: resultData })
  }

  return resultData
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

/**
 * Imgur 文件上传规则：
 *
 * - File size limits:
 * 非动画图像（比如 JPG、PNG 等）的最大文件大小为 20MB。超过 5MB 的 PNG 文件将被转换为 JPEG。
 * 动画图像（比如 GIF）和视频的最大文件大小为 200MB。视频上传不能超过 60 秒。超过 2MB 的 GIF 和视频文件将被转换为 GIFV。
 * 对于非动画图片，匿名用户上传的文件超过 1MB，账号主上传的文件超过 5MB，将会进行有损压缩。
 *
 * - Upload limits:
 * 每小时上传限额为 50 张图片，但账号没有总的上传限额。
 *
 * 使用详情参考 https://help.imgur.com/hc/en-us/articles/26511665959579-What-files-can-I-upload-Is-there-a-size-limit。
 */
export async function uploadImage(file: File): Promise<string> {
  // 如果要测试上传图片的交互效果，则取消以下注释。
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

  // 使用详情参考 Imgur API 文档：https://apidocs.imgur.com/。
  const res = await fetchWithTimeout('https://api.imgur.com/3/upload', FETCH_TIMEOUT.UPLOAD, {
    method: 'POST',
    headers: { Authorization: `Client-ID ${clidenId}` },
    body: formData,
  })

  if (res.ok) {
    const resData = await res.json() as ImgurResponse

    if (resData.success) {
      return resData.data.link
    }
  }

  throw await createApiErrorFromResponse(res, '上传失败')
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
    const data = await res.json() as V2EX_Response & { once: Once }

    // 从接口获取到最新的 once 后需要更新回 Web 页。
    postTask(`window.once = ${data.once}`)
    window.once = data.once

    if (data.success) {
      $('#thank_area_' + params.replyId)
        .addClass('thanked')
        .html('感谢已发送')

      params.onSuccess?.()

      await refreshMoney()
    }
    else {
      alert(data.message)
    }
  }
  catch {
    params.onFail?.()
  }
}

/**
 * 爬取主题内容页，返回 HTML 纯文本。
 */
export async function crawlTopicPage(path: string, page = '1'): Promise<string> {
  const res = await fetchWithTimeout(`${V2EX_ORIGIN}${path}?p=${page}`, FETCH_TIMEOUT.CRAWL)
  const htmlText = await res.text()

  return htmlText
}

/**
 * 爬取用户内容页，返回 HTML 纯文本。
 */
export async function crawlUserPage(username: string): Promise<string> {
  const res = await fetchWithTimeout(`${V2EX_ORIGIN}/member/${username}`, FETCH_TIMEOUT.CRAWL)
  const htmlText = await res.text()

  return htmlText
}

/**
 * 网络请求超时时间配置（毫秒）
 */
const FETCH_TIMEOUT = {
  DEFAULT: 10000,
  CRAWL: 8000,
  UPLOAD: 60000,
  BACKGROUND: 20000,
}

/**
 * 带超时的 fetch 请求
 *
 * @param url - 请求 URL
 * @param timeout - 超时时间（毫秒），默认为 10 秒
 * @param options - fetch 选项
 * @returns Promise<Response>
 */
async function fetchWithTimeout(
  url: string,
  timeout = FETCH_TIMEOUT.DEFAULT,
  options?: RequestInit,
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  const externalSignal = options?.signal
  const abortWithExternalSignal = () => controller.abort()

  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort()
    }
    else {
      externalSignal.addEventListener('abort', abortWithExternalSignal, { once: true })
    }
  }

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    })

    return res
  }
  finally {
    clearTimeout(timeoutId)
    externalSignal?.removeEventListener('abort', abortWithExternalSignal)
  }
}

/**
 * 爬取标签页面，返回 HTML 纯文本。
 */
export async function crawlTagPage(tag: string): Promise<string> {
  const url = `${V2EX_ORIGIN}/tag/${encodeURIComponent(tag)}`
  const res = await fetchWithTimeout(url)

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText} for ${url}`)
  }

  return await res.text()
}

/**
 * 从用户页面 HTML 中解析发帖记录列表。
 *
 * @param htmlText - 用户页面的 HTML 文本
 * @param limit - 最多返回的记录数量，默认为 5
 * @returns 发帖记录数组，解析失败时返回空数组
 */
export function parseUserTopics(htmlText: string, limit = 5): UserTopicItem[] {
  try {
    const $page = $(htmlText)
    const $topicItems = $page.find('.cell.item')
    const topics: UserTopicItem[] = []

    $topicItems.each((index, item) => {
      if (index >= limit) {
        return false
      }

      const $item = $(item)
      const $topicLink = $item.find('.item_title .topic-link')
      const $nodeLink = $item.find('.node')

      const title = $topicLink.text().trim()
      const url = $topicLink.attr('href')

      if (title && url) {
        const topic: UserTopicItem = {
          title,
          url,
        }

        const nodeName = $nodeLink.text().trim()
        const nodeUrl = $nodeLink.attr('href')

        if (nodeName && nodeUrl) {
          topic.node = {
            name: nodeName,
            url: nodeUrl,
          }
        }

        topics.push(topic)
      }
    })

    return topics
  }
  catch {
    return []
  }
}

/**
 * 屏蔽用户。
 *
 * @param username - 要屏蔽的用户名
 * @returns 屏蔽是否成功
 */
export async function blockUser(username: string): Promise<{ success: boolean, message: string }> {
  try {
    // 1. 先爬取用户页面
    const htmlText = await crawlUserPage(username)

    // 2. 从页面中提取 Block URL
    const $page = $(htmlText)
    const $blockBtn = $page.find('input[type="button"][value="Block"]')

    if ($blockBtn.length === 0) {
      return { success: false, message: '未找到 Block 按钮，该用户可能已被屏蔽' }
    }

    const onclick = $blockBtn.attr('onclick')

    if (!onclick) {
      return { success: false, message: '无法获取屏蔽链接' }
    }

    // 从 onclick 属性中提取 URL
    // 格式: location.href = '/block/622504?once=96942'
    const match = onclick.match(/location\.href\s*=\s*['"]([^'"]+)['"]/)

    if (!match || !match[1]) {
      return { success: false, message: '无法解析屏蔽链接' }
    }

    const blockUrl = match[1]

    // 3. 执行屏蔽操作
    const res = await fetch(`${V2EX_ORIGIN}${blockUrl}`)

    if (res.ok) {
      return { success: true, message: '✅ 已屏蔽该用户' }
    }
    else {
      return { success: false, message: '屏蔽操作失败，请稍后重试' }
    }
  }
  catch (error) {
    console.error('屏蔽用户失败:', error)

    return { success: false, message: '屏蔽操作出错，请稍后重试' }
  }
}

export async function addFavorite(url: string): Promise<void> {
  const res = await fetch(url)

  if (res.redirected) {
    const htmlText = await res.text()

    if (htmlText.includes('取消收藏')) {
      return
    }
  }

  throw new ApiError({ message: '加入收藏失败' })
}

export async function unfavorite(url: string): Promise<void> {
  const res = await fetch(url)

  if (res.redirected) {
    const htmlText = await res.text()

    if (htmlText.includes('加入收藏')) {
      return
    }
  }

  throw new ApiError({ message: '取消收藏失败' })
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
  }

  throw await createApiErrorFromResponse(res, '预览失败')
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
  }
  else {
    return 0
  }

  throw new ApiError({ message: '无法获取未读消息数量' })
}

function resolveHotTopicsApi(): URL {
  if (HOT_TOPICS_API_URL.includes('<your-subdomain>')) {
    throw new ApiError({ message: '未配置热议主题接口地址，请替换 HOT_TOPICS_API 中的占位符' })
  }

  return new URL(HOT_TOPICS_API_URL)
}

async function fetchHotTopicsDirect(params: {
  range: HotTopicRange
  limits?: number
  signal?: AbortSignal
}): Promise<DataWrapper<HotTopic[]>> {
  const { range, limits = 8, signal } = params

  try {
    const url = resolveHotTopicsApi()
    url.searchParams.set('range', String(range))

    if (limits) {
      url.searchParams.set('limits', String(limits))
    }

    const res = await fetchWithTimeout(url.toString(), FETCH_TIMEOUT.DEFAULT, {
      method: 'GET',
      signal,
    })

    if (!res.ok) {
      throw await createApiErrorFromResponse(res, '获取热议主题失败')
    }

    const data = await res.json() as DataWrapper<HotTopic[]>

    if (!data.success) {
      throw new ApiError({
        message: data.message ? `获取热议主题失败：${data.message}` : '获取热议主题失败',
      })
    }

    return data
  }
  catch (err) {
    if (isAbortError(err) || err instanceof ApiError) {
      throw err
    }

    if (err instanceof Error) {
      throw new ApiError({
        message: `获取热议主题失败：${err.message}`,
        cause: err,
      })
    }

    throw new ApiError({
      message: '获取热议主题失败',
      cause: err,
    })
  }
}

/**
 * 获取近期热议主题。
 */
export async function getHotTopics(params: {
  /** 时间范围。 */
  range: HotTopicRange
  /** 限制返回数据条数。 */
  limits?: number
  signal?: AbortSignal
}): Promise<DataWrapper<HotTopic[]>> {
  const { range, limits = 8, signal } = params

  return fetchHotTopicsDirect({ range, limits, signal })
}
