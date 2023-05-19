import { createToast } from '../components/toast'
import { StorageKey } from '../constants'
import type { Member, MemberTag, ReadingItem, Tag, V2EX_RequestErrorResponce } from '../types'
import { getRunEnv, getStorage, setStorage } from '../utils'
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

export async function setMemberTags(memberName: Member['username'], tags: Tag[] | undefined) {
  const storage = await getStorage(false)
  const tagData = storage[StorageKey.MemberTag]

  const runEnv = getRunEnv()

  if (runEnv !== 'chrome') {
    return
  }

  if (tags && tags.length > 0) {
    const newTagData: MemberTag = { ...tagData, [memberName]: { tags } }

    await setStorage(StorageKey.MemberTag, newTagData)
  } else {
    if (tagData && Reflect.has(tagData, memberName)) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete tagData[memberName]
      await setStorage(StorageKey.MemberTag, tagData)
    }
  }
}

export async function addToReadingList(params: Pick<ReadingItem, 'url' | 'title' | 'content'>) {
  const { url, title, content } = params

  if (!(typeof url === 'string' || typeof title === 'string' || typeof content === 'string')) {
    const message = '无法识别将该主题的元数据'
    createToast({ message })
    throw new Error(message)
  }

  const storage = await getStorage()

  const currentData = storage[StorageKey.ReadingList]?.data || []
  const exist = currentData.findIndex((it) => it.url === url) !== -1

  if (exist) {
    createToast({ message: '该主题已存在于稍后阅读' })
  } else {
    await setStorage(StorageKey.ReadingList, {
      data: [
        { url, title: title.replace(' - V2EX', ''), content, addedTime: Date.now() },
        ...currentData,
      ],
    })

    createToast({ message: '📖 已添加进稍后阅读' })
  }
}
