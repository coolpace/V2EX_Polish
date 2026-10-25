import { queryHotTopics, validateQueryParams } from './query'
import { updateHotTopics } from './updater'

export interface Env {
  DB: D1Database
}

const V2EX_ALLOWED_ORIGINS = [
  'https://v2ex.com',
  'https://www.v2ex.com',
  'https://cn.v2ex.com',
  'https://jp.v2ex.com',
  'https://de.v2ex.com',
  'https://us.v2ex.com',
  'https://hk.v2ex.com',
  'https://global.v2ex.com',
  'https://fast.v2ex.com',
  'https://s.v2ex.com',
  'https://origin.v2ex.com',
  'https://edge.v2ex.com',
  'https://staging.v2ex.com',
  'https://global.v2ex.co',
] as const
const EXTENSION_CLIENT_HEADER = 'X-V2P-Client'
const EXTENSION_CLIENT_VALUE = 'extension'

/** API 响应缓存时间（秒），与 cron 更新频率对齐。 */
const CACHE_MAX_AGE = 300

function getAllowedOrigin(origin: string | null): string | null {
  if (!origin) {
    return null
  }

  return V2EX_ALLOWED_ORIGINS.includes(origin as typeof V2EX_ALLOWED_ORIGINS[number])
    ? origin
    : null
}

function jsonResponse(
  request: Request,
  data: unknown,
  status: number,
  extraHeaders?: Record<string, string>,
): Response {
  const allowedOrigin = getAllowedOrigin(request.headers.get('Origin'))

  return Response.json(data, {
    status,
    headers: {
      ...allowedOrigin
        ? {
            'Access-Control-Allow-Origin': allowedOrigin,
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-V2P-Client',
            Vary: 'Origin',
          }
        : {},
      ...extraHeaders,
    },
  })
}

function isAuthorizedRequest(request: Request): boolean {
  const client = request.headers.get(EXTENSION_CLIENT_HEADER)

  return Boolean(getAllowedOrigin(request.headers.get('Origin')))
    || client === EXTENSION_CLIENT_VALUE
}

function getCacheVariant(request: Request): string {
  const allowedOrigin = getAllowedOrigin(request.headers.get('Origin'))

  if (allowedOrigin) {
    return `origin:${allowedOrigin}`
  }

  if (request.headers.get(EXTENSION_CLIENT_HEADER) === EXTENSION_CLIENT_VALUE) {
    return 'client:extension'
  }

  return 'client:anonymous'
}

function createRequestId(): string {
  return crypto.randomUUID().split('-')[0]
}

export default {
  /**
   * HTTP 请求处理：响应 /hot-topics 接口查询。
   *
   * 缓存策略（两层）：
   * 1. Cloudflare Cache API：命中则直接返回，不查 D1，跨用户共享；
   * 2. Cache-Control 响应头：告知浏览器本地缓存时长。
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      const origin = getAllowedOrigin(request.headers.get('Origin'))

      if (origin) {
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-V2P-Client',
            Vary: 'Origin',
          },
        })
      }

      return new Response(null, { status: 403 })
    }

    const url = new URL(request.url)

    if (url.pathname === '/hot-topics' && request.method === 'GET') {
      if (!isAuthorizedRequest(request)) {
        return jsonResponse(request, { success: false, message: 'Forbidden' }, 403)
      }

      const range = url.searchParams.get('range')
      const startTime = url.searchParams.get('startTime')
      const endTime = url.searchParams.get('endTime')
      const limitsParam = url.searchParams.get('limits')

      // 参数校验
      const limits = limitsParam ? Number(limitsParam) : undefined
      const validated = validateQueryParams({ range, startTime, endTime, limits })

      if (typeof validated === 'string') {
        return jsonResponse(request, { success: false, message: validated }, 400)
      }

      // Layer 2：查 Cloudflare Cache API，命中则直接返回，省去 D1 查询
      // caches.default 是 Cloudflare Workers 的扩展属性，标准类型定义中不含，需要显式断言
      const cache = (caches as unknown as { default: Cache }).default
      const cacheUrl = new URL(request.url)
      const cacheVariant = getCacheVariant(request)

      if (validated.range) {
        cacheUrl.search = ''
        cacheUrl.searchParams.set('range', validated.range)
        cacheUrl.searchParams.set('limits', String(validated.limits))
      }

      cacheUrl.searchParams.set('__cache_variant', cacheVariant)

      const cacheKey = new Request(cacheUrl.toString())
      const cachedResponse = await cache.match(cacheKey)

      if (cachedResponse) {
        return cachedResponse
      }

      try {
        const data = await queryHotTopics(env.DB, validated)

        const response = jsonResponse(request, data, 200, {
          'Cache-Control': `public, max-age=${CACHE_MAX_AGE}`,
        })

        // 异步写入 Cloudflare Cache，不阻塞当前响应
        ctx.waitUntil(cache.put(cacheKey, response.clone()))

        return response
      }
      catch (err) {
        const requestId = createRequestId()

        console.error(`查询热议主题失败 [${requestId}]:`, {
          range,
          startTime,
          endTime,
          limits: validated.limits,
          err,
        })

        return jsonResponse(
          request,
          { success: false, message: `服务器内部错误，请稍后重试（请求 ID: ${requestId}）` },
          500,
          { 'Cache-Control': 'no-store' },
        )
      }
    }

    return jsonResponse(request, { success: false, message: 'Not Found' }, 404)
  },

  /**
   * Cron Trigger：定时拉取 V2EX 热门主题并更新 D1 数据库。
   */
  scheduled(
    _controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
  ): void {
    ctx.waitUntil(
      updateHotTopics(env.DB)
        .then((result) => {
          // eslint-disable-next-line no-console
          console.log(`Cron 执行完成: UPSERT ${result.upserted} 条, 清理 ${result.cleaned} 条`)
        })
        .catch((err) => {
          console.error('Cron 执行失败:', err)
        }),
    )
  },
} satisfies ExportedHandler<Env>
