import { StorageKey, V2EX } from '../../constants'
import type { DataWrapper, StorageData, Topic } from '../../types'
import { $topicList } from '../globals'

async function fetchTopic(topicId: string, PAT: string) {
  const res = await fetch(`${V2EX.APIV2}/topics/${topicId}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${PAT}` },
  })

  // const limit = res.headers.get('X-Rate-Limit-Limit')
  // const reset = res.headers.get('X-Rate-Limit-Reset')
  // const remaining = res.headers.get('X-Rate-Limit-Remaining')

  const data = (await res.json()) as DataWrapper<Topic>
  console.log(data)

  return data
}

export function handlingTopicList() {
  chrome.storage.sync.get(StorageKey.Options, (result: StorageData) => {
    const PAT = result.options?.[StorageKey.OptPAT]

    if (!PAT) {
      return
    }

    $topicList.each((_, topicItem) => {
      const $topicItem = $(topicItem)

      $(`<button class="v2p-topic-preview-btn">预览</button>`)
        .on('click', () => {
          const linkPath = $topicItem.find('.topic-link').attr('href')
          const match = linkPath?.match(/\/(\d+)#/)

          if (match) {
            const topicId = match[1]

            fetchTopic(topicId, PAT)
              .then((data) => {
                const topic = data.result
                const $topicPreview = $(`
                <div class="v2p-topic-preview">
                  <div class="v2p-topic-preview__title">${topic.title}</div>
                  <div class="v2p-topic-preview__content">${topic.content_rendered}</div>
                </div>
                `)
                $topicPreview.appendTo($topicItem)
              })
              .catch((err) => {
                console.log(err)
              })
          }
        })
        .prependTo($topicItem.find('.topic_info'))
    })
  })
}
