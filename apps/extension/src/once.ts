import { postTask } from './post-task'
import {
  ApiError,
  createSerialQueue,
  extractOnceFromHtml,
  normalizeOnce,
  V2EX_ORIGIN,
} from './utils'

/**
 * 所有 V2EX 写操作共用的串行队列。
 *
 * V2EX 的 once token 在一次写操作后就会失效，并发请求会互相覆盖 token。
 */
const enqueue = createSerialQueue()

/**
 * 将最新的 once 同步到页面上下文和隔离世界。
 */
export function syncOnce(value: unknown): string | null {
  const once = normalizeOnce(value)

  if (!once) {
    return null
  }

  window.once = once
  postTask(`window.once = "${once}"`)

  return once
}

/**
 * 从 HTML 中提取最新的 once 并同步。
 */
export function syncOnceFromHtml(htmlText: string): string | null {
  return syncOnce(extractOnceFromHtml(htmlText))
}

/**
 * 读取当前隔离世界里的 once。
 */
export function getOnce(): string | null {
  return normalizeOnce(window.once)
}

/**
 * 重新抓取页面并同步最新的 once。
 */
export async function refreshOnceFromPage(path = window.location.pathname): Promise<string | null> {
  try {
    const res = await fetch(`${V2EX_ORIGIN}${path}`, { cache: 'no-store' })

    if (!res.ok) {
      return null
    }

    return syncOnceFromHtml(await res.text())
  }
  catch {
    return null
  }
}

/**
 * 串行执行写操作。
 */
export function runSerialized<T>(task: () => Promise<T>): Promise<T> {
  return enqueue(task)
}

/**
 * 串行执行需要 once 的写操作；缺少 once 时先尝试从当前页面刷新。
 */
export function runOnceTask<T>(task: (once: string) => Promise<T>): Promise<T> {
  return runSerialized(async () => {
    const once = getOnce() ?? await refreshOnceFromPage()

    if (!once) {
      throw new ApiError({ message: '登录状态已失效，请刷新页面后重试' })
    }

    return task(once)
  })
}

/**
 * 从写操作的响应 HTML 中同步 once；响应里没有时回退到重新抓取页面。
 */
export async function syncOnceFromResponse(res: Response): Promise<string | null> {
  try {
    const htmlText = await res.text()
    const once = syncOnceFromHtml(htmlText)

    if (once) {
      return once
    }
  }
  catch {
    // 响应体读取失败时继续尝试刷新页面。
  }

  return refreshOnceFromPage()
}
