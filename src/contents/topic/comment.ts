import { Clock4, createElement, Heart } from 'lucide'

import { createModel } from '../../components/model'
import { popupControl } from '../../components/popup'
import { createToast } from '../../components/toast'
import { StorageKey } from '../../constants'
import { crawalTopicPage, thankReply } from '../../services'
import type { CommentData, Member } from '../../types'
import { escapeHTML, getStorageSync } from '../../utils'
import {
  $commentBox,
  $commentCells,
  $commentTableRows,
  $replyTextArea,
  $topicHeader,
  loginName,
  topicOwnerName,
  updateCommentCells,
} from '../globals'
import { insertTextToReplyInput, loadIcons } from '../helpers'
import { processAvatar } from './avatar'
import { processReplyContent, updateMemberTag } from './content'

/** 每一页的回复列表数据 */
let commentDataList: readonly CommentData[] = []

/**
 * 设置热门回复。
 */
function handlingPopularComments() {
  const popularCommentData = commentDataList
    .filter(({ likes }) => likes > 0)
    .sort((a, b) => b.likes - a.likes)

  const popularCount = popularCommentData.length

  const iconHeart = createElement(Heart)
  iconHeart.setAttribute('width', '100%')
  iconHeart.setAttribute('height', '100%')

  const $popularBtn = $(
    `<span class="v2p-tool v2p-hover-btn"><span class="v2p-tool-icon"></span>热门回复</span>`
  )
  $popularBtn.find('.v2p-tool-icon').append(iconHeart)

  $('.v2p-tools').prepend($popularBtn)

  if (popularCount <= 0) {
    $popularBtn.addClass('v2p-hover-btn-disabled').contents().last().replaceWith('暂无热门')
    return
  }

  const model = createModel({
    root: $commentBox,
    title: `本页共有 ${popularCommentData.length} 条热门回复`,
    onMount: ({ $content }) => {
      const $template = $('<div>')

      popularCommentData.forEach(({ index, refMemberNames }) => {
        const $clonedCells = $commentCells.eq(index).clone()

        // 查看热门回复时，禁用回复操作和楼层锚点。
        $clonedCells.find('.v2p-controls > a:has(.v2p-control-reply)').remove()
        $clonedCells.find('.no').css('pointer-events', 'none')

        const firstRefMember = refMemberNames?.at(0)
        if (firstRefMember) {
          // 找出回复的是哪一条回复。
          const replyMember = commentDataList.findLast(
            (it, idx) => idx < index && it.memberName === firstRefMember
          )
          if (replyMember) {
            const $refCell = $(`
              <div class="v2p-topic-reply-ref">
                <div class="v2p-topic-reply">
                  <div class="v2p-topic-reply-member">
                    <a href="${replyMember.memberAvatar}">
                      <img class="v2p-topic-reply-avatar" src="${replyMember.memberAvatar}">
                      <span>${replyMember.memberName}</span>
                    </a>：
                  </div>
                  <div class="v2p-topic-reply-content">${escapeHTML(replyMember.content)}</div>
                </div>
              </div>
            `)
            $clonedCells.prepend($refCell)
          }
        }

        $template.append($clonedCells)
      })

      $content.css({ padding: '0 20px' }).append($template.html())
    },
    onOpen: ({ $container }) => {
      $container.find('.cell[id^="r_"]').each((_, cellDom) => {
        const storage = getStorageSync()
        const options = storage[StorageKey.Options]
        processReplyContent($(cellDom), options.replyContent)
      })
    },
  })

  $popularBtn.on('click', () => {
    model.open()
  })

  {
    const commentBoxCount = $commentBox.find('.cell:first-of-type > span.gray')
    const countText = commentBoxCount.text()
    const newCountText = countText.substring(0, countText.indexOf('回复') + 2)
    const countTextSpan = `<span class="count-text">${newCountText}</span><span class="v2p-dot">·</span>${popularCount} 条热门回复`
    commentBoxCount.empty().append(countTextSpan)
  }
}

/**
 * 设置最近回复。
 */
