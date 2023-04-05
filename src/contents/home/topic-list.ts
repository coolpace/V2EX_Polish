import { RequestMessage } from '../../constants'
import { iconLoading } from '../../icons'
import { fetchTopic, fetchTopicReplies } from '../../services'
import { $topicList } from '../globals'
import { createButton, createModel, escapeHTML, getPAT, isV2EX_RequestError } from '../helpers'

export function handlingTopicList() {
  void getPAT().then((PAT) => {
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
      const $itemTitle = $topicItem.find('.item_title')

      $('<button class="v2p-topic-preview-btn">预览</button>')
        .on('click', () => {
          const linkHref = $topicItem.find('.topic-link').attr('href')
          const match = linkHref?.match(/\/(\d+)#/)
          const topicId = match?.at(1)

          if (topicId) {
            $detailBtn.prop('href', linkHref)

            void (async () => {
              try {
                abortController = new AbortController()

                model.open()

                const topicTitle = $itemTitle.find('.topic-link').text()

                model.$title.empty().text(topicTitle).prop('title', topicTitle)

                model.$content.empty().append(`
                <div class="v2p-model-loading">
                  <div class="v2p-icon-loading">${iconLoading}</div>
                </div>
                `)

                const promises = [
                  fetchTopic(topicId, {
                    signal: abortController.signal,
                  }),
                  fetchTopicReplies(topicId),
                ] as const

                const [{ result: topic }, { result: topicReplies }] = await Promise.all(promises)

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

                if (topicReplies.length > 0) {
                  const $template = $('<div>')

                  topicReplies.forEach((r) => {
                    $template.append(`
                    <div class="v2p-topic-reply">
                      <div class="v2p-topic-reply-member">
                        <img class="v2p-topic-reply-avatar" src="${r.member.avatar}">
                        <span class="v2p-topic-reply-username">${r.member.username}：</span>
                      </div>
                      <div class="v2p-topic-reply-content">${escapeHTML(r.content)}</div>
                    </div>
                    `)
                  })

                  $('<div class="v2p-topic-reply-box">')
                    .append($template.html())
                    .appendTo($topicPreview)
                }

                model.$content.empty().append($topicPreview)
              } catch (err) {
                if (isV2EX_RequestError(err)) {
                  const message = err.cause.message
                  if (
                    message === RequestMessage.TokenExpired ||
                    message === RequestMessage.InvalidToken
                  ) {
                    model.$content.empty().append(`<div>${err.cause.message}</div>`)
                  }
                }
              }
            })()
          }
        })
        .appendTo($itemTitle)
    })
  })
}
