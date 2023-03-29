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
      children: '进入主题',
      className: 'special',
      tag: 'a',
    }).prop('target', '_blank')

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

      $('<button class="v2p-topic-preview-btn">预览</button>')
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

                const $topicPreview = $('<div class="v2p-topic-preview">')

                if (topic.content_rendered) {
                  $topicPreview.append(`<div>${topic.content_rendered}</div>`)
                } else {
                  $topicPreview.append(`
                  <div class="v2p-empty-content">
                    <div class="v2p-text-emoji">¯\\_(ツ)_/¯</div>
                    <p>该主题没有正文内容</p>
                  </div>
                  `)
                }

                $detailBtn.show().prop('href', topic.url)

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