function handlingRecentComments() {
  if (commentDataList.length <= 5) {
    return
  }

  const len = commentDataList.length
  const displayNum =
    len <= 10 ? 5 : len <= 30 ? 10 : len <= 60 ? 20 : len <= 100 ? 40 : len <= 200 ? 60 : 90

  const recentCommentData = commentDataList.slice(-1 * displayNum).reverse()

  const iconClock = createElement(Clock4)
  iconClock.setAttribute('width', '100%')
  iconClock.setAttribute('height', '100%')

  const $recentBtn = $(
    `<span class="v2p-tool v2p-hover-btn"><span class="v2p-tool-icon"></span>最近回复</span>`
  )
  $recentBtn.find('.v2p-tool-icon').append(iconClock)

  $('.v2p-tools').prepend($recentBtn)

  const model = createModel({
    root: $commentBox,
    title: `最近 ${displayNum} 条回复`,
    onMount: ({ $content }) => {
      const $template = $('<div>')

      recentCommentData.forEach(({ index, refMemberNames }) => {
        const $clonedCells = $commentCells.eq(index).clone()

        // 查看热门回复时，禁用回复操作和楼层锚点。
        $clonedCells.find('.v2p-controls > a:has(.v2p-control-reply)').remove()
        $clonedCells.find('.no').css('pointer-events', 'none')

        const firstRefMember = refMemberNames?.at(0)
        if (firstRefMember) {
          // 找出回复的是哪一条回复。
          const replyMember = commentDataList.findLast(
            (it, idx) => idx < index && it.memberName === firstRefMember
          )
          if (replyMember) {
            const $refCell = $(`
              <div class="v2p-topic-reply-ref">
                <div class="v2p-topic-reply">
                  <div class="v2p-topic-reply-member">
                    <a href="${replyMember.memberAvatar}">
                      <img class="v2p-topic-reply-avatar" src="${replyMember.memberAvatar}">
                      <span>${replyMember.memberName}</span>
                    </a>：
                  </div>
                  <div class="v2p-topic-reply-content">${escapeHTML(replyMember.content)}</div>
                </div>
              </div>
            `)
            $clonedCells.prepend($refCell)
          }
        }

        $template.append($clonedCells)
      })

      $content.css({ padding: '0 20px' }).append($template.html())
    },
    onOpen: ({ $container }) => {
      $container.find('.cell[id^="r_"]').each((_, cellDom) => {
        const storage = getStorageSync()
        const options = storage[StorageKey.Options]
        processReplyContent($(cellDom), options.replyContent)
      })
    },
  })

  $recentBtn.on('click', () => {
    model.open()
  })
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
     </span>`
  )

  const thankArea = $actions.find('> .thank_area')
  const thanked = thankArea.hasClass('thanked')

  if (thanked) {
    $thankIcon.addClass('v2p-thanked')
    $controls.append($('<a>').append($thankIcon))
  } else {
    const thankEle = thankArea.find('> .thank')
    const $hide = thankEle.eq(0).removeClass('thank')
    const $thank = thankEle.eq(1).removeClass('thank')

    $hide.html(
      `<span class="v2p-control v2p-hover-btn v2p-control-hide"><i data-lucide="eye-off"></i></span>`
    )

    $thankIcon.addClass('v2p-hover-btn').replaceAll($thank)

    $controls.append($hide).append($thankIcon)
  }

  const $reply = $actions.find('a:last-of-type')

  $reply
    .find('> img[alt="Reply"]')
    .replaceWith(
      `<span class="v2p-control v2p-hover-btn v2p-control-reply"><i data-lucide="message-square"></i></span>`
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
        const moreThanOneReply =
          commentDataList.findIndex(
            (it) => it.memberName === replyMemberName && it.floor !== floor
          ) !== -1

        if (moreThanOneReply) {
          insertTextToReplyInput(`#${floor} `)
        } else {
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

export async function handlingComments() {
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
              pages.map((p) => crawalTopicPage(window.location.pathname, p))
            )

            pagesText.map((pageText) => {
              $pagingBottom.before($(pageText).find('.cell[id^="r_"]'))
            })
          }

          updateCommentCells()
        }

        toastControl.clear()
      } catch (err) {
        if (err instanceof Error) {
          console.error(`加载多页回复出错：${err.message}`)
        }

        createToast({ message: '❌ 加载多页回复失败' })
        $pageNormal.removeClass('page_current').addClass('page_normal')
      }
    }
  }

  const canHideRefName =
    options.nestedReply.display === 'indent' && !!options.replyContent.hideRefName

  commentDataList = $commentTableRows
    .map<CommentData>((idx, tr) => {
      const id = $commentCells[idx].id

      const $tr = $(tr)
      const $td = $tr.find('> td:nth-child(3)')

      const thanked = $tr.find('> td:last-of-type > .fr').find('> .thank_area').hasClass('thanked')

      const $member = $td.find('> strong > a')
      const memberName = $member.text()
      const memberLink = $member.prop('href')
      const memberAvatar = $tr.find('.avatar').prop('src')

      const $content = $td.find('> .reply_content')
      const content = $content.text()

      const likes = Number($td.find('span.small').text())
      const floor = $td.find('span.no').text()

      const memberNameMatches = Array.from(content.matchAll(/@([a-zA-Z0-9]+)/g))
      const refMemberNames =
        memberNameMatches.length > 0
          ? memberNameMatches.map(([, name]) => {
              return name
            })
          : undefined

      const floorNumberMatches = Array.from(content.matchAll(/#(\d+)/g))
      const refFloors =
        floorNumberMatches.length > 0
          ? floorNumberMatches.map(([, floor]) => {
              return floor
            })
          : undefined

      let contentHtml: CommentData['contentHtml'] = undefined

      if (refMemberNames) {
        if (canHideRefName) {
          if (refMemberNames.length === 1) {
            contentHtml = $content.html()
            const pattern = /(@<a href="\/member\/\w+">[\w\s]+<\/a>)\s+/g
            const replacement = '<span class="v2p-member-ref">$1</span> '

            contentHtml = contentHtml.replace(pattern, replacement)
          }
        }
      }

      return {
        id,
        memberName,
        memberLink,
        memberAvatar,
        content,
        contentHtml,
        likes,
        floor,
        index: idx,
        refMemberNames,
        refFloors,
        thanked,
      }
    })
    .get()

  // 此区块的逻辑需要在处理嵌套评论前执行。
  {
    const membersHasSetTags = new Set<Member['username']>()

    $commentCells.each((i, cellDom) => {
      const currentComment = commentDataList.at(i)

      if (currentComment?.id !== cellDom.id) {
        return
      }

      const $cellDom = $(cellDom)

      const { memberName, thanked } = currentComment

      processAvatar({
        $trigger: $cellDom.find('.avatar'),
        popupControl,
        commentData: currentComment,
      })

      if (memberName === loginName) {
        $cellDom
          .find('.badges')
          .append(`<div class="badge ${memberName === topicOwnerName ? 'mod' : 'you'}">YOU</div>`)
      }

      // 增加感谢爱心的样式。
      const $likesBox = $cellDom.find('.small.fade').addClass('v2p-likes-box')

      $likesBox
        .find('img[alt="❤️"]')
        .replaceWith('<span class="v2p-icon-heart"><i data-lucide="heart"></i></span>')

      if (thanked) {
        $likesBox.addClass('v2p-thanked')
      }

      if (tagData && Reflect.has(tagData, memberName) && !membersHasSetTags.has(memberName)) {
        updateMemberTag(memberName, tagData[memberName].tags, options)
        membersHasSetTags.add(memberName)
      }

      processActions($cellDom, currentComment)

      if (canHideRefName) {
        if (currentComment.contentHtml) {
          $cellDom.find('.reply_content').html(currentComment.contentHtml)
        }
      }
    })

    updateCommentCells()
    handlingRecentComments()
    handlingPopularComments()

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
                } else {
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

  {
    const display = options.nestedReply.display

    if (display !== 'off') {
      $commentCells.each((i, cellDom) => {
        const $cellDom = $(cellDom)

        const dataFromIndex = commentDataList.at(i)

        processReplyContent($cellDom, options.replyContent)

        // 先根据索引去找，如果能对应上就不需要再去 find 了，这样能加快处理速度。
        const currentComment =
          dataFromIndex?.id === cellDom.id
            ? dataFromIndex
            : commentDataList.find((data) => data.id === cellDom.id)

        if (currentComment) {
          const { refMemberNames, refFloors } = currentComment

          if (!refMemberNames || refMemberNames.length === 0) {
            return
          }

          if (options.nestedReply.multipleInsideOne === 'off' && refMemberNames.length > 1) {
            return
          }

          for (const refName of refMemberNames) {
            // 从当前评论往前找，找到第一个引用的用户的评论，然后把当前评论插入到那个评论的后面。
            for (let j = i - 1; j >= 0; j--) {
              const { memberName: compareName, floor: eachFloor } = commentDataList.at(j) || {}

              if (compareName === refName) {
                let refCommentIdx = j

                const firstRefFloor = refFloors?.at(0)

                // 找到了指定回复的用户后，发现跟指定楼层对不上，则继续寻找。
                // 如果手动指定了楼层，那么就以指定的楼层为准（一般来说，由用户指定会更精确），否则就以第一个引用的用户的评论的楼层为准。
                if (firstRefFloor && firstRefFloor !== eachFloor) {
                  const targetIdx = commentDataList
                    .slice(0, j)
                    .findIndex(
                      (data) => data.floor === firstRefFloor && data.memberName === refName
                    )

                  if (targetIdx >= 0) {
                    refCommentIdx = targetIdx
                  }
                }

                if (display === 'indent') {
                  cellDom.classList.add('v2p-indent')
                }

                $commentCells.eq(refCommentIdx).append(cellDom)
                return
              }
            }
          }
        }
      })
    }
  }

  {
    const $opAvatar = $topicHeader.find('.avatar')
    const $opName = $topicHeader.find('.gray a[href^="/member"]')
    const memberName = $opAvatar.prop('alt')
    const memberAvatar = $opAvatar.prop('src')
    const memberLink = $topicHeader.find('.fr > a').prop('href')

    if (
      typeof memberName === 'string' &&
      typeof memberAvatar === 'string' &&
      typeof memberLink === 'string'
    ) {
      processAvatar({
        $trigger: $opAvatar,
        popupControl,
        commentData: { memberName, memberAvatar, memberLink },
      })

      processAvatar({
        $trigger: $opName,
        popupControl,
        commentData: { memberName, memberAvatar, memberLink },
      })
    }
  }
}
