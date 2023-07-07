import { BookOpenCheck, createElement } from 'lucide'

import { createButton } from '../../components/button'
import { createModel } from '../../components/model'
import { RequestMessage, StorageKey } from '../../constants'
import { iconLoading, iconLogo } from '../../icons'
import { fetchTopic, fetchTopicReplies } from '../../services'
import type { Topic, TopicReply } from '../../types'
import { escapeHTML, formatTimestamp, getRunEnv, getStorageSync } from '../../utils'
import { $topicList } from '../globals'
import { addToReadingList, isV2EX_RequestError } from '../helpers'

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

export function handlingTopicList() {
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

  const model = createModel({
    root: $(document.body),
    onMount: ({ $actions }) => {
      $actions.prepend($detailBtn)
    },
    onClose: ({ $title, $content }) => {
      $title.empty()
      $content.empty()
      abortController?.abort()
    },
  })

  const topicDataCache = new Map<
    string,
    { topic: Topic; topicReplies: TopicReply[]; cacheTime: number }
  >()

  $topicList.each((_, topicItem) => {
    const $topicItem = $(topicItem)
    const $itemTitle = $topicItem.find('.item_title')

    $('<button class="v2p-topic-preview-btn">预览</button>')
      .on('click', () => {
        const linkHref = $topicItem.find('.topic-link').attr('href')
        const match = linkHref?.match(/\/t\/(\d+)/)
        const topicId = match?.at(1)

        if (topicId) {
          model.open()

          $detailBtn.prop('href', linkHref)

          const topicTitle = $itemTitle.find('.topic-link').text()
          const $titleLink = $(
            `<a class="v2p-topic-preview-title-link" title="${topicTitle}">${topicTitle}</a>`
          )

          model.$title.empty().append($titleLink)

          if (PAT) {
            void (async () => {
              let cacheData = topicDataCache.get(topicId)

              if (
                !cacheData ||
                Date.now() - cacheData.cacheTime > 1000 * 60 * 10 // 缓存超时时间为十分钟
              ) {
                try {
                  abortController = new AbortController()

                  model.$content.empty().append(`
                  <div class="v2p-model-loading">
                    <div class="v2p-icon-loading">${iconLoading}</div>
                  </div>
                  `)

                  const promises = [
                    fetchTopic(topicId, { signal: abortController.signal }),
                    fetchTopicReplies(topicId),
                  ] as const

                  const [{ result: topic }, { result: topicReplies }] = await Promise.all(promises)

                  const data = {
                    topic,
                    topicReplies,
                    cacheTime: Date.now(),
                  }

                  topicDataCache.set(topicId, data)
                  cacheData = data
                } catch (err) {
                  if (isV2EX_RequestError(err)) {
                    const message = err.cause.message
                    if (
                      /* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
                      message === RequestMessage.TokenExpired ||
                      message === RequestMessage.InvalidToken
                      /* eslint-enable @typescript-eslint/no-unsafe-enum-comparison */
                    ) {
                      model.$content
                        .empty()
                        .append(invalidTemplate('您的 PAT 已失效，请重新设置。'))
                    }
                  }
                }
              }

              if (cacheData) {
                const { topic, topicReplies } = cacheData

                const $topicPreview = $('<div class="v2p-topic-preview">')

                $titleLink.prop('href', topic.url)
                if (options.openInNewTab) {
                  $titleLink.prop('target', '_blank')
                }

                const $infoBar = $(`
                  <div class="v2p-tp-info-bar">
                    <div class="v2p-tp-info">
                      <a class="v2p-tp-member" href="${topic.member.url}">
                        <img class="v2p-tp-avatar" src="${topic.member.avatar}">
                        <span>${topic.member.username}</span>
                      </a>

                      <span>
                        ${formatTimestamp(topic.created, { format: 'YMDHMS' })}
                      </span>

                      <span>${topic.replies} 条回复</span>
                    </div>
                  </div>
                `)

                const iconBook = createElement(BookOpenCheck)
                iconBook.setAttribute('width', '100%')
                iconBook.setAttribute('height', '100%')

                const $readingBtn = $(`
                <div class="v2p-tp-read"><span class="v2p-tp-read-icon"></span>稍后阅读</div>
                `)
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

                if (topic.content_rendered) {
                  $topicPreview.append(
                    `<div class="v2p-topic-preview-content markdown_body">${topic.content_rendered}</div>`
                  )
                } else {
                  $topicPreview.append(`
                    <div class="v2p-empty-content">
                      <div class="v2p-text-emoji">¯\\_(ツ)_/¯</div>
                      <p>该主题没有正文内容</p>
                    </div>
                    `)
                }

                if (topicReplies.length > 0) {
                  const $template = $('<div>')

                  const op = topic.member.username

                  topicReplies.forEach((r) => {
                    $template.append(`
                      <div class="v2p-topic-reply">
                        <div class="v2p-topic-reply-member">
                          <a href="${r.member.url}">
                            <img class="v2p-topic-reply-avatar" src="${r.member.avatar}">
                            <span>${r.member.username}</span>
                            <span style="
                              display: ${op === r.member.username ? 'unset' : 'none'};
                              margin-left:${op === r.member.username ? '3px' : '0'};
                            ">
                              <span class="badge op mini">OP</span>
                            </span>
                          </a>：
                        </div>
                        <div class="v2p-topic-reply-content">${escapeHTML(r.content)}</div>
                      </div>
                      `)
                  })

                  $('<div class="v2p-topic-reply-box">')
                    .append($template.html())
                    .append(
                      `
                      <div class="v2p-more-reply-tip">
                        <a
                          href="${linkHref || ''}"
                          style="color: currentColor;"
                          target="${options.openInNewTab ? '_blank' : '_self'}"
                        >
                            查看在主题内查看完整评论...
                        </a>
                      </div>
                      `
                    )
                    .appendTo($topicPreview)
                }

                model.$content.empty().append($topicPreview)
              }
            })()
          } else {
            model.$content.empty().append(invalidTemplate('您需要先设置 PAT 才能获取预览内容。'))
          }
        }
      })
      .appendTo($itemTitle)
  })
}
