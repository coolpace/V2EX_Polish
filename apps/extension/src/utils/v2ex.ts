/**
 * V2EX 页面与接口数据的轻量解析工具。
 */

/** V2EX 写操作使用的 CSRF token（once）格式。 */
const ONCE_PATTERN = /^\d+$/

/** V2EX 屏蔽用户接口的地址格式。 */
const BLOCK_URL_PATTERN = /^\/block\/\d+\?once=\d+$/

/** V2EX 忽略主题接口的路径格式。 */
const IGNORE_TOPIC_PATH_PATTERN = /^\/ignore\/topic\/\d+$/

/** V2EX 忽略回复接口的路径格式。 */
const IGNORE_REPLY_PATH_PATTERN = /^\/ignore\/reply\/\d+$/

/**
 * 校验并标准化 once token。
 *
 * 接口可能返回数字或字符串，统一转成字符串，避免把非法值写回页面上下文。
 */
export function normalizeOnce(value: unknown): string | null {
  if (typeof value === 'number') {
    return Number.isSafeInteger(value) && value >= 0 ? String(value) : null
  }

  if (typeof value === 'string' && ONCE_PATTERN.test(value)) {
    return value
  }

  return null
}

/**
 * 从页面 HTML 中提取最新的 once token。
 */
export function extractOnceFromHtml(htmlText: string): string | null {
  const matched = htmlText.match(/once\s*=\s*"?(\d+)"?/)

  return normalizeOnce(matched?.[1])
}

/**
 * 从「Block」按钮的 onclick 属性中解析出屏蔽接口地址。
 *
 * 仅接受站内 `/block/{memberId}?once={once}` 形式，
 * 避免把页面中的任意地址用于请求。
 */
export function parseBlockUrl(onclick: string | null | undefined): string | null {
  if (!onclick) {
    return null
  }

  const matched = onclick.match(/location\.href\s*=\s*['"]([^'"]+)['"]/)
  const url = matched?.[1]

  return url && BLOCK_URL_PATTERN.test(url) ? url : null
}

/**
 * 从「屏蔽主题」按钮的 onclick 属性中解析出忽略主题接口地址。
 */
export function parseIgnoreTopicUrl(onclick: string | null | undefined): string | null {
  if (!onclick) {
    return null
  }

  const matched = onclick.match(/['"](\/ignore\/topic\/[^'"]+)['"]/)
  const url = matched?.[1]

  if (!url) {
    return null
  }

  const [urlWithoutHash] = url.split('#')
  const [path, query = ''] = (urlWithoutHash ?? '').split('?')

  if (!path || !IGNORE_TOPIC_PATH_PATTERN.test(path)) {
    return null
  }

  const once = new URLSearchParams(query).get('once')

  return once && ONCE_PATTERN.test(once) ? url : null
}

/**
 * 从「隐藏回复」链接中解析出忽略回复接口地址。
 *
 * 原生链接可能把地址放在 href 或 onclick 中。
 */
export function parseIgnoreReplyUrl(
  href: string | null | undefined,
  onclick: string | null | undefined,
): string | null {
  const source = `${href ?? ''} ${onclick ?? ''}`

  if (!source.trim()) {
    return null
  }

  const quoted = source.match(/['"](\/ignore\/reply\/\d+\?[^'"]+)['"]/)
  const direct = source.match(/(?:^|[\s'"=(])(\/ignore\/reply\/\d+\?[^'"\s]+)/)
  const url = quoted?.[1] ?? direct?.[1]?.replace(/[;)]+$/, '')

  if (!url) {
    return null
  }

  const [urlWithoutHash] = url.split('#')
  const [path, query = ''] = (urlWithoutHash ?? '').split('?')

  if (!path || !IGNORE_REPLY_PATH_PATTERN.test(path)) {
    return null
  }

  const once = new URLSearchParams(query).get('once')

  return once && ONCE_PATTERN.test(once) ? url : null
}

/**
 * 解析回复的点赞数。
 *
 * 页面中的点赞数可能为空或包含异常文本，统一降级为 0。
 */
export function parseLikesCount(raw: string | null | undefined): number {
  if (!raw) {
    return 0
  }

  const count = Number.parseInt(raw.trim(), 10)

  return Number.isFinite(count) && count > 0 ? count : 0
}
