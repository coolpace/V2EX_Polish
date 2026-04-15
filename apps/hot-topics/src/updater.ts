interface V2EXTopic {
  id: number
  title: string
  url: string
  content: string
  content_rendered: string
  replies: number
  created: number
  last_touched: number
  last_modified: number
  last_reply_by: string
  member: {
    id: number
    username: string
    url: string
    avatar_mini: string
    avatar_normal: string
    avatar_large: string
  }
  node: {
    id: number
    title: string
    name: string
    url: string
  }
}

/** 数据保留天数，超过此时间的旧数据将被清理。 */
const DATA_RETENTION_DAYS = 60

/** fetch 重试相关配置 */
const MAX_RETRIES = 3
const RETRY_BASE_DELAY_MS = 1000

/**
 * 带重试的 fetch，仅对 5xx 服务端错误进行重试，使用指数退避策略。
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = MAX_RETRIES,
): Promise<Response> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const res = await fetch(url, options)

    if (res.ok) {
      return res
    }

    // 仅对服务端错误（5xx）进行重试，客户端错误（4xx）直接抛出
    if (attempt < maxRetries && res.status >= 500) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_BASE_DELAY_MS * attempt))
      continue
    }

    throw new Error(`V2EX API 请求失败: ${res.status} ${res.statusText} (第 ${attempt}/${maxRetries} 次尝试)`)
  }

  // 理论上不可达，TypeScript 需要此行保证返回类型完整
  throw new Error('fetchWithRetry: 超出最大重试次数')
}

/**
 * Cron Trigger：定时从 V2EX API 拉取热门主题并存入 D1 数据库。
 *
 * 逻辑说明：
 * 1. 从 V2EX API 获取当前热门主题列表（含重试机制）
 * 2. 使用 UPSERT 批量写入（新主题插入，已有主题更新回复数和标题等字段）
 * 3. 清理超过保留期限的非活跃旧数据
 */
export async function updateHotTopics(
  db: D1Database,
): Promise<{ upserted: number, cleaned: number }> {
  const res = await fetchWithRetry('https://www.v2ex.com/api/topics/hot.json', {
    headers: {
      'User-Agent': 'V2EX-Polish/1.0 (https://github.com/coolpace/V2EX_Polish)',
    },
  })

  const topics: V2EXTopic[] = await res.json()

  if (!Array.isArray(topics) || topics.length === 0) {
    return { upserted: 0, cleaned: 0 }
  }

  // 过滤掉推广/广告类主题，避免此类内容进入数据库
  const filteredTopics = topics.filter((tp) => {
    // 通过节点名称判断
    if (tp.node.name === 'promotions') {
      return false
    }

    // 通过节点 URL 判断
    if (tp.node.url.includes('/go/promotions')) {
      return false
    }

    // 通过主题内容中的推广节点链接判断
    if (
      tp.content.includes('/go/promotions')
      || tp.content_rendered.includes('/go/promotions')
    ) {
      return false
    }

    return true
  })

  if (filteredTopics.length === 0) {
    return { upserted: 0, cleaned: 0 }
  }

  // 使用 UPSERT 批量写入，避免先查询全表再判断的开销
  // 不存储 url（可由 id 拼接）和 member_avatar_normal（可由 mini 推导）
  const upsertStmt = db.prepare(
    `INSERT INTO hot_topics (id, title, replies, created, last_touched, member_username, member_avatar_mini)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       title = excluded.title,
       replies = excluded.replies,
       last_touched = excluded.last_touched,
       member_avatar_mini = excluded.member_avatar_mini`,
  )

  const upsertBatch = filteredTopics.map((tp) =>
    upsertStmt.bind(
      tp.id,
      tp.title,
      tp.replies,
      tp.created,
      tp.last_touched,
      tp.member.username,
      tp.member.avatar_mini,
    ),
  )

  await db.batch(upsertBatch)

  // 清理超过保留期限的非活跃旧数据，避免仍在热议的老主题被误删
  const cutoffTime = Math.floor(Date.now() / 1000) - DATA_RETENTION_DAYS * 86400
  const cleanResult = await db
    .prepare('DELETE FROM hot_topics WHERE last_touched < ?')
    .bind(cutoffTime)
    .run()

  const cleaned = cleanResult.meta.changes ?? 0

  return { upserted: filteredTopics.length, cleaned }
}
