import { StorageKey } from '../../constants'
import { fetchTopic } from '../../services'
import type { StorageData } from '../../types'
import { $topicList } from '../globals'

export function handlingTopicList() {
  chrome.storage.sync.get(StorageKey.API, (result: StorageData) => {
    console.log({ result })
    const PAT = result[StorageKey.API]?.pat

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
                console.error(err)
              })
          }
        })
        .prependTo($topicItem.find('.topic_info'))
    })
  })
}
