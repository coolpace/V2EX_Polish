import { type NextRequest, NextResponse } from 'next/server'
import { load } from 'cheerio'
import { parse } from 'valibot'

import { proxyShareRequest } from '~/utils/share-upstream'

import { ResponseCode } from './constants'
import { type RequestData, RequestDataSchema, type ResponseJson, type TopicInfo, TopicInfoSchema } from './schema'

/** 单次抓取超时，避免上游无响应时把函数拖到平台超时。 */
const FETCH_TIMEOUT_MS = 8000

/** 主题内容变化不频繁，缓存 5 分钟以减少对 V2EX 的重复抓取。 */
const SHARE_CACHE_SECONDS = 300

export async function POST(request: NextRequest) {
  let body: RequestData

  try {
    body = parse(RequestDataSchema, await request.json())
  }
  catch {
    return NextResponse.json<ResponseJson>(
      { code: ResponseCode.NotFound, data: null },
      { status: 400 },
    )
  }

  try {
    const upstreamData = await proxyShareRequest<ResponseJson>('/api/share', body)

    if (upstreamData) {
      return NextResponse.json<ResponseJson>(upstreamData, { status: 200 })
    }

    const url = `https://www.v2ex.com/t/${body.topicId}`
    const res = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      next: { revalidate: SHARE_CACHE_SECONDS },
    })

    if (!res.ok) {
      return NextResponse.json<ResponseJson>(
        { code: ResponseCode.NotFound, data: null },
        { status: 200 },
      )
    }

    const htmlText = await res.text()

    const $ = load(htmlText)
    const title = $('.header h1').text()
    const content = $('.topic_content').html()

    if (!title && !content) {
      return NextResponse.json<ResponseJson>(
        { code: ResponseCode.NotFound, data: null },
        { status: 200 },
      )
    }

    let supplements: TopicInfo['supplements'] = null
    const $subtles = $('.subtle .topic_content')

    if ($subtles.length > 1) {
      supplements = []
      $subtles.each((_, ele) => {
        supplements!.push({ content: $(ele).html()! })
      })
    }

    const timeString = $('.header .gray span[title^="20"]').prop('title')
    const date = new Date(timeString)
    const time = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    }
    const member = {
      username: $('.header .gray a[href^="/member"]').text(),
      avatar: $('.header .avatar').prop('src'),
    }

    const data = parse(TopicInfoSchema, {
      title,
      content,
      supplements,
      member,
      time,
      url,
    })

    return NextResponse.json<ResponseJson>({ code: ResponseCode.Success, data }, { status: 200 })
  }
  catch (error) {
    console.error('Failed to fetch topic info:', error)

    return NextResponse.json<ResponseJson>(
      { code: ResponseCode.NotFound, data: null },
      { status: 200 },
    )
  }
}
