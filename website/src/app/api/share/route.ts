import { type NextRequest, NextResponse } from 'next/server'
import { load } from 'cheerio'
import { array, type Input, nullish, number, object, parse, string } from 'valibot'

const RequestDataSchema = object({
  topicId: string(),
})

export type RequestData = Input<typeof RequestDataSchema>

const TopicInfoSchema = object({
  title: string(),
  content: nullish(string()),
  supplements: nullish(array(object({ content: string() }))),
  member: object({
    username: string(),
    avatar: string(),
  }),
  time: object({
    year: number(),
    month: number(),
    day: number(),
  }),
  url: string(),
})

export type TopicInfo = Input<typeof TopicInfoSchema>

export const enum ResponseCode {
  Success,
  /** 由于不存在主题或需要授权访问，无法爬取到主题内容。 */
  NotFound,
}

export type ResponseJson =
  | {
      code: ResponseCode.Success
      data: TopicInfo
    }
  | {
      code: ResponseCode.NotFound
      data: null
    }

export async function POST(request: NextRequest) {
  const body = parse(RequestDataSchema, await request.json())

  const url = `https://www.v2ex.com/t/${body.topicId}`
  const res = await fetch(url, { method: 'GET' })
  const htmlText = await res.text()

  const $ = load(htmlText)
  const title = $('.header h1').text()
  const content = $('.topic_content').html()

  if (!title && !content) {
    return NextResponse.json<ResponseJson>(
      { code: ResponseCode.NotFound, data: null },
      { status: 200 }
    )
  }

  let supplements: TopicInfo['supplements'] = null
  const $subtles = $('.subtle .topic_content')
  if ($subtles.length > 1) {
    supplements = []
    $subtles.each((_: number, ele: any) => {
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
