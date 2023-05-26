import { createModel } from '../../components/model'
import { createPopup } from '../../components/popup'
import { createToast } from '../../components/toast'
import { StorageKey } from '../../constants'
import { iconHeart, iconHide, iconReply } from '../../icons'
import { crawalTopicPage, thankReply } from '../../services'
import type { CommentData, Member } from '../../types'
import { escapeHTML, getStorageSync } from '../../utils'
import {
  $commentBox,
  $commentCells,
  $commentTableRows,
  $replyTextArea,
  loginName,
  topicOwnerName,
  updateCommentCells,
} from '../globals'
import { insertTextToReplyInput } from '../helpers'
import { processAvatar } from './avatar'
import { openTagsSetter, processReplyContent, updateMemberTag } from './content'

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

  const $popularBtn = $(
    `<span class="v2p-tool v2p-hover-btn"><span class="v2p-tool-icon">${iconHeart}</span>热门回复</span>`
  )
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

  {
    const commentBoxCount = $commentBox.find('.cell:first-of-type > span.gray')
    const countText = commentBoxCount.text()
    const newCountText = countText.substring(0, countText.indexOf('回复') + 2)
    const countTextSpan = `<span class="count-text">${newCountText}</span><span class="v2p-dot">·</span>${popularCount} 条热门回复`

    $popularBtn.on('click', () => {
      model.open()
    })

    commentBoxCount.empty().append(countTextSpan)
  }
}

/**
 * 设置回复的操作。
 */
function handlingControls(commentDataList: readonly CommentData[]) {
  const actionAreas = $commentTableRows.find('> td:last-of-type > .fr')

  actionAreas.each((i, el) => {
    const ctrlArea = $(el)

    const $controls = $('<span class="v2p-controls">')

    const $thankIcon = $(`<span class="v2p-control v2p-control-thank">${iconHeart}</span>`)

    const thankArea = ctrlArea.find('> .thank_area')
    const thanked = thankArea.hasClass('thanked')

    if (thanked) {
      $thankIcon.addClass('v2p-thanked')
      $controls.append($('<a>').append($thankIcon))
    } else {
      const thankEle = thankArea.find('> .thank')
      const $hide = thankEle.eq(0).removeClass('thank')
      const $thank = thankEle.eq(1).removeClass('thank')

      $hide.html(`<span class="v2p-control v2p-hover-btn v2p-control-hide">${iconHide}</span>`)

      $thankIcon.addClass('v2p-hover-btn').replaceAll($thank)

      $thankIcon.on('click', (ev) => {
        ev.stopPropagation()
        const data = commentDataList.at(i)

        if (data) {
          if (confirm(`确认花费 10 个铜币向 @${data.memberName} 的这条回复发送感谢？`)) {
            const replyId = data.id.split('_').at(1)

            if (replyId) {
              void thankReply({
                replyId,

                onSuccess: () => {
                  const $cell = ctrlArea.closest('.cell[id^="r_"]')
                  const $likesBox = $cell.find('> table .v2p-likes-box')
                  const likes = Number($likesBox.text())
                  const $clonedIconHeart = $likesBox.find('.v2p-icon-heart').clone()

                  if (likes > 0) {
                    $likesBox
                      .addClass('v2p-thanked')
                      .empty()
                      .append($clonedIconHeart, ` ${likes + 1}`)
                  } else {
                    $(`
                    <span class="small v2p-likes-box v2p-thanked" style="position:relative;top:-1px;">
                      &nbsp;&nbsp;<span class="v2p-icon-heart">${iconHeart}</span>1
                    </span>
                    `).insertAfter($cell.find('> table .ago'))
                  }

                  $thankIcon.addClass('v2p-thanked')
                  $hide.hide()
                  $thankIcon.off('click')
                  createToast({ message: `❤️ 已感谢 @${data.memberName} 的回复` })
                },

                onFail: () => {
                  createToast({ message: '❌ 感谢回复失败' })
                },
              })
            }
          }
        }
      })

      $controls.append($hide).append($thankIcon)
    }

    const $reply = ctrlArea.find('a:last-of-type')

    $reply
      .find('> img[alt="Reply"]')
      .replaceWith(`<span class="v2p-control v2p-hover-btn v2p-control-reply">${iconReply}</span>`)

    $controls.append($reply)

    thankArea.remove()

    const floorNum = ctrlArea.find('.no').clone()

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
          }
        }
      }
    })

    ctrlArea.empty().append($controls, floorNum)
  })
}

