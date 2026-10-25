import { HOST } from '~/utils'

/**
 * 开发环境下默认通过线上 API 代理获取 V2EX 数据，避免本地无法访问外网。
 * 设置 SHARE_UPSTREAM_URL= 可强制直连 V2EX（需翻墙）。
 */
export function getShareUpstreamUrl(): string | null {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  if (process.env.SHARE_UPSTREAM_URL === '') {
    return null
  }

  return process.env.SHARE_UPSTREAM_URL ?? HOST
}

export async function proxyShareRequest<T>(path: string, body: unknown): Promise<T | null> {
  const upstream = getShareUpstreamUrl()

  if (!upstream) {
    return null
  }

  const res = await fetch(`${upstream}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(`Upstream request failed: ${res.status}`)
  }

  return await res.json() as T
}
