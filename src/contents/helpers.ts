import { StorageKey } from '../constants'
import type { Member, MemberTag, StorageData, Tag, V2EX_RequestErrorResponce } from '../types'
import { getRunEnv } from '../utils'
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

export function focusReplyInput() {
  if (replyTextArea instanceof HTMLTextAreaElement) {
    replyTextArea.focus()
  }
}

/**
 * 插入文本至回复输入框中并聚焦输入框，处理了光标位置。
 */
export function insertTextToReplyInput(text: string) {
  if (replyTextArea instanceof HTMLTextAreaElement) {
    const startPos = replyTextArea.selectionStart
    const endPos = replyTextArea.selectionEnd

    const valueToStart = replyTextArea.value.substring(0, startPos)
    const valueFromEnd = replyTextArea.value.substring(endPos, replyTextArea.value.length)
    replyTextArea.value = `${valueToStart}${text}${valueFromEnd}`

    focusReplyInput()

    replyTextArea.selectionStart = replyTextArea.selectionEnd = startPos + text.length
  }
}

export async function getMemberTags(): Promise<MemberTag | undefined> {
  return new Promise((resolve) => {
    const runEnv = getRunEnv()

    if (runEnv !== 'chrome') {
      return resolve(undefined)
    }

    chrome.storage.sync.get(StorageKey.MemberTag, (result: StorageData) => {
      const memberTag = result[StorageKey.MemberTag]
      resolve(memberTag)
    })
  })
}

export async function setMemberTags(memberName: Member['username'], tags: Tag[]) {
  const runEnv = getRunEnv()

  if (runEnv !== 'chrome') {
    return
  }

  await chrome.storage.sync.set({
    [StorageKey.MemberTag]: tags,
  })
}
