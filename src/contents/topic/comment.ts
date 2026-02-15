import { createElement, Heart } from 'lucide'

import { createModal } from '../../components/modal'
import { createPopup } from '../../components/popup'
import { createToast } from '../../components/toast'
import { StorageKey } from '../../constants'
import { crawlTopicPage, fetchUserInfo, thankReply } from '../../services'
import type { CommentData, Member } from '../../types'
import { escapeHTML, extractDays, getStorageSync, parseDateTime } from '../../utils'
import { getCommentDataList, handleNestedComment } from '../dom'
import {
  $commentBox,
  $commentCells,
  $commentTableRows,
  $main,
  $replyTextArea,
  $topicHeader,
  $wrapper,
  loginName,
  topicOwnerName,
  updateCommentCells,
} from '../globals'
import {
  getRegisterDays,
  insertTextToReplyInput,
  loadIcons,
  replaceCommentEmojiWithHD,
} from '../helpers'
import { memberDataCache, processAvatar } from './avatar'
import { handleLinkPreview, handleTopicImg, processReplyContent, updateMemberTag } from './content'

/**
 * 生成回复引用的 HTML 模板
 */
function generateReplyRefHTML(replyMember: CommentData) {
  return `
    <div class="v2p-topic-reply-ref">
      <div class="v2p-topic-reply">
        <div class="v2p-topic-reply-member">
          <a href="${replyMember.memberLink}" target="_blank">
            <img class="v2p-topic-reply-avatar" src="${replyMember.memberAvatar}">
            <span>${replyMember.memberName}</span>
          </a>：
        </div>
        <div class="v2p-topic-reply-content">${escapeHTML(replyMember.content)}</div>
      </div>
    </div>
  `
}

/** 每一页的回复列表数据 */
let commentDataList: readonly CommentData[] = []

/**
 * 分批执行任务，避免主线程长时间阻塞。
 */
function scheduleInChunks<T>(
  items: T[],
  chunkSize: number,
  handler: (item: T) => void,
) {
  let index = 0

  const runChunk = () => {
    const end = Math.min(index + chunkSize, items.length)

    for (; index < end; index++) {
      handler(items[index])
    }

    if (index < items.length) {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(runChunk)
      }
      else {
        (window as Window).requestAnimationFrame(runChunk)
      }
    }
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(runChunk)
  }
  else {
    (window as Window).requestAnimationFrame(runChunk)
  }
}

/**
 * 设置经过筛选后的回复。
 */
