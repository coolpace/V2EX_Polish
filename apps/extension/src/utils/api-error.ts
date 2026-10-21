import { isPlainObject } from './object'

/**
 * API 错误类型定义
 */
export interface ApiErrorOptions {
  /** 用户友好的错误消息 */
  message: string
  /** 原始错误，用于保留错误链 */
  cause?: unknown
  /** HTTP 状态码 */
  statusCode?: number
}

/**
 * 统一的 API 错误类
 * 继承自 Error，保留完整的错误链
 */
export class ApiError extends Error {
  readonly statusCode?: number

  constructor(options: ApiErrorOptions) {
    super(options.message, { cause: options.cause })
    this.name = 'ApiError'
    this.statusCode = options.statusCode
  }
}

/**
 * 判断错误是否为请求取消错误
 */
export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError'
}

/**
 * 包装 fetch 请求错误，提供用户友好的错误消息
 *
 * @param error - 原始错误
 * @param fallbackMessage - 默认的用户友好错误消息
 * @returns ApiError 实例
 */
export function wrapApiError(error: unknown, fallbackMessage: string): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (isAbortError(error)) {
    return new ApiError({
      message: '请求被取消',
      cause: error,
    })
  }

  if (error instanceof Error) {
    return new ApiError({
      message: fallbackMessage,
      cause: error,
    })
  }

  return new ApiError({
    message: fallbackMessage,
    cause: error,
  })
}

function extractErrorMessageFromPayload(payload: unknown): string | undefined {
  if (!isPlainObject(payload)) {
    return undefined
  }

  const message = payload.message

  if (typeof message === 'string' && message.trim()) {
    return message.trim()
  }

  const error = payload.error

  if (isPlainObject(error) && typeof error.message === 'string' && error.message.trim()) {
    return error.message.trim()
  }

  return undefined
}

export async function getResponseErrorMessage(
  response: Response,
  fallbackMessage: string,
): Promise<string> {
  const contentType = response.headers.get('content-type')?.toLowerCase() ?? ''
  let detail = ''

  try {
    if (contentType.includes('application/json')) {
      detail = extractErrorMessageFromPayload(await response.clone().json()) ?? ''
    }
  }
  catch {
    // ignore parsing errors and fall back to text / generic message
  }

  if (!detail) {
    try {
      const text = (await response.clone().text()).replace(/\s+/g, ' ').trim()

      if (text && !text.startsWith('<!DOCTYPE') && !text.startsWith('<html')) {
        detail = text.slice(0, 200)
      }
    }
    catch {
      // ignore body read errors and fall back to status code
    }
  }

  if (detail) {
    if (
      detail === fallbackMessage
      || detail.startsWith(`${fallbackMessage}：`)
      || detail.startsWith(`${fallbackMessage}:`)
    ) {
      return detail
    }

    return `${fallbackMessage}：${detail}`
  }

  return response.status
    ? `${fallbackMessage}（HTTP ${response.status}）`
    : fallbackMessage
}

/**
 * 从 HTTP 响应创建 API 错误
 *
 * @param response - fetch 响应对象
 * @param fallbackMessage - 默认的用户友好错误消息
 */
export async function createApiErrorFromResponse(
  response: Response,
  fallbackMessage: string,
): Promise<ApiError> {
  const message = await getResponseErrorMessage(response, fallbackMessage)

  return new ApiError({
    message,
    statusCode: response.status,
    cause: new Error(`${message} [HTTP ${response.status}: ${response.statusText}]`),
  })
}
