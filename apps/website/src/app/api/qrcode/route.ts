import { type NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import {
  type InferInput,
  integer,
  maxLength,
  maxValue,
  minLength,
  minValue,
  number,
  object,
  parse,
  pipe,
  regex,
  string,
} from 'valibot'

const ColorSchema = pipe(string(), regex(/^(?:#[0-9a-fA-F]{3}|#[0-9a-fA-F]{4}|#[0-9a-fA-F]{6}|#[0-9a-fA-F]{8})$/))

const RequestDataSchema = object({
  text: pipe(string(), minLength(1), maxLength(2048)),
  options: object({
    width: pipe(number(), integer(), minValue(64), maxValue(1024)),
    margin: pipe(number(), integer(), minValue(0), maxValue(16)),
    color: object({
      dark: ColorSchema,
      light: ColorSchema,
    }),
  }),
})

export type RequestData = InferInput<typeof RequestDataSchema>

export interface ResponseJson {
  data: string
}

export async function POST(request: NextRequest) {
  let body: RequestData

  try {
    body = parse(RequestDataSchema, await request.json())
  }
  catch {
    return NextResponse.json({ data: '' }, { status: 400 })
  }

  try {
    const url = await QRCode.toDataURL(body.text, body.options)

    return NextResponse.json({ data: url } satisfies ResponseJson, { status: 200 })
  }
  catch (error) {
    console.error('Failed to generate QR code:', error)

    return NextResponse.json({ data: '' }, { status: 500 })
  }
}