function handleFilteredComments() {
  const iconHeart = createElement(Heart)
  iconHeart.setAttribute('width', '100%')
  iconHeart.setAttribute('height', '100%')

  const $commentsBtn = $(
    '<span class="v2p-tool v2p-hover-btn"><span class="v2p-tool-icon"></span>热门回复</span>',
  )
  $commentsBtn.find('.v2p-tool-icon').append(iconHeart)

  $('.v2p-tools').prepend($commentsBtn)

  const popularCommentData = commentDataList
    .filter(({ likes }) => likes > 0)
    .sort((a, b) => b.likes - a.likes)

  const popularCount = popularCommentData.length

  // 延迟构建 modal 内容：将评论克隆等重操作推迟到用户首次打开 modal 时执行，
  // 避免在页面加载时就进行大量 DOM 克隆操作（100+ 评论时尤为明显）。
  let contentBuilt = false

  const modal = createModal({
    root: $main,
    onOpen: ({ $mask, $title, $content }) => {
      // 仅在首次打开时构建内容，后续打开复用已构建的 DOM。
      if (!contentBuilt) {
        const $template = $('<div class="v2p-modal-comments">')

        const $t1 = $template.clone().attr('data-tab-key', 'hot').addClass('v2p-tab-content-active')
        const $t2 = $template.clone().attr('data-tab-key', 'recent')
        const $t3 = $template.clone().attr('data-tab-key', 'op')

        // MARK: 热门回复：
        {
          if (popularCount > 0) {
            popularCommentData.forEach(({ index, refMemberNames }) => {
              const $clonedCell = $commentCells.eq(index).clone()

              // 禁用回复操作和楼层锚点。
              $clonedCell.find('.v2p-controls > a:has(.v2p-control-reply)').remove()
              $clonedCell.find('.no').css('pointer-events', 'none')

              const firstRefMember = refMemberNames?.at(0)

              if (firstRefMember) {
                // 找出回复的是哪一条回复。
                const replyMember = commentDataList.findLast(
                  (it, idx) => idx < index && it.memberName === firstRefMember,
                )

                if (replyMember) {
                  $clonedCell.prepend(generateReplyRefHTML(replyMember))
                }
              }

              $t1.append($clonedCell)
            })
          }
          else {
            $t1.append($('<div>暂无热门回复</div>').css({ padding: '20px', textAlign: 'center' }))
          }

          $content.append($t1)
        }

        // MARK: 最新回复：
        {
          const len = commentDataList.length
          const displayNum
            = len < 10
              ? len
              : len <= 10
                ? 5
                : len <= 30
                  ? 10
                  : len <= 60
                    ? 20
                    : len <= 100
                      ? 40
                      : len <= 200
                        ? 60
                        : 90

          if (displayNum > 0) {
            const recentCommentData = commentDataList.slice(-1 * displayNum).reverse()

            recentCommentData.forEach(({ index, refMemberNames }) => {
              const $clonedCell = $commentCells.eq(index).clone()

              // 禁用回复操作和楼层锚点。
              $clonedCell.find('.v2p-controls > a:has(.v2p-control-reply)').remove()
              $clonedCell.find('.no').css('pointer-events', 'none')

              const firstRefMember = refMemberNames?.at(0)

              if (firstRefMember) {
                // 找出回复的是哪一条回复。
                const replyMember = commentDataList.findLast(
                  (it, idx) => idx < index && it.memberName === firstRefMember,
                )

                if (replyMember) {
                  $clonedCell.prepend(generateReplyRefHTML(replyMember))
                }
              }

              $t2.append($clonedCell)
            })
          }
          else {
            $t2.append($('<div>暂无最近回复</div>').css({ padding: '20px', textAlign: 'center' }))
          }

          $content.append($t2)
        }

        // MARK: 题主回复：
        {
          const opCommentData = commentDataList.filter(
            ({ memberName }) => memberName === topicOwnerName,
          )

          if (opCommentData.length > 0) {
            opCommentData.forEach(({ index, refMemberNames }) => {
              const $clonedCell = $commentCells.eq(index).clone()

              // 禁用回复操作和楼层锚点。
              $clonedCell.find('.v2p-controls > a:has(.v2p-control-reply)').remove()
              $clonedCell.find('.no').css('pointer-events', 'none')

              const firstRefMember = refMemberNames?.at(0)

              if (firstRefMember) {
                // 找出回复的是哪一条回复。
                const replyMember = commentDataList.findLast(
                  (it, idx) => idx < index && it.memberName === firstRefMember,
                )

                if (replyMember) {
                  $clonedCell.prepend(generateReplyRefHTML(replyMember))
                }
              }

              $t3.append($clonedCell)
            })
          }
          else {
            $t3.append($('<div>暂无题主回复</div>').css({ padding: '20px', textAlign: 'center' }))
          }

          $content.append($t3)
        }

        const $tabs = $(`
          <div class="v2p-modal-comment-tabs">
            <div data-tab-key="hot" class="v2p-tab-active">热门回复</div>
            <div data-tab-key="recent">最新回复</div>
            <div data-tab-key="op">题主回复</div>
          </div>
        `)
        $title.append($tabs)

        $tabs.find('[data-tab-key]').on('click', (ev) => {
          const $target = $(ev.currentTarget)
          const { tabKey } = $target.data()

          if (typeof tabKey === 'string') {
            $target.addClass('v2p-tab-active').siblings().removeClass('v2p-tab-active')

            $(`.v2p-modal-comments[data-tab-key="${tabKey}"]`)
              .addClass('v2p-tab-content-active')
              .siblings()
              .removeClass('v2p-tab-content-active')
          }
        })

        // 为模态框中的克隆 cell 绑定头像悬浮弹框。
        {
          const modalPopupControl = createPopup({
            root: $mask,
            triggerType: 'hover',
            placement: 'right-start',
            offsetOptions: { mainAxis: 8, crossAxis: -4 },
          })

          const storage = getStorageSync()
          const options = storage[StorageKey.Options]

          $content.find('.cell[id^="r_"]').each((_, cellDom) => {
            const commentData = commentDataList.find((c) => c.id === cellDom.id)

            if (commentData) {
              const $cellDom = $(cellDom)

              processAvatar({
                $trigger: $cellDom.find('.avatar, .dark'),
                popupControl: modalPopupControl,
                commentData,
                shouldWrap: false,
                openInNewTab: options.openInNewTab,
              })
            }
          })
        }

        replaceCommentEmojiWithHD($content.find('.cell[id^="r_"]'))

        contentBuilt = true
      }

      // 以下逻辑每次打开都需要执行。
      const storage = getStorageSync()
      const options = storage[StorageKey.Options]

      $content.find('.cell[id^="r_"]').each((_, cellDom) => {
        if (options.replyContent.autoFold) {
          processReplyContent($(cellDom))
        }
      })

      handleLinkPreview()
    },
  })

  $commentsBtn.on('click', () => {
    modal.open()
  })

  {
    const $commentBoxCount = $commentBox.find('.cell:first-of-type > span.gray')
    const countText = $commentBoxCount.text()
    const newCountText = countText.substring(0, countText.indexOf('回复') + 2)
    const countTextSpan = `<span class="count-text">${newCountText}</span><span class="v2p-dot">·</span>${popularCount} 条热门回复`
    $commentBoxCount.empty().append(countTextSpan)
  }
}

