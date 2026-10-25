import { Client } from '@notionhq/client'
import type { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { get } from 'radash'

export const dynamic = 'force-dynamic'

export interface DonationData {
  /** 捐赠者名称，不填则表示匿名 */
  from?: string
  /** 金额，单位：元 */
  money: string
  /** 时间，格式：YYYY/MM/DD */
  time: string
  /** 留言，不填则表示没有留言 */
  message?: string
  /** 捐赠方式 */
  channel: '微信赞赏' | '微信转账' | '支付宝转账'
}

export async function GET() {
  if (!process.env.NOTION_KEY || !process.env.NOTION_DATABASE_ID) {
    return Response.json({ error: 'Notion API 密钥或数据库 ID 未设置' }, { status: 500 })
  }

  const notion = new Client({
    auth: process.env.NOTION_KEY,
  })

  try {
    const res = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
    })

    const donationList: DonationData[] = (res.results as DatabaseObjectResponse[])
      .reduce<DonationData[]>((acc, item) => {
        const from = get(item.properties, '赞赏人名称.title[0].plain_text')
        const money = get(item.properties, '金额.number')
        const time = get(item.properties, '时间.date.start')
        const message = get(item.properties, '留言.rich_text[0].plain_text')
        const channel = get(item.properties, '赞赏方式.select.name')

        if (typeof money === 'number' && money > 0 && time) {
          acc.push({
            from: from as string,
            money: money.toString(),
            time: time as string,
            channel: channel as '微信赞赏' | '微信转账' | '支付宝转账',
            message: message as string,
          })
        }

        return acc
      }, [])
      .sort((a, b) => {
        const dateA = new Date(a.time)
        const dateB = new Date(b.time)

        return dateB.getTime() - dateA.getTime()
      })

    return Response.json(donationList)
  }
  catch {
    return Response.json({ error: '获取 Notion 数据失败' }, { status: 500 })
  }
}
