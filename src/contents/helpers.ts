import { defaultOptions, StorageKey } from '../constants'
import type { Options } from '../pages/option.type'
import type { PersonalAccessToken, StorageData, V2EX_RequestErrorResponce } from '../types'
import { replyTextArea } from './globals'

export function isV2EX_RequestError(error: any): error is V2EX_RequestErrorResponce {
  if ('cause' in error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const cause = error['cause']

    if ('success' in cause && 'message' in cause) {
      return (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        typeof cause['success'] === 'boolean' &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        !cause['success'] &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        typeof cause['message'] === 'string'
      )
    }
  }

  return false
}

/**
 * 获取用户设置存储的个人访问令牌。
 */
export function getPAT(): Promise<PersonalAccessToken> {
  return new Promise((resolve) => {
    if (typeof window.__V2P_PAT__ === 'string') {
      return resolve(window.__V2P_PAT__)
    } else {
      chrome.storage.sync.get(StorageKey.API, (result: StorageData) => {
        const PAT = result[StorageKey.API]?.pat
        window.__V2P_PAT__ = PAT
        resolve(PAT)
      })
    }
  })
}

/**
 * 转义 HTML 字符串中的特殊字符。
 */
export function escapeHTML(html: string) {
  return html
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, "'")
}

export function focusReplyInput() {
  if (replyTextArea instanceof HTMLTextAreaElement) {
    replyTextArea.focus()
  }
}

/**
 * 获取用户存储的自定义设置。
 */
export function getOptions(): Promise<Options> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(StorageKey.Options, (result: StorageData) => {
      const options = result[StorageKey.Options]

      if (options) {
        resolve({ ...defaultOptions, ...options })
      } else {
        resolve(defaultOptions)
      }
    })
  })
}
