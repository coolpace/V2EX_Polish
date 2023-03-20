import { StorageKey } from '../../constants'
import { iconLoading } from '../../icons'
import { fetchTopic } from '../../services'
import type { StorageData } from '../../types'
import { $topicList, createButton, createModel } from '../globals'

export function handlingTopicList() {
  chrome.storage.sync.get(StorageKey.API, (result: StorageData) => {
    const PAT = result[StorageKey.API]?.pat

    if (!PAT) {
      return
    }

    let abortController: AbortController | null = null

    const $detailBtn = createButton({
      children: '<a target="_blank">进入主题</a>',
      className: 'special',
    })

    const model = createModel({
      root: $('body'),
      onMount: ({ $actions }) => {
        $actions.prepend($detailBtn)
      },
      onClose: ({ $title, $content }) => {
        $title.empty()
        $content.empty()
        abortController?.abort()
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
                abortController = new AbortController()

                model.open()

                $detailBtn.hide()

                model.$title.empty().text('...')

                model.$content.empty().append(`
                <div class="v2p-model-loading">
                  <div class="v2p-icon-loading">${iconLoading}</div>
                </div>
                `)

                const { result: topic } = await fetchTopic(topicId, PAT, {
                  signal: abortController.signal,
                })

                const $topicPreview = $(`
                <div class="v2p-topic-preview">
                  <div>${topic.content_rendered}</div>
                </div>
                `)

                $detailBtn.show().find('> a').prop('href', topic.url)

                model.$title.empty().text(topic.title)
                model.$content.empty().append($topicPreview)
              } catch (err) {
                console.error(err)
              }
            })()
          }
        })
        .appendTo($topicItem.find('.item_title'))
    })
  })
}