/**
 * 设置回复的操作。
 */
function processActions($cellDom: JQuery, data: CommentData) {
  const $actions = $cellDom.find('> table > tbody > tr > td:last-of-type > .fr')

  const $controls = $('<span class="v2p-controls">')

  const $thankIcon = $(
    `<span
      class="v2p-control v2p-control-thank"
      data-id="${data.id}"
      data-member-name="${data.memberName}"
     >
        <i data-lucide="heart"></i>
     </span>`,
  )

  const thankArea = $actions.find('> .thank_area')
  const thanked = thankArea.hasClass('thanked')

  if (thanked) {
    $thankIcon.addClass('v2p-thanked')
    $controls.append($('<a>').append($thankIcon))
  }
  else {
    const thankEle = thankArea.find('> .thank')
    const $hide = thankEle.eq(0).removeClass('thank')
    const $thank = thankEle.eq(1).removeClass('thank')

    $hide.html(
      '<span class="v2p-control v2p-hover-btn v2p-control-hide"><i data-lucide="eye-off"></i></span>',
    )

    $thankIcon.addClass('v2p-hover-btn').replaceAll($thank)

    $controls.append($hide).append($thankIcon)
  }

  const $reply = $actions.find('a:last-of-type')

  $reply
    .find('> img[alt="Reply"]')
    .replaceWith(
      '<span class="v2p-control v2p-hover-btn v2p-control-reply"><i data-lucide="message-square"></i></span>',
    )

  $controls.append($reply)

  thankArea.remove()

  const floorNum = $actions.find('.no').clone()

  // 当要回复的用户在本页已有多条回复时，在输入框中添加指定楼层，这样可以减少楼层错乱的情况。
  $reply.on('click', () => {
    const replyVal = $replyTextArea.val()

    if (typeof replyVal === 'string' && replyVal.length > 0) {
      const floor = floorNum.text()

      const replyComment = commentDataList.find((it) => it.floor === floor)

      if (replyComment) {
        const replyMemberName = replyComment.memberName
        const moreThanOneReply
          = commentDataList.findIndex(
            (it) => it.memberName === replyMemberName && it.floor !== floor,
          ) !== -1

        if (moreThanOneReply) {
          insertTextToReplyInput(`#${floor} `)
        }
        else {
          const $page = $('.v2p-paging').eq(0).find('.page_normal, .page_current')

          if ($page.length > 1) {
            const onLastPage = $page.last().hasClass('page_current')

            if (!onLastPage) {
              insertTextToReplyInput(`#${floor} `)
            }
          }
        }
      }
    }
  })

  $actions.empty().append($controls, floorNum)
}

const popupControl = createPopup({
  root: $wrapper,
  triggerType: 'hover',
  placement: 'right-start',
  offsetOptions: { mainAxis: 8, crossAxis: -4 },
})

