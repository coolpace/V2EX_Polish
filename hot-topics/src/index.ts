import { queryHotTopics, validateQueryParams } from './query'
import { updateHotTopics } from './updater'

export interface Env {
  DB: D1Database
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

/** API 响应缓存时间（秒），与 cron 更新频率对齐。 */
const CACHE_MAX_AGE = 300

function jsonResponse(
  data: unknown,
  status: number,
  extraHeaders?: Record<string, string>,
): Response {
  return Response.json(data, {
    status,
    headers: { ...CORS_HEADERS, ...extraHeaders },
  })
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
      return new Response(null, { headers: CORS_HEADERS })
    }

    const url = new URL(request.url)

    if (url.pathname === '/hot-topics' && request.method === 'GET') {
      const startTime = url.searchParams.get('startTime')
      const endTime = url.searchParams.get('endTime')
      const limitsParam = url.searchParams.get('limits')

      if (!startTime || !endTime) {
        return jsonResponse(
          { success: false, message: '缺少 startTime 或 endTime 参数' },
          400,
        )
      }

      // 参数校验
      const limits = limitsParam ? Number(limitsParam) : undefined
      const validated = validateQueryParams({ startTime, endTime, limits })

      if (typeof validated === 'string') {
        return jsonResponse({ success: false, message: validated }, 400)
      }

      // Layer 2：查 Cloudflare Cache API，命中则直接返回，省去 D1 查询
      // caches.default 是 Cloudflare Workers 的扩展属性，标准类型定义中不含，需要显式断言
      const cache = (caches as unknown as { default: Cache }).default
      const cacheKey = new Request(request.url)
      const cachedResponse = await cache.match(cacheKey)

      if (cachedResponse) {
        return cachedResponse
      }

      try {
        const data = await queryHotTopics(env.DB, validated)

        const response = jsonResponse(data, 200, {
          'Cache-Control': `public, max-age=${CACHE_MAX_AGE}`,
        })

        // 异步写入 Cloudflare Cache，不阻塞当前响应
        ctx.waitUntil(cache.put(cacheKey, response.clone()))

        return response
      }
      catch (err) {
        console.error('查询热议主题失败:', err)

        return jsonResponse(
          { success: false, message: '服务器内部错误' },
          500,
        )
      }
    }

    return jsonResponse({ success: false, message: 'Not Found' }, 404)
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
