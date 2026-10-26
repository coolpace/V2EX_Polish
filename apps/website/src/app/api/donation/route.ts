export const dynamic = 'force-dynamic'

export interface DonationData {
  /** 捐赠者名称，不填则表示匿名 */
  from?: string
  /** 金额，单位：元 */
  money: string
  /** 时间，格式：YYYY-MM-DD */
  time: string
  /** 留言，不填则表示没有留言 */
  message?: string
  /** 捐赠方式，如：微信赞赏、微信转账、支付宝转账 */
  channel: string
}

/** 飞书开放平台接口地址。 */
const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis'

/** 单次请求超时，避免上游无响应时把函数拖到平台超时。 */
const FETCH_TIMEOUT_MS = 8000

/** 多维表格列表接口的单页上限。 */
const PAGE_SIZE = 500

/** 赞赏记录变化不频繁，缓存 60 秒以减少对开放平台的调用（多维表格接口有频率限制）。 */
const LIST_CACHE_SECONDS = 60

/** 提前 5 分钟判定租户令牌过期，避免边界时刻拿着失效令牌请求。 */
const TOKEN_EXPIRE_MARGIN_SECONDS = 300

/** 认证类错误码：命中后立即清空令牌缓存，让下次请求重新换取。 */
const AUTH_ERROR_CODES = new Set([99991661, 99991663, 99991668])

/** 多维表格字段名，与表内列名保持一致。 */
const FIELD = {
  from: '赞赏人名称',
  money: '金额（元）',
  time: '时间',
  message: '留言',
  channel: '赞赏方式',
} as const

/** 时间列统一按东八区展示，避免直接取 UTC 导致日期差一天。 */
const DATE_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

/** Date 能表示的最大毫秒值，超出后格式化会抛 RangeError。 */
const MAX_TIMESTAMP = 8_640_000_000_000_000

interface BitableRecord {
  /** 只声明用到的字段；单元格值形态不固定，统一按 unknown 处理。 */
  fields: Record<string, unknown>
}

interface BitableListResponse {
  code: number
  msg: string
  data?: {
    has_more?: boolean
    page_token?: string
    items?: BitableRecord[]
  }
}

interface TenantAccessTokenResponse {
  code: number
  msg: string
  tenant_access_token?: string
  expire?: number
}

/** 模块级缓存，Serverless 场景下同一实例内的后续请求可复用。 */
let tokenCache: { value: string, expiresAt: number } | null = null
let listCache: { value: DonationData[], expiresAt: number } | null = null

/** 只认字符串，其余类型一律当作空文本，避免 [object Object] 之类的脏值。 */
function readString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

/** 文本单元格归一化：兼容纯字符串与富文本分段数组两种返回形态。 */
function textOf(cell: unknown): string | undefined {
  const text = Array.isArray(cell) ? cell.map(segmentTextOf).join('') : readString(cell)

  return text.trim() || undefined
}

/** 富文本分段归一化，只取分段里的文本内容。 */
function segmentTextOf(segment: unknown): string {
  if (typeof segment === 'object' && segment !== null && 'text' in segment) {
    return readString((segment as { text?: unknown }).text)
  }

  return readString(segment)
}

/** 数字单元格归一化：接口通常返回 number，个别字段（如金额）会返回字符串。 */
function numberOf(cell: unknown): number | undefined {
  if (typeof cell === 'number') {
    return cell
  }

  if (typeof cell === 'string' && cell.trim() !== '') {
    const value = Number(cell)

    return Number.isNaN(value) ? undefined : value
  }

  return undefined
}

/** 日期单元格归一化：接口返回毫秒时间戳，兼容 ISO 字符串。 */
function dateOf(cell: unknown): { timestamp: number, text: string } | undefined {
  const timestamp = numberOf(cell) ?? (typeof cell === 'string' ? Date.parse(cell) : Number.NaN)

  if (!Number.isFinite(timestamp) || timestamp <= 0 || timestamp > MAX_TIMESTAMP) {
    return undefined
  }

  return { timestamp, text: DATE_FORMATTER.format(new Date(timestamp)) }
}

