import { BookOpenCheck, createElement } from 'lucide'

import { createButton } from '../../components/button'
import { createModal } from '../../components/modal'
import { createToast } from '../../components/toast'
import { RequestMessage, StorageKey, V2EX } from '../../constants'
import { iconLogo } from '../../icons'
import { crawlTopicPage, fetchTopic } from '../../services'
import type { Topic } from '../../types'
import { formatTimestamp, getRunEnv, getStorageSync } from '../../utils'
import { getCommentDataList, handleNestedComment } from '../dom'
import { $body, $topicList } from '../globals'
import { addToReadingList } from '../helpers'

const invalidTemplate = (tip: string) => `
<div class="v2p-no-pat">
  <div class="v2p-no-pat-title">${tip}</div>
  <div class="v2p-no-pat-desc">
    请前往<span class="v2p-no-pat-block"><span class="v2p-icon-logo">${iconLogo}</span> <span style="margin: 0 5px;">></span> 设置</span> 进行设置。
  </div>

  <div class="v2p-no-pat-steps">
    <div class="v2p-no-pat-step">
      <div style="font-weight:bold;margin-bottom:10px;font-size:15px;">1. 在扩展程序列表中找到并点击「V2EX Polish」。</div>
      <img class="v2p-no-pat-img" src="https://i.imgur.com/UfNkuTF.png">
    </div>
    <div class="v2p-no-pat-step">
      <div style="font-weight:bold;margin-bottom:10px;font-size:15px;">2. 在弹出的小窗口中找到「⚙️ 按钮」，输入 PAT。</div>
      <img class="v2p-no-pat-img" src="https://i.imgur.com/O6hP86A.png">
    </div>
  </div>
</div>
`

interface TopicData {
  topic: Topic
  /** 爬取主题页得到的 HTML 文本。 */
  topicPageText: string
  cacheTime: number
}

