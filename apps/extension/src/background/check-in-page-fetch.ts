import { MessageKey, V2EX } from '../constants'
import type { CheckInPageFetchResponse } from '../types'

/** 等待页面响应的上限；页面内部的请求超时更短，正常情况下会先返回结果。 */
const pageFetchTimeout = 20 * 1000

/** 临时标签页加载并注册好代发接口的最长等待时间。 */
const tabReadyTimeout = 15 * 1000

const tabReadyRetryDelay = 300

const missionUrl = `${V2EX.Origin}/mission/daily`

/**
 * 只借用正式站点标签页。
 *
 * 镜像、短链（s）、测试服（staging）等域名可能指向不同环境，混用会拿到
 * 不一致的会话或误判签到结果，这些标签页会被直接跳过。
 */
const trustedHosts = new Set(['v2ex.com', 'www.v2ex.com'])

/** 一次签到流程内复用的页面请求通道。 */
export interface CheckInPageSession {
  /** 由页面代发请求；返回 undefined 表示请求未送达任何标签页，可安全回退。 */
  fetch: (path: string) => Promise<CheckInPageFetchResponse | undefined>
  /** 释放临时标签页等资源。 */
  close: () => Promise<void>
}

type UsableTab = chrome.tabs.Tab & { id: number }

/**
 * 单次消息发送的结果。
 *
 * `unavailable` 表示消息没有送达（可以换标签页或回退后台请求）；
 * `no-response` 表示消息可能已送达但没拿到结果，此时再次请求会造成重复提交。
 */
type SendResult
  = | { kind: 'response', value: CheckInPageFetchResponse }
    | { kind: 'unavailable' }
    | { kind: 'no-response' }

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isTrustedTab(tab: chrome.tabs.Tab): boolean {
  if (!tab.url) {
    return false
  }

  try {
    return trustedHosts.has(new URL(tab.url).hostname)
  }
  catch {
    return false
  }
}

function isUsableTab(tab: chrome.tabs.Tab): tab is UsableTab {
  return tab.id !== undefined && !tab.discarded && isTrustedTab(tab)
}

/** 签到页的标签页优先，其次是其他 V2EX 页面。 */
function getTabPriority(tab: chrome.tabs.Tab): number {
  return tab.url?.includes('/mission/daily') ? 0 : 1
}

function isCheckInPageFetchResponse(value: unknown): value is CheckInPageFetchResponse {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const result = value as {
    ok?: unknown
    response?: unknown
    message?: unknown
  }

  if (result.ok === true) {
    return typeof result.response === 'object' && result.response !== null
  }

  return result.ok === false && typeof result.message === 'string'
}

/** 页面还没加载完时，消息会因为「接收方不存在」而失败。 */
function isNoReceiverError(error: unknown): boolean {
  return (
    error instanceof Error
    && /Receiving end does not exist|Could not establish connection/i.test(error.message)
  )
}

/** 标签页是否仍然存在（用户可能在中途手动关闭）。 */
async function doesTabExist(tabId: number): Promise<boolean> {
  try {
    await chrome.tabs.get(tabId)

    return true
  }
  catch {
    return false
  }
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | undefined> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  const timeout = new Promise<undefined>((resolve) => {
    timeoutId = setTimeout(() => resolve(undefined), ms)
  })

  try {
    return await Promise.race([promise, timeout])
  }
  finally {
    clearTimeout(timeoutId)
  }
}

/**
 * 打开一次签到使用的页面请求通道。
 *
 * 只复用已打开的正式站点标签页；没有可用标签页时返回 undefined，
 * 由调用方先走后台请求，确认不了结果再调用 `openCheckInTemporaryTabSession`。
 */