export async function handlingComments() {
  const storage = getStorageSync()

  const tagData = storage[StorageKey.MemberTag]
  const options = storage[StorageKey.Options]

  if (options.reply.preload !== 'off') {
    // 预价值多页回复，然后在同一页中显示，优化多页回复产生的楼中楼。

    const $paging = $('.v2p-paging')

    if ($paging.length > 0) {
      const $pagingTop = $paging.eq(0)
      const $pagingBottom = $paging.eq(1)
      const $pageNormal = $pagingTop.find('.page_normal')

      const toastControl = createToast({ message: '正在预加载回复，请稍候...', duration: 0 })

      try {
        const $pagingBottomNormal = $pagingBottom.find('.page_normal')

        const $pageCurrent = $pagingTop.find('.page_current')
        const currentPage = $pageCurrent.text()

        if (currentPage === '1') {
          const pages: string[] = []

          $pageNormal.each((i, ele) => {
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
      } catch {
        createToast({ message: '❌ 加载多页回复失败' })
        $pageNormal.removeClass('page_current').addClass('page_normal')
      }
    }
  }

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

      const content = $td.find('> .reply_content').text()
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

      return {
        id,
        memberName,
        memberLink,
        memberAvatar,
        content,
        likes,
        floor,
        index: idx,
        refMemberNames,
        refFloors,
        thanked,
      }
    })
    .get()

  {
    // 此区块的逻辑需要在处理嵌套评论前执行。

    const popupControl = createPopup({
      root: $commentBox,
      triggerType: 'hover',
      placement: 'right-start',
      offsetOptions: { mainAxis: 8, crossAxis: -4 },
    })
    const membersHasSetTags = new Set<Member['username']>()

    $commentCells.each((i, cellDom) => {
      const currentComment = commentDataList.at(i)

      if (currentComment?.id !== cellDom.id) {
        return
      }

      const $cellDom = $(cellDom)

      const { memberName, thanked } = currentComment

      processAvatar({
        $cellDom,
        popupControl,
        commentData: currentComment,
        onSetTagsClick: () => {
          openTagsSetter(memberName)
        },
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
        .replaceWith(`<span class="v2p-icon-heart">${iconHeart}</span>`)

      if (thanked) {
        $likesBox.addClass('v2p-thanked')
      }

      if (tagData && Reflect.has(tagData, memberName) && !membersHasSetTags.has(memberName)) {
        updateMemberTag(memberName, tagData[memberName].tags)
        membersHasSetTags.add(memberName)
      }
    })

    handlingControls(commentDataList)
    handlingPopularComments()
  }

  {
    const display = options.nestedReply.display

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

        if (!refMemberNames || refMemberNames.length === 0 || refMemberNames.length > 1) {
          return
        }

        for (const refName of refMemberNames) {
          // 从当前评论往前找，找到第一个引用的用户的评论，然后把当前评论插入到那个评论的后面。
          for (let j = i - 1; j >= 0; j--) {
            const { memberName: compareName, floor: eachFloor } = commentDataList.at(j) || {}

            if (compareName === refName) {
              const firstRefFloor = refFloors?.at(0)

              // 找到了指定回复的用户后，发现跟指定楼层对不上，则继续寻找。
              // 如果手动指定了楼层，那么就以指定的楼层为准（一般来说，由用户指定会更精确），否则就以第一个引用的用户的评论的楼层为准。
              if (firstRefFloor && firstRefFloor !== eachFloor) {
                const targetIdx = commentDataList
                  .slice(0, j)
                  .findIndex((data) => data.floor === firstRefFloor && data.memberName === refName)

                if (targetIdx >= 0) {
                  $commentCells.eq(targetIdx).append(cellDom)
                  return
                }
              }

              if (display === 'indent') {
                cellDom.classList.add('v2p-indent')
              }

              $commentCells.eq(j).append(cellDom)
              return
            }
          }
        }
      }
    })
  }
}
