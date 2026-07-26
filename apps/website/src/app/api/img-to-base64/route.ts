import { type NextRequest, NextResponse } from 'next/server'
import { type InferInput, object, parse, string } from 'valibot'

import { proxyShareRequest } from '~/utils/share-upstream'

const RequestDataSchema = object({
  imgUrl: string(),
})

export type RequestData = InferInput<typeof RequestDataSchema>

export async function POST(request: NextRequest) {
  const body = parse(RequestDataSchema, await request.json())

  try {
    const upstreamData = await proxyShareRequest<{ data: string }>('/api/img-to-base64', body)

    if (upstreamData) {
      return NextResponse.json(upstreamData, { status: 200 })
    }

    const res = await fetch(body.imgUrl)
    const buffer = await res.arrayBuffer()
    const stringifiedBuffer = Buffer.from(buffer).toString('base64')
    const contentType = res.headers.get('content-type')!
    const base64 = `data:${contentType};base64,${stringifiedBuffer}`

    return NextResponse.json({ data: base64 }, { status: 200 })
  }
  catch (error) {
    console.error('Failed to convert image to base64:', error)

    return NextResponse.json({ data: '' }, { status: 500 })
  }
}