export async function openCheckInPageSession(): Promise<CheckInPageSession | undefined> {
  if (typeof chrome === 'undefined' || !chrome.tabs?.query) {
    return undefined
  }

  let tabs: chrome.tabs.Tab[]

  try {
    tabs = await chrome.tabs.query({})
  }
  catch {
    return undefined
  }

  const candidates = tabs.filter(isUsableTab).sort((a, b) => {
    return getTabPriority(a) - getTabPriority(b)
  })

  if (candidates.length === 0) {
    return undefined
  }

  return createExistingTabSession(candidates)
}

/**
 * 把发送结果转换为页面请求结果。
 *
 * 返回 undefined 表示消息未送达，可以换标签页或回退后台请求；
 * 已送达但没有结果时返回超时失败，避免重复提交。
 */
function toPageFetchResponse(result: SendResult): CheckInPageFetchResponse | undefined {
  if (result.kind === 'response') {
    return result.value
  }

  if (result.kind === 'no-response') {
    return { ok: false, code: 'timeout', message: '页面未响应签到请求' }
  }

  return undefined
}

/**
 * 复用已打开的标签页。
 *
 * 一个标签页没送达就换下一个；一旦送达但没有结果，直接按失败处理，
 * 避免同一个领取请求被重复提交。
 */
function createExistingTabSession(tabs: UsableTab[]): CheckInPageSession {
  return {
    async fetch(path) {
      for (const tab of tabs) {
        const response = toPageFetchResponse(await sendFetchMessage(tab.id, path, false))

        if (response) {
          return response
        }
      }

      return undefined
    },
    async close() {
      // 复用已有标签页时无需清理。
    },
  }
}

/**
 * 临时打开一个后台标签页作为最后的兜底通道，签到结束后关闭。
 *
 * 只在没有可用标签页、且后台请求无法确认领取结果时使用，尽量减少可见打扰。
 */
export async function openCheckInTemporaryTabSession(): Promise<CheckInPageSession | undefined> {
  if (typeof chrome === 'undefined' || !chrome.tabs?.create) {
    return undefined
  }

  let tabId: number | undefined

  try {
    const tab = await chrome.tabs.create({ url: missionUrl, active: false })
    tabId = tab.id
  }
  catch {
    return undefined
  }

  if (tabId === undefined) {
    return undefined
  }

  const openedTabId = tabId

  return {
    async fetch(path) {
      const response = toPageFetchResponse(await sendFetchMessage(openedTabId, path, true))

      // 临时标签页是自己打开的：未送达或未响应都不应再回退到后台重复请求。
      return response ?? { ok: false, code: 'network', message: '签到页未就绪' }
    },
    async close() {
      try {
        const tab = await chrome.tabs.get(openedTabId)

        // 用户主动切到了这个标签页时不强行关闭。
        if (!tab.active) {
          await chrome.tabs.remove(openedTabId)
        }
      }
      catch {
        // 标签页可能已被用户关闭。
      }
    },
  }
}

/** 向单个标签页发消息；页面未就绪时可等待注册完成后重试。 */
async function sendFetchMessage(
  tabId: number,
  path: string,
  waitForReady: boolean,
): Promise<SendResult> {
  const deadline = Date.now() + (waitForReady ? tabReadyTimeout : 0)

  while (true) {
    let response: unknown

    try {
      response = await withTimeout(
        chrome.tabs.sendMessage(tabId, { [MessageKey.checkInPageFetch]: { path } }),
        pageFetchTimeout,
      )
    }
    catch (error) {
      if (!isNoReceiverError(error)) {
        return { kind: 'no-response' }
      }

      if (!waitForReady || Date.now() >= deadline) {
        return { kind: 'unavailable' }
      }

      // 用户手动关掉临时标签页后不再空转重试。
      if (!await doesTabExist(tabId)) {
        return { kind: 'unavailable' }
      }

      await delay(tabReadyRetryDelay)
      continue
    }

    if (response === undefined) {
      return { kind: 'no-response' }
    }

    return isCheckInPageFetchResponse(response)
      ? { kind: 'response', value: response }
      : { kind: 'no-response' }
  }
}
