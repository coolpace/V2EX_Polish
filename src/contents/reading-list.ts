import { createToast } from '../components/toast'
import { StorageKey } from '../constants'
import { getStorage, setStorage } from '../utils'

const url = $('head meta[property="og:url"]').prop('content')
const title = $('head meta[property="og:title"]').prop('content')
const content = $('head meta[property="og:description"]').prop('content')

if (!(typeof url === 'string' || typeof title === 'string' || typeof content === 'string')) {
  const message = '无法识别将该主题的元数据'
  createToast({ message })
  throw new Error(message)
}

void (async () => {
  const storage = await getStorage()

  const currentData = storage[StorageKey.ReadingList]?.data || []
  const exist = currentData.findIndex((it) => it.url === url) !== -1

  if (exist) {
    createToast({ message: '该主题已存在于稍后阅读' })
  } else {
    await setStorage(StorageKey.ReadingList, {
      data: [
        { url, title: (title as string).replace(' - V2EX', ''), content, addedTime: Date.now() },
        ...currentData,
      ],
    })

    createToast({ message: '📖 已添加进稍后阅读' })
  }
})()
