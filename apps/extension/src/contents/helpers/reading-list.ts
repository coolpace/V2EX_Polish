import { createToast } from '../../components/toast'
import { READING_CONTENT_LIMIT, StorageKey } from '../../constants'
import type { ReadingItem } from '../../types'
import { getStorage, setStorage, sleep } from '../../utils'

/**
 * 将主题添加到稍后阅读清单。
 */
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
  }
  else {
    if (window.__V2P_AddingReading !== true) {
      window.__V2P_AddingReading = true

      try {
        await setStorage(StorageKey.ReadingList, {
          data: [
            {
              url,
              title: title.replace(' - V2EX', ''),
              content:
                content.length > READING_CONTENT_LIMIT
                  ? content.substring(0, READING_CONTENT_LIMIT) + '...'
                  : content,
              addedTime: Date.now(),
            },
            ...currentData,
          ],
        })

        createToast({ message: '✅ 已添加进稍后阅读' })

        // 加入延时等待，防止连续触发添加操作。
        await sleep(500)
      }
      finally {
        window.__V2P_AddingReading = false
      }
    }
  }
}
