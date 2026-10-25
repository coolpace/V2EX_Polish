import { createToast } from '../../components/toast'
import { StorageKey } from '../../constants'
import { ignoreTopic } from '../../services'
import { getStorageSync, isBrowserExtension } from '../../utils'
import { $topicList } from '../globals'
import { createTopicPreview } from '../topic/preview'

export function handleTopicList() {
  if (!isBrowserExtension()) {
    return
  }

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

    // 预览模式：点击主题标题时拦截默认导航，改为弹出预览窗口。
    if (isPreviewMode) {
      $itemTitle.find('.topic-link').on('click', (ev) => {
        ev.preventDefault()
        handlePreview({ topicId, topicTitle, linkHref })
      })
    }

    $ignoreBtn
      .clone()
      .on('click', () => {
        if (confirm(`确定屏蔽主题 ⌈${topicTitle}⌋？`)) {
          if (typeof topicId === 'string') {
            void (async () => {
              const toast = createToast({ message: `正在屏蔽主题 ⌈${topicTitle}⌋`, duration: 0 })

              try {
                await ignoreTopic(topicId)
                createToast({ message: '✅ 已屏蔽' })
                $topicItem.remove() // 屏蔽成功后，在列表中移除该主题。
              }
              catch (err) {
                createToast({
                  message: err instanceof Error ? `❌ ${err.message}` : '❌ 屏蔽失败，请稍后重试',
                })
              }
              finally {
                toast.clear()
              }
            })()
          }
        }
      })
      .appendTo($clonedTopicActions)

    $previewBtn
      .clone()
      .on('click', () => {
        handlePreview({ topicId, topicTitle, linkHref })
      })
      .appendTo($clonedTopicActions)
  })

  // 为「最近查看过的主题」和「今日热议主题」添加预览按钮
  $('#TopicsHot,#my-recent-topics')
    .find('.cell .item_hot_topic_title')
    .each((_, topicTitle) => {
      const $topicItem = $(topicTitle)

      const $link = $topicItem.find('> a')
      const linkHref = $link.attr('href')
      const match = linkHref?.match(/\/t\/(\d+)/)
      const topicId = match?.at(1)
      const hotTopicTitle = $link.text()

      // 预览模式：点击主题链接时弹出预览窗口。
      if (isPreviewMode) {
        $link.on('click', (ev) => {
          ev.preventDefault()
          handlePreview({ topicId, topicTitle: hotTopicTitle, linkHref })
        })
      }

      $previewBtn
        .clone()
        .on('click', () => {
          handlePreview({ topicId, topicTitle: hotTopicTitle, linkHref })
        })
        .appendTo($topicItem)
    })
}
