import { type NextRequest, NextResponse } from 'next/server'
import { type Input, object, parse, string } from 'valibot'

const RequestDataSchema = object({
  imgUrl: string(),
})

export type RequestData = Input<typeof RequestDataSchema>

export async function POST(request: NextRequest) {
  const body = parse(RequestDataSchema, await request.json())

  const res = await fetch(body.imgUrl)
  const buffer = await res.arrayBuffer()
  const stringifiedBuffer = Buffer.from(buffer).toString('base64')
  const contentType = res.headers.get('content-type')
  const base64 = `data:${contentType};base64,${stringifiedBuffer}`

  return NextResponse.json({ data: base64 }, { status: 200 })
}
