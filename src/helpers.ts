import { createToast } from './components/toast'
import { StorageKey } from './constants'
import type { ReadingItem, StorageSettings } from './types'
import { getStorage, setStorage } from './utils'

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

export function isValidSettings(settings: any): settings is StorageSettings {
  return !!settings && typeof settings === 'object' && StorageKey.Options in settings
}