export async function handleComments() {
  const storage = getStorageSync()

  const tagData = storage[StorageKey.MemberTag]
  const options = storage[StorageKey.Options]

  if (options.reply.preload !== 'off') {
    // 预加载多页回复，然后在同一页中显示，优化多页回复产生的楼中楼。

    const $paging = $('.v2p-paging')

    if ($paging.length > 0) {
      const $pagingTop = $paging.eq(0)
      const $pagingBottom = $paging.eq(1)
      const $pageNormal = $paging.find('.page_normal')
      const $pagingTopNormal = $pagingTop.find('.page_normal')

      const toastControl = createToast({ message: '正在预加载回复，请稍候...', duration: 0 })

      try {
        const $pagingBottomNormal = $pagingBottom.find('.page_normal')

        const $pageCurrent = $pagingTop.find('.page_current')
        const currentPage = $pageCurrent.text()

        if (currentPage === '1') {
          const pages: string[] = []

          $pagingTopNormal.each((i, ele) => {
            if (i <= 1 /** 基于性能考虑，限制最多加载 3 页回复 */) {
              if (ele.textContent) {
                ele.classList.add('page_current')
                ele.classList.remove('page_normal')
                $pagingBottomNormal.eq(i).addClass('page_current').removeClass('page_normal')
                pages.push(ele.textContent)
              }
            }
          })

          if (pages.length > 0) {
            const pagesText = await Promise.all(
              pages.map((p) => crawlTopicPage(window.location.pathname, p)),
            )

            const fragment = document.createDocumentFragment()

            for (const htmlText of pagesText) {
              const doc = new DOMParser().parseFromString(htmlText, 'text/html')
              const cells = doc.querySelectorAll('.cell[id^="r_"]')

              for (const cell of cells) {
                if (cell instanceof HTMLElement) {
                  fragment.append(document.importNode(cell, true))
                }
              }
            }

            const pagingBottomEl = $pagingBottom.get(0)

            if (pagingBottomEl?.parentNode) {
              pagingBottomEl.parentNode.insertBefore(fragment, pagingBottomEl)
            }
          }

          updateCommentCells()
        }

        toastControl.clear()
      }
      catch (err) {
        if (err instanceof Error) {
          console.error(`加载多页回复出错：${err.message}`)
        }

        createToast({ message: '❌ 加载多页回复失败' })
        $pageNormal.removeClass('page_current').addClass('page_normal')
      }
    }
  }

  const $commentTime = $('.cell .ago')

  if (options.replyContent.hideReplyTime) {
    $commentTime.addClass('v2p-auto-hide')
  }

  const canHideRefName
    = options.nestedReply.display === 'indent' && !!options.replyContent.hideRefName

  commentDataList = getCommentDataList({ options, $commentTableRows, $commentCells })

  // MARK: 处理每一条回复。
  // 👇此区块的逻辑需要在处理嵌套评论前执行。
  {
    const memberNames = new Set<Member['username']>([topicOwnerName])

    $commentCells.each((i, cellDom) => {
      const currentComment = commentDataList.at(i)

      if (currentComment?.id !== cellDom.id) {
        return
      }

      const $cellDom = $(cellDom)

      const { memberName, thanked } = currentComment
      memberNames.add(memberName)

      processAvatar({
        $trigger: $cellDom.find('.avatar, .dark'),
        popupControl,
        commentData: currentComment,
        openInNewTab: options.openInNewTab,
      })

      if (memberName === loginName && !options.hideAccount) {
        $cellDom
          .find('.badges')
          .append(`<div class="badge ${memberName === topicOwnerName ? 'mod' : 'you'}">Me</div>`)
      }

      // 增加感谢爱心的样式。
      const $likesBox = $cellDom.find('.small.fade').addClass('v2p-likes-box')

      $likesBox
        .find('img[alt="❤️"]')
        .replaceWith('<span class="v2p-icon-heart"><i data-lucide="heart"></i></span>')

      if (thanked) {
        $likesBox.addClass('v2p-thanked')
      }

      processActions($cellDom, currentComment)

      if (canHideRefName) {
        if (currentComment.contentHtml) {
          $cellDom.find('.reply_content').html(currentComment.contentHtml)
        }
      }
    })

    if (tagData) {
      Object.entries(tagData).forEach(([memberName, { tags, avatar }]) => {
        if (memberNames.has(memberName)) {
          updateMemberTag({ memberName, memberAvatar: avatar, tags, options })
        }
      })
    }

    updateCommentCells()
    handleFilteredComments()

    // 处理「点击感谢回复」的逻辑。
    $('.v2p-control-thank').on('click', (ev) => {
      ev.stopPropagation()

      const id = ev.currentTarget.dataset.id
      const memberName = ev.currentTarget.dataset.memberName

      if (typeof id === 'string' && typeof memberName === 'string') {
        if (confirm(`确认花费 10 个铜币向 @${memberName} 的这条回复发送感谢？`)) {
          const replyId = id.split('_').at(1)

          if (replyId) {
            void thankReply({
              replyId,

              onSuccess: () => {
                const $cell = $(`.cell[id="r_${replyId}"]`)
                const $tableInCell = $cell.find('> table')
                const $likesBox = $tableInCell.find('.v2p-likes-box')
                const $firstLikesBox = $likesBox.eq(0)
                const likes = Number($firstLikesBox.text())
                const $clonedIconHeart = $firstLikesBox.find('.v2p-icon-heart').clone()

                if (likes > 0) {
                  $likesBox
                    .addClass('v2p-thanked')
                    .empty()
                    .append($clonedIconHeart, ` ${likes + 1}`)
                }
                else {
                  $(`
                      <span class="small v2p-likes-box v2p-thanked" style="position:relative;top:-1px;">
                        &nbsp;&nbsp;<span class="v2p-icon-heart"><i data-lucide="heart"></i></span>1
                      </span>
                      `).insertAfter($tableInCell.find('.ago'))
                  loadIcons()
                }

                const $thankAction = $tableInCell.find('.v2p-control-thank')
                $thankAction.addClass('v2p-thanked').off('click')
                $thankAction.siblings().has('.v2p-control-hide').hide()
              },

              onFail: () => {
                createToast({ message: '❌ 感谢回复失败' })
              },
            })
          }
        }
      }
    })
  }

  // MARK: 处理嵌套回复
  handleNestedComment({ options, $commentCells, commentDataList })

  // MARK: 分批处理回复内容折叠（避免主线程长时间阻塞）
  if (options.replyContent.autoFold) {
    const cells = $commentCells.get()
    scheduleInChunks(cells, 30, (cell) => {
      processReplyContent($(cell))
    })
  }

  // MARK: 鼠标悬浮展示用户弹框
  // 让主题内容区的 OP 头像在鼠标悬浮时也能展示用户信息弹框。
  {
    const $opAvatar = $topicHeader.find('.avatar')
    const $opName = $topicHeader.find('.gray a[href^="/member"]')
    const memberName = $opAvatar.prop('alt')
    const memberAvatar = $opAvatar.prop('src')
    const memberLink = $topicHeader.find('.fr > a').prop('href')

    if (
      typeof memberName === 'string'
      && typeof memberAvatar === 'string'
      && typeof memberLink === 'string'
    ) {
      processAvatar({
        $trigger: $opAvatar,
        popupControl,
        commentData: { memberName, memberAvatar, memberLink },
        openInNewTab: options.openInNewTab,
      })

      processAvatar({
        $trigger: $opName,
        popupControl,
        commentData: { memberName, memberAvatar, memberLink },
        shouldWrap: false,
        openInNewTab: options.openInNewTab,
      })

      // MARK: 获取用户注册时间信息
      void fetchUserInfo(memberName).then((memberData) => {
        const registerDays = getRegisterDays(memberData.created)

        memberDataCache.set(memberName, { ...memberData, registerDays })

        if (registerDays <= 30) {
          $opName.append(
            `<span class="v2p-register-days">${registerDays <= 15 ? '15' : '30'} 天内注册</span>`,
          )
        }
      })
    }
  }

  if (options.replyContent.showImgInPage) {
    window.requestIdleCallback(() => {
      handleTopicImg()
    })
  }

  window.requestIdleCallback(() => {
    replaceCommentEmojiWithHD()
    handleLinkPreview()

    $commentTime
      .each((_, el) => {
        const $el = $(el)
        const time = $el.text()
        const daysAgo = extractDays(time)

        if (typeof daysAgo === 'number' && daysAgo > 60) {
          const absoluteTime = $el.prop('title')

          if (typeof absoluteTime === 'string') {
            const parseResult = parseDateTime(absoluteTime)

            if (parseResult.success) {
              if (parseResult.formatted) {
                $el.text(`${parseResult.formatted}`)
              }
            }
          }
        }
      })
  })
}
