interface HotTopicRow {
  id: number
  title: string
  replies: number
  created: number
  last_touched: number
  member_username: string
  member_avatar_mini: string
}

interface HotTopicResult {
  id: number
  title: string
  url: string
  replies: number
  created: number
  member: {
    username: string
    avatar_mini: string
    avatar_normal: string
  }
}

/**
 * 从 avatar_mini URL 推导 avatar_normal URL。
 *
 * 支持两种格式：
 * - 自定义头像: .../319867_mini.png?m=... → .../319867_normal.png?m=...
 * - Gravatar: .../gravatar/hash?s=24&d=retro → .../gravatar/hash?s=48&d=retro
 */
function deriveAvatarNormal(avatarMini: string): string {
  if (avatarMini.includes('/gravatar/')) {
    return avatarMini.replace('s=24', 's=48')
  }

  return avatarMini.replace('_mini.', '_normal.')
}

/** limits 参数的合法范围。 */
const MIN_LIMITS = 1
const MAX_LIMITS = 50

/** 各时间档对应的时间窗口长度（秒）。 */
const RANGE_TO_SECONDS = {
  '3d': 3 * 86400,
  '7d': 7 * 86400,
  '30d': 30 * 86400,
} as const

export type HotTopicsRange = keyof typeof RANGE_TO_SECONDS

/** 各时间档的展示条数：默认条数 / 展开后条数。 */
const RANGE_LIMITS = {
  '3d': { default: 10, expand: 18 },
  '7d': { default: 12, expand: 20 },
  '30d': { default: 16, expand: 24 },
} as const

function isHotTopicsRange(value: string): value is HotTopicsRange {
  return value in RANGE_TO_SECONDS
}

function getAlignedCurrentTime(): number {
  const now = Math.floor(Date.now() / 1000)

  return now - now % 300
}

/** 根据 range 与 expand 计算该档的条数。 */
function resolveRangeLimits(range: HotTopicsRange, expand: 0 | 1): number {
  const config = RANGE_LIMITS[range]

  return expand === 1 ? config.expand : config.default
}

/**
 * 校验并解析查询参数。
 *
 * @returns 校验通过返回解析后的参数，校验失败返回错误信息字符串。
 */
export function validateQueryParams(params: {
  range?: string | null
  startTime?: string | null
  endTime?: string | null
  limits?: number
  expand?: string | null
}): {
  startTime: number
  endTime: number
  limits: number
  range: HotTopicsRange | null
  expand: 0 | 1
} | string {
  let start: number
  let end: number

  if (params.range) {
    if (!isHotTopicsRange(params.range)) {
      return 'range 必须为 3d、7d 或 30d'
    }

    end = getAlignedCurrentTime()
    start = end - RANGE_TO_SECONDS[params.range]
  }
  else {
    if (!params.startTime || !params.endTime) {
      return '缺少 range，或缺少 startTime / endTime 参数'
    }

    start = Number(params.startTime)
    end = Number(params.endTime)

    if (Number.isNaN(start) || Number.isNaN(end)) {
      return 'startTime 和 endTime 必须为有效数字'
    }

    if (start > end) {
      return 'startTime 不能大于 endTime'
    }
  }

  const expand = Number(params.expand ?? 0)

  if (expand !== 0 && expand !== 1) {
    return 'expand 必须为 0 或 1'
  }

  const range = params.range && isHotTopicsRange(params.range) ? params.range : null
  const limits = params.limits ?? (range ? resolveRangeLimits(range, expand) : 8)

  if (!Number.isInteger(limits) || limits < MIN_LIMITS || limits > MAX_LIMITS) {
    return `limits 必须为 ${MIN_LIMITS}-${MAX_LIMITS} 之间的整数`
  }

  return {
    startTime: start,
    endTime: end,
    limits,
    range,
    expand,
  }
}

/**
 * 根据 range 划分时间桶。
 *
 * 三桶彼此不重叠，去重不依赖展示条数：
 * - 近三日：`[end - 3d, end]`
 * - 3~7 天前：`[end - 7d, end - 3d)`
 * - 7~30 天前：`[end - 30d, end - 7d)`
 */
function resolveBucket(
  range: HotTopicsRange,
  endTime: number,
): { start: number, end: number, orderBy: string } {
  if (range === '3d') {
    return {
      start: endTime - RANGE_TO_SECONDS['3d'],
      end: endTime,
      orderBy: 'last_touched DESC, replies DESC',
    }
  }

  if (range === '7d') {
    return {
      start: endTime - RANGE_TO_SECONDS['7d'],
      end: endTime - RANGE_TO_SECONDS['3d'],
      orderBy: 'replies DESC, last_touched DESC',
    }
  }

  return {
    start: endTime - RANGE_TO_SECONDS['30d'],
    end: endTime - RANGE_TO_SECONDS['7d'],
    orderBy: 'replies DESC, last_touched DESC',
  }
}

/**
 * HTTP 接口：根据时间档查询热门主题。
 *
 * 分桶策略：
 * - 近三日：按活跃时间排序，展示"正在讨论"的主题
 * - 3~7 天前 / 7~30 天前：按回复数排序，展示该时段内补看错过的高热主题
 *
 * Query 参数：
 * - range: 时间档（3d / 7d / 30d）
 * - limits: 返回条数（可选，覆盖档位默认值）
 * - expand: 展开状态（0/1），决定档位默认条数
 */
export async function queryHotTopics(
  db: D1Database,
  params: { range: HotTopicsRange | null, startTime: number, endTime: number, limits: number },
): Promise<{ success: boolean, result: HotTopicResult[], hasMore: boolean }> {
  const { range, startTime, endTime, limits } = params

  let rows: HotTopicRow[]
  let hasMore: boolean

  if (range) {
    const bucket = resolveBucket(range, endTime)

    // 多取一条用于判断 hasMore，再截断到 limits
    const { results } = await db
      .prepare(
        `SELECT id, title, replies, created, last_touched, member_username, member_avatar_mini
         FROM hot_topics
         WHERE last_touched >= ? AND last_touched < ?
         ORDER BY ${bucket.orderBy}
         LIMIT ?`,
      )
      .bind(bucket.start, bucket.end, limits + 1)
      .all<HotTopicRow>()

    hasMore = results.length > limits
    rows = results.slice(0, limits)
  }
  else {
    // 自定义时间窗口（无 range 语义）：按活跃时间排序，不做分桶去重
    const { results } = await db
      .prepare(
        `SELECT id, title, replies, created, last_touched, member_username, member_avatar_mini
         FROM hot_topics
         WHERE last_touched >= ? AND last_touched <= ?
         ORDER BY last_touched DESC, replies DESC
         LIMIT ?`,
      )
      .bind(startTime, endTime, limits + 1)
      .all<HotTopicRow>()

    hasMore = results.length > limits
    rows = results.slice(0, limits)
  }

  // 将数据库行转换为前端期望的格式
  // url 和 avatar_normal 在此处从存储字段动态推导
  const formattedResults: HotTopicResult[] = rows.map((row) => ({
    id: row.id,
    title: row.title,
    url: `https://www.v2ex.com/t/${row.id}`,
    replies: row.replies,
    created: row.created,
    member: {
      username: row.member_username,
      avatar_mini: row.member_avatar_mini,
      avatar_normal: deriveAvatarNormal(row.member_avatar_mini),
    },
  }))

  return {
    success: true,
    result: formattedResults,
    hasMore,
  }
}
