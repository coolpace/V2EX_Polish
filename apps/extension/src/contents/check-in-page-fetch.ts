import { MessageKey } from '../constants'
import type { CheckInPageFetchResponse } from '../types'

/** 页面代发签到请求的超时时间。 */
const checkInFetchTimeout = 15 * 1000

/** 只允许代发签到页与领取入口这两个地址。 */
const checkInFetchPathPattern = /^\/mission\/daily(?:\/redeem\?once=[A-Za-z0-9_%.-]+)?$/

/**
 * 允许 background 借用本页面代发签到请求。
 *
 * 领取凭证与页面会话绑定，由页面发起请求才能和手动点击保持一致；
 * background 仍负责调度与状态写入。
 */
export function registerCheckInPageFetch(): void {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (sender.id !== chrome.runtime.id) {
      return undefined
    }

    const path = getCheckInPath(message)

    if (!path) {
      const result: CheckInPageFetchResponse = {
        ok: false,
        code: 'network',
        message: '无效的签到请求',
      }

      sendResponse(result)

      return undefined
    }

    void fetchCheckInResponse(path).then(sendResponse)

    return true
  })
}

/** 从消息中读取并校验签到路径。 */
function getCheckInPath(message: unknown): string | undefined {
  const payload = (message as Record<string, unknown> | null)?.[MessageKey.checkInPageFetch]

  if (!payload || typeof payload !== 'object') {
    return undefined
  }

  const path = (payload as { path?: unknown }).path

  return typeof path === 'string' && checkInFetchPathPattern.test(path) ? path : undefined
}

/** 在页面上下文请求签到接口，返回可直接回传给 background 的结果。 */
async function fetchCheckInResponse(path: string): Promise<CheckInPageFetchResponse> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), checkInFetchTimeout)

  try {
    const res = await fetch(path, {
      credentials: 'include',
      cache: 'no-store',
      signal: controller.signal,
      // 补齐页面导航的 Accept，避免 Cloudflare 把代发请求当成可疑 XHR 而要求验证。
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      },
    })

    return {
      ok: true,
      response: {
        status: res.status,
        finalUrl: res.url,
        text: await res.text(),
        retryAfter: res.headers.get('retry-after'),
        challenge: res.headers.get('cf-mitigated')?.toLowerCase() === 'challenge',
      },
    }
  }
  catch (error) {
    const timedOut = error instanceof Error && error.name === 'AbortError'

    return {
      ok: false,
      code: timedOut ? 'timeout' : 'network',
      message: timedOut ? '请求超时' : String(error),
    }
  }
  finally {
    clearTimeout(timeoutId)
  }
}
