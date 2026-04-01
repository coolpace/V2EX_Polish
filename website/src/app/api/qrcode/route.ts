import { type NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { type InferInput, number, object, parse, string } from 'valibot'

const RequestDataSchema = object({
  text: string(),
  options: object({
    width: number(),
    margin: number(),
    color: object({
      dark: string(),
      light: string(),
    }),
  }),
})

export type RequestData = InferInput<typeof RequestDataSchema>

export interface ResponseJson {
  data: string
}

export async function POST(request: NextRequest) {
  const body = parse(RequestDataSchema, await request.json())

  const url = await QRCode.toDataURL(body.text, body.options)

  return NextResponse.json<ResponseJson>({ data: url }, { status: 200 })
}