async function getTenantAccessToken(appId: string, appSecret: string): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.value
  }

  const res = await fetch(`${FEISHU_API_BASE}/auth/v3/tenant_access_token/internal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`获取租户令牌失败: ${res.status}`)
  }

  const data = await res.json() as TenantAccessTokenResponse

  if (data.code !== 0 || !data.tenant_access_token) {
    throw new Error(`获取租户令牌失败: ${data.msg}`)
  }

  const token = data.tenant_access_token
  const ttl = Math.max((data.expire ?? 7200) - TOKEN_EXPIRE_MARGIN_SECONDS, 0) * 1000

  tokenCache = { value: token, expiresAt: Date.now() + ttl }

  return token
}

/** 逐页拉取全部记录。 */
async function fetchAllRecords(
  token: string,
  appToken: string,
  tableId: string,
): Promise<BitableRecord[]> {
  const records: BitableRecord[] = []
  let pageToken: string | undefined

  do {
    const url = new URL(`${FEISHU_API_BASE}/bitable/v1/apps/${appToken}/tables/${tableId}/records`)

    url.searchParams.set('page_size', String(PAGE_SIZE))

    if (pageToken) {
      url.searchParams.set('page_token', pageToken)
    }

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      cache: 'no-store',
    })

    if (!res.ok) {
      throw new Error(`查询多维表格失败: ${res.status}`)
    }

    const data = await res.json() as BitableListResponse

    if (data.code !== 0) {
      if (AUTH_ERROR_CODES.has(data.code)) {
        tokenCache = null
      }

      throw new Error(`查询多维表格失败: ${data.code} ${data.msg}`)
    }

    records.push(...data.data?.items ?? [])
    pageToken = data.data?.has_more ? data.data.page_token : undefined
  } while (pageToken)

  return records
}

function toDonationList(records: BitableRecord[]): DonationData[] {
  return records
    .flatMap((record) => {
      const money = numberOf(record.fields[FIELD.money])
      const time = dateOf(record.fields[FIELD.time])

      if (typeof money !== 'number' || money <= 0 || !time) {
        return []
      }

      return [
        {
          createdAt: time.timestamp,
          data: {
            from: textOf(record.fields[FIELD.from]),
            money: money.toString(),
            time: time.text,
            message: textOf(record.fields[FIELD.message]),
            channel: textOf(record.fields[FIELD.channel]) ?? '',
          },
        },
      ]
    })
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((item) => item.data)
}

export async function GET() {
  const appId = process.env.FEISHU_APP_ID
  const appSecret = process.env.FEISHU_APP_SECRET
  const appToken = process.env.FEISHU_BITABLE_APP_TOKEN
  const tableId = process.env.FEISHU_BITABLE_TABLE_ID

  if (!appId || !appSecret || !appToken || !tableId) {
    return Response.json({ error: '飞书应用凭证或多维表格 ID 未设置' }, { status: 500 })
  }

  if (listCache && listCache.expiresAt > Date.now()) {
    return Response.json(listCache.value)
  }

  try {
    const token = await getTenantAccessToken(appId, appSecret)
    const records = await fetchAllRecords(token, appToken, tableId)
    const donationList = toDonationList(records)

    // 表里有记录却一条都解析不出来，几乎必然是字段名或字段类型变了。
    // 直接报错而不是静默降级成空数组，避免页面显示「暂无赞赏记录」还无从排查。
    if (records.length > 0 && donationList.length === 0) {
      throw new Error(`赞赏记录解析结果为空，请检查字段名: ${Object.values(FIELD).join('、')}`)
    }

    listCache = { value: donationList, expiresAt: Date.now() + LIST_CACHE_SECONDS * 1000 }

    return Response.json(donationList)
  }
  catch (error) {
    console.error('Failed to fetch donation list:', error)

    return Response.json({ error: '获取飞书多维表格数据失败' }, { status: 500 })
  }
}