export function handleTopicList() {
  const runEnv = getRunEnv()

  if (!runEnv) {
    return
  }

  const storage = getStorageSync()

  const options = storage[StorageKey.Options]
  const PAT = storage[StorageKey.API]?.pat

  let abortController: AbortController | null = null

  const $detailBtn = createButton({
    children: '进入主题',
    className: 'special',
    tag: 'a',
  })

  if (options.openInNewTab) {
    $detailBtn.prop('target', '_blank')
  }

  const modal = createModal({
    root: $body,
    onMount: ({ $actions }) => {
      $actions.prepend($detailBtn)
    },
    onClose: ({ $title, $content }) => {
      $title.empty()
      $content.empty()
      abortController?.abort()
    },
  })

  const topicDataCache = new Map<string, TopicData>()

  const handlePreview = (params: { topicId?: string; topicTitle?: string; linkHref?: string }) => {
    const { topicId, topicTitle = '', linkHref } = params

    if (topicId) {
      modal.open()

      $detailBtn.prop('href', linkHref)

      const $titleLink = $(`
        <a class="v2p-topic-preview-title-link" title="${topicTitle}" href="${linkHref || ''}">
          ${topicTitle}
        </a>
      `)

      if (options.openInNewTab) {
        $titleLink.prop('target', '_blank')
      }

      modal.$title.empty().append($titleLink)

      if (PAT) {
        const load = async () => {
          let cacheData = topicDataCache.get(topicId)

          if (
            !cacheData ||
            Date.now() - cacheData.cacheTime > 1000 * 60 * 10 // 在同一个页面中且不刷新的情况下，缓存超时时间为十分钟。
          ) {
            abortController = new AbortController()

            modal.$content.empty().append(`
                <div class="v2p-tpr-loading">
                  <div class="v2p-tpr-info">
                    <div class="v2p-tpr v2p-tpr-info-avatar"></div>
                    <div class="v2p-tpr v2p-tpr-info-text"></div>
                  </div>
  
                  <div class="v2p-tpr-content">
                    <div class="v2p-tpr v2p-tpr-content-p"></div>
                    <div class="v2p-tpr v2p-tpr-content-p"></div>
                    <div class="v2p-tpr v2p-tpr-content-p" style="width: 70%;"></div>
                  </div>
  
                  <div class="v2p-tpr-cmt">
                    <div class="v2p-tpr v2p-tpr-cmt-avatar"></div>
                    <div class="v2p-tpr-cmt-right">
                      <div class="v2p-tpr v2p-tpr-cmt-header"></div>
                      <div class="v2p-tpr v2p-tpr-cmt-p"></div>
                      <div class="v2p-tpr v2p-tpr-cmt-p" style="width: 70%;"></div>
                    </div>
                  </div>
  
                  <div class="v2p-tpr-cmt" style="opacity: 0.8;">
                    <div class="v2p-tpr v2p-tpr-cmt-avatar"></div>
                    <div class="v2p-tpr-cmt-right">
                      <div class="v2p-tpr v2p-tpr-cmt-header"></div>
                      <div class="v2p-tpr v2p-tpr-cmt-p"></div>
                      <div class="v2p-tpr v2p-tpr-cmt-p" style="width: 70%;"></div>
                    </div>
                  </div>
  
                  <div class="v2p-tpr-cmt" style="opacity: 0.6;">
                    <div class="v2p-tpr v2p-tpr-cmt-avatar"></div>
                    <div class="v2p-tpr-cmt-right">
                      <div class="v2p-tpr v2p-tpr-cmt-header"></div>
                      <div class="v2p-tpr v2p-tpr-cmt-p"></div>
                      <div class="v2p-tpr v2p-tpr-cmt-p" style="width: 70%;"></div>
                    </div>
                  </div>
                  <div class="v2p-tpr-cmt" style="opacity: 0.4;">
                    <div class="v2p-tpr v2p-tpr-cmt-avatar"></div>
                    <div class="v2p-tpr-cmt-right">
                      <div class="v2p-tpr v2p-tpr-cmt-header"></div>
                      <div class="v2p-tpr v2p-tpr-cmt-p"></div>
                      <div class="v2p-tpr v2p-tpr-cmt-p" style="width: 70%;"></div>
                    </div>
                  </div>
                </div>
              `)

            const promises = [
              fetchTopic(topicId, { signal: abortController.signal }),
              crawlTopicPage(`/t/${topicId}`),
            ] as const

            try {
              const [{ result: topic }, topicPageText] = await Promise.all(promises)

              const data: TopicData = {
                topic,
                cacheTime: Date.now(),
                topicPageText,
              }

              topicDataCache.set(topicId, data)
              cacheData = data
            } catch (err) {
              const $errorTip = $('<div style="padding: 20px; text-align: center;">')

              if (err instanceof Error) {
                if (
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
                  err.message === RequestMessage.InvalidToken ||
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
                  err.message === RequestMessage.TokenExpired
                ) {
                  $errorTip.html(
                    invalidTemplate(
                      '您的 Token 已失效，请<a class="v2p-topic-preview-retry" href="https://www.v2ex.com/settings/tokens" target="_blank">重新设置</a>。'
                    )
                  )
                }
              } else {
                $errorTip.html('加载主题失败，<a class="v2p-topic-preview-retry">点击重试</a>。')
                $errorTip.find('.v2p-topic-preview-retry').on('click', () => {
                  load()
                })
              }

              modal.$content.empty().append($errorTip)
            }
          }

          if (cacheData) {
            const { topic, topicPageText } = cacheData

            const $page = $(topicPageText)

            const $topicPreview = $('<div id="Main" class="v2p-topic-preview">')

            const $infoBar = $(`
              <div class="v2p-tp-info-bar">
                <div class="v2p-tp-info">
                  <a class="v2p-tp-member" href="${topic.member.url}">
                    <img class="v2p-tp-avatar" src="${topic.member.avatar}">
                    <span>${topic.member.username}</span>
                  </a>

                  <span>
                    ${formatTimestamp(topic.created, { format: 'YMDHM' })}
                  </span>

                  <span>${topic.replies} 条回复</span>
                </div>
              </div>
            `)

            const iconBook = createElement(BookOpenCheck)
            iconBook.setAttribute('width', '100%')
            iconBook.setAttribute('height', '100%')

            const $readingBtn = $(
              '<div class="v2p-tp-read"><span class="v2p-tp-read-icon"></span>稍后阅读</div>'
            )
            $readingBtn.find('.v2p-tp-read-icon').append(iconBook)
            $readingBtn
              .on('click', () => {
                void addToReadingList({
                  url: topic.url,
                  title: topic.title,
                  content: topic.content,
                })
              })
              .appendTo($infoBar)

            $topicPreview.append($infoBar)

            const $topicMain = $page.find('#Main')
            const $topicContent = $topicMain.find('> .box > .cell > .topic_content')
            const $topicSubtle = $topicMain.find('> .box >.subtle')

            if ($topicContent.length <= 0) {
              $topicPreview.append(`
                <div class="v2p-empty-content">
                  <div class="v2p-text-emoji">¯\\_(ツ)_/¯</div>
                  <p>该主题没有正文内容</p>
                </div>
              `)
            } else {
              $topicPreview.append($topicContent)
              $topicContent.wrap('<div class="cell">')
            }

            $topicPreview.append($topicSubtle)

            const $topicReplyBox = $topicMain.find('.box:has(.cell[id^="r_"])')

            if ($topicReplyBox.length > 0) {
              $topicReplyBox.css('margin-top', '20px')
              $topicReplyBox
                .find(
                  '.cell:first-of-type, .cell.ps_container, .cell > table > tbody > tr > td:last-of-type > .fr'
                )
                .remove()
              const $commentCells = $topicReplyBox.find('.cell[id^="r_"]')
              const $commentTableRows = $commentCells.find('> table > tbody > tr')
              const commentDataList = getCommentDataList({
                options,
                $commentTableRows,
                $commentCells,
              })
              handleNestedComment({ options, $commentCells, commentDataList })
              $topicPreview.append($topicReplyBox)

              if (topic.replies > 100) {
                $topicPreview.append(`
                  <div class="v2p-topic-reply-tip">
                    <a
                      href="${linkHref || ''}"
                      style="color: currentColor;"
                    >
                        在主题内查看完整评论...
                    </a>
                  </div>
                `)
              }
            }

            if (options.openInNewTab) {
              $topicPreview.find('a').prop('target', '_blank')
            }

            modal.$content.empty().append($topicPreview)

            // 默认情况下，div 不是可聚焦的元素，设置 tabindex 属性后，用户可以使用 focus() 聚焦到该元素。
            modal.$content.attr('tabindex', '0')

            modal.$content.trigger('focus')
          }
        }

        load()
      } else {
        modal.$content.empty().append(invalidTemplate('您需要先设置 PAT 才能获取预览内容。'))
      }
    }
  }

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
                      $topicItem.remove()
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
