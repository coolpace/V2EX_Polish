import { array, type InferInput, nullish, number, object, pipe, regex, string } from 'valibot'

import type { ResponseCode } from './constants'

export const RequestDataSchema = object({
  topicId: pipe(string(), regex(/^\d+$/)),
})

export type RequestData = InferInput<typeof RequestDataSchema>

export const TopicInfoSchema = object({
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

export type TopicInfo = InferInput<typeof TopicInfoSchema>

export type ResponseJson
  = | {
    code: ResponseCode.Success
    data: TopicInfo
  }
  | {
    code: ResponseCode.NotFound
    data: null
  }
