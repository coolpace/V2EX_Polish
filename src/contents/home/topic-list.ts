import { StorageKey } from '../../constants'
import { fetchTopic } from '../../services'
import type { StorageData } from '../../types'
import { $topicList, createModel } from '../globals'

export function handlingTopicList() {
  chrome.storage.sync.get(StorageKey.API, (result: StorageData) => {
    const PAT = result[StorageKey.API]?.pat

    if (!PAT) {
      return
    }

    const model = createModel({
      root: $('body'),
      title: '话题预览',
      onClose: ({ $modelContent }) => {
        $modelContent.empty()
      },
    })

    $topicList.each((_, topicItem) => {
      const $topicItem = $(topicItem)

      $(`<button class="v2p-topic-preview-btn">预览</button>`)
        .on('click', () => {
          const linkHref = $topicItem.find('.topic-link').attr('href')
          const match = linkHref?.match(/\/(\d+)#/)
          const topicId = match?.at(1)

          if (topicId) {
            void (async () => {
              try {
                model.open()

                const data = await fetchTopic(topicId, PAT)
                const topic = data.result
                const $topicPreview = $(`
                <div class="v2p-topic-preview">
                  <div class="v2p-topic-preview__title">${topic.title}</div>
                  <div class="v2p-topic-preview__content">${topic.content_rendered}</div>
                </div>
                `)

                model.$modelContent.append($topicPreview)
              } catch (err) {
                console.error(err)
              }
            })()
          }
        })
        .appendTo($topicItem.find('.topic-link'))
    })
  })
}
