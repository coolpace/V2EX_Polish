import { type NextRequest, NextResponse } from 'next/server'
import { parse } from 'valibot'

import { proxyShareRequest } from '~/utils/share-upstream'

import { isAllowedImageUrl } from './allowlist'
import { type RequestData, RequestDataSchema } from './schema'

/** 单张图片最大 5 MB，避免代理被用于下载大文件。 */
const MAX_IMAGE_BYTES = 5 * 1024 * 1024

const FETCH_TIMEOUT_MS = 5000

/**
 * 图片地址的内容基本不变，允许浏览器与 CDN 缓存，
 * 避免同一张头像在每次导出分享图时重复下载与转码。
 */
const SUCCESS_CACHE_CONTROL = 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800'

function createErrorResponse(status: number) {
  return NextResponse.json({ data: '' }, { status, headers: { 'Cache-Control': 'no-store' } })
}

function createSuccessResponse(data: string) {
  return NextResponse.json({ data }, { status: 200, headers: { 'Cache-Control': SUCCESS_CACHE_CONTROL } })
}

export async function POST(request: NextRequest) {
  let body: RequestData

  try {
    body = parse(RequestDataSchema, await request.json())
  }
  catch {
    return createErrorResponse(400)
  }

  if (!isAllowedImageUrl(body.imgUrl)) {
    return createErrorResponse(400)
  }

  try {
    const upstreamData = await proxyShareRequest<{ data: string }>('/api/img-to-base64', body)

    if (upstreamData) {
      return createSuccessResponse(upstreamData.data)
    }

    const res = await fetch(body.imgUrl, {
      redirect: 'error',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })

    if (!res.ok) {
      return createErrorResponse(502)
    }

    const contentType = (res.headers.get('content-type') ?? '').split(';')[0]?.trim().toLowerCase() ?? ''

    if (!contentType.startsWith('image/')) {
      return createErrorResponse(415)
    }

    const declaredLength = Number(res.headers.get('content-length') ?? 0)

    if (declaredLength > MAX_IMAGE_BYTES) {
      return createErrorResponse(413)
    }

    const buffer = await res.arrayBuffer()

    if (buffer.byteLength > MAX_IMAGE_BYTES) {
      return createErrorResponse(413)
    }

    const base64 = `data:${contentType};base64,${Buffer.from(buffer).toString('base64')}`

    return createSuccessResponse(base64)
  }
  catch (error) {
    console.error('Failed to convert image to base64:', error)

    return createErrorResponse(502)
  }
}
