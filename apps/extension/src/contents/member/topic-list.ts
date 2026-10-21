import { createToast } from '../../components/toast'
import { StorageKey, V2EX } from '../../constants'
import { crawlTopicPage } from '../../services'
import { getStorageSync, isBrowserExtension } from '../../utils'
import { $topicList } from '../globals'
import { createTopicPreview } from '../topic/preview'

interface HandleTopicListParams {
  /** 是否为当前主题的创建人。 */
  isOwner?: boolean
}

export function handleTopicList(params: HandleTopicListParams) {
  if (!isBrowserExtension()) {
    return
  }

  const { isOwner } = params

  const options = getStorageSync()[StorageKey.Options]
  const isPreviewMode = options.topic?.openMode === 'preview'

  const { handlePreview } = createTopicPreview()

  const $previewBtn = $('<button class="v2p-topic-preview-btn">预览</button>')
  const $ignoreBtn = $('<span class="v2p-topic-ignore-btn">屏蔽</span>')
  const $topicActions = $('<span class="v2p-topic-actions" />')

  $topicList.each((_, topicItem) => {
    const $topicItem = $(topicItem)
    const $itemTitle = $topicItem.find('.item_title')
    const $topicInfo = $topicItem.find('.topic_info')
    const topicTitle = $itemTitle.find('.topic-link').text()

    const linkHref = $topicItem.find('.topic-link').attr('href')
    const match = linkHref?.match(/\/t\/(\d+)/)
    const topicId = match?.at(1)

    const $lastChild = $topicInfo.find('> span:first-of-type')
    const $clonedTopicActions = $topicActions.clone()
    $clonedTopicActions.insertAfter($lastChild)

    if (isPreviewMode) {
      $itemTitle.find('.topic-link').on('click', (ev) => {
        ev.preventDefault()
        handlePreview({ topicId, topicTitle, linkHref })
      })
    }

    if (!isOwner) {
      $ignoreBtn
        .clone()
        .on('click', () => {
          if (confirm(`确定屏蔽主题 ⌈${topicTitle}⌋？`)) {
            if (typeof topicId === 'string') {
              void (async () => {
                const toast = createToast({ message: `正在屏蔽主题 ⌈${topicTitle}⌋`, duration: 0 })

                const pageText = await crawlTopicPage(`/t/${topicId}`, '0')

                const $ignoreBtn = $(pageText).find('.topic_buttons a:nth-of-type(3)')
                const txt = $ignoreBtn.attr('onclick')

                if (txt) {
                  const match = txt.match(/'\/.*'/)

                  if (match) {
                    const result = match[0].slice(1, -1)

                    if (result.startsWith('/ignore/topic')) {
                      try {
                        await fetch(`${V2EX.Origin}${result}`)
                        createToast({ message: '✅ 已屏蔽' })
                      }
                      finally {
                        toast.clear()
                      }
                    }
                  }
                }
              })()
            }
          }
        })
        .appendTo($clonedTopicActions)
    }

    $previewBtn
      .clone()
      .on('click', () => {
        handlePreview({ topicId, topicTitle, linkHref })
      })
      .appendTo($clonedTopicActions)
  })
}
