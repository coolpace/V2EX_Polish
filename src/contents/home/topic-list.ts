import { createToast } from '../../components/toast'
import { StorageKey, V2EX } from '../../constants'
import { crawlTopicPage } from '../../services'
import { useTopicPreview } from '../../use-topic-preview'
import { getStorageSync, isBrowserExtension } from '../../utils'
import { $topicList } from '../globals'

export function handleTopicList() {
  if (!isBrowserExtension()) {
    return
  }

  const storage = getStorageSync()

  const PAT = storage[StorageKey.API]?.pat

  const { handlePreview } = useTopicPreview()

  const $previewBtn = $('<button class="v2p-topic-preview-btn">预览</button>')
  const $ignoreBtn = $('<span class="v2p-topic-ignore-btn">屏蔽</span>')

  $topicList.each((_, topicItem) => {
    const $topicItem = $(topicItem)
    const $itemTitle = $topicItem.find('.item_title')
    const $topicInfo = $topicItem.find('.topic_info')
    const topicTitle = $itemTitle.find('.topic-link').text()

    const linkHref = $topicItem.find('.topic-link').attr('href')
    const match = linkHref?.match(/\/t\/(\d+)/)
    const topicId = match?.at(1)

    $previewBtn
      .clone()
      .on('click', () => {
        handlePreview({ topicId, topicTitle, linkHref })
      })
      .appendTo($itemTitle)

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
                      createToast({ message: `✅ 已屏蔽` })
                      $topicItem.remove() // 屏蔽成功后，在列表中移除该主题。
                    } finally {
                      toast.clear()
                    }
                  }
                }
              }
            })()
          }
        }
      })
      .insertAfter($topicInfo.find('> span:first-of-type'))
  })

  if (PAT) {
    $('#TopicsHot,#my-recent-topics')
      .find('.cell .item_hot_topic_title')
      .each((_, topicTitle) => {
        const $topicItem = $(topicTitle)
        $previewBtn
          .clone()
          .on('click', () => {
            const $link = $topicItem.find('> a')
            const linkHref = $link.attr('href')
            const match = linkHref?.match(/\/t\/(\d+)/)
            const topicId = match?.at(1)
            const topicTitle = $link.text()

            handlePreview({ topicId, topicTitle, linkHref })
          })
          .appendTo($topicItem)
      })
  }
}
