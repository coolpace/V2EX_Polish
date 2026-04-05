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
const RANGE_TO_SECONDS = {
  '3d': 3 * 86400,
  '7d': 7 * 86400,
  '30d': 30 * 86400,
} as const

export type HotTopicsRange = keyof typeof RANGE_TO_SECONDS

function isHotTopicsRange(value: string): value is HotTopicsRange {
  return value in RANGE_TO_SECONDS
}

function getAlignedCurrentTime(): number {
  const now = Math.floor(Date.now() / 1000)

  return now - now % 300
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
}): { startTime: number, endTime: number, limits: number, range: HotTopicsRange | null } | string {
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

  const limits = params.limits ?? 8

  if (!Number.isInteger(limits) || limits < MIN_LIMITS || limits > MAX_LIMITS) {
    return `limits 必须为 ${MIN_LIMITS}-${MAX_LIMITS} 之间的整数`
  }

  return {
    startTime: start,
    endTime: end,
    limits,
    range: params.range && isHotTopicsRange(params.range) ? params.range : null,
  }
}

/** 短窗口阈值：3 天（秒）。窗口 ≤ 此值时按活跃时间排序，> 此值时按回复数排序并排除短窗口结果。 */
const SHORT_WINDOW_SECONDS = 3 * 86400

/**
 * HTTP 接口：根据活跃时间范围查询热门主题。
 *
 * 排序策略（分层）：
 * - 短窗口（≤ 3 天）：按活跃时间排序，展示"正在讨论"的主题
 * - 长窗口（> 3 天）：排除近三日的 top 结果，按回复数排序，
 *   展示该时段内讨论热度最高但不在短窗口榜单中的主题，
 *   确保用户切换时间段时看到差异化的内容
 *
 * Query 参数：
 * - startTime: 活跃开始时间（秒）
 * - endTime: 活跃结束时间（秒）
 * - limits: 返回条数，默认 8，范围 1-50
 */
export async function queryHotTopics(
  db: D1Database,
  params: { startTime: number, endTime: number, limits: number },
): Promise<{ success: boolean, result: HotTopicResult[] }> {
  const { startTime, endTime, limits } = params
  const windowSize = endTime - startTime

  let results: HotTopicRow[]

  if (windowSize <= SHORT_WINDOW_SECONDS) {
    // 短窗口：按活跃时间排序，优先展示最近仍有讨论活动的主题
    const { results: rows } = await db
      .prepare(
        `SELECT id, title, replies, created, last_touched, member_username, member_avatar_mini
         FROM hot_topics
         WHERE last_touched >= ? AND last_touched <= ?
         ORDER BY last_touched DESC, replies DESC
         LIMIT ?`,
      )
      .bind(startTime, endTime, limits)
      .all<HotTopicRow>()

    results = rows
  }
  else {
    // 长窗口：排除近三日的 top 结果，按回复数排序
    // 子查询找出近三日内按活跃时间排名前 N 的主题 ID，外层查询将其排除
    // 这样近七日/近一月的结果与近三日保证零重复
    const recentStart = endTime - SHORT_WINDOW_SECONDS

    const { results: rows } = await db
      .prepare(
        `SELECT id, title, replies, created, last_touched, member_username, member_avatar_mini
         FROM hot_topics
         WHERE last_touched >= ? AND last_touched <= ?
           AND id NOT IN (
             SELECT id FROM hot_topics
             WHERE last_touched >= ? AND last_touched <= ?
             ORDER BY last_touched DESC, replies DESC
             LIMIT ?
           )
         ORDER BY replies DESC, last_touched DESC
         LIMIT ?`,
      )
      .bind(startTime, endTime, recentStart, endTime, limits, limits)
      .all<HotTopicRow>()

    results = rows
  }

  // 将数据库行转换为前端期望的格式（保持与原 AirCode 接口兼容）
  // url 和 avatar_normal 在此处从存储字段动态推导
  const formattedResults: HotTopicResult[] = results.map((row) => ({
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
  }
}
