import { type InferInput, object, string } from 'valibot'

export const RequestDataSchema = object({
  imgUrl: string(),
})

export type RequestData = InferInput<typeof RequestDataSchema>
