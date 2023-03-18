import { computePosition, flip, offset, shift } from '@floating-ui/dom'

import { emoticons, MAX_CONTENT_HEIGHT, READABLE_CONTENT_HEIGHT } from '../../constants'
import { fetchUserInfo } from '../../services'
import type { CommentData } from '../../types'
import { formatTimestamp, getOS } from '../../utils'
import {
  $commentBox,
  $commentCells,
  $commentTableRows,
  commentDataList,
  createModel,
  loginName,
  topicOwnerName,
} from '../globals'
import { iconEmoji, iconHeart, iconHide, iconReply } from '../../icons'

/**
 * 点击头像会展示改用户的信息。
 */
function processAvatar(cellDom: HTMLElement, commentData: CommentData) {
  const memberPopup = $('<div id="v2p-member-popup" tabindex="0">').appendTo($commentBox).get(0)!

  let abortController: AbortController | null = null

  const docClickHandler = (e: JQuery.ClickEvent) => {
    if ($(e.target).closest(memberPopup).length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      handlePopupClose()
    }
  }

  const handlePopupClose = () => {
    abortController?.abort()
    memberPopup.style.visibility = 'hidden'
    memberPopup.innerHTML = ''
    $(document).off('click', docClickHandler)
  }

  const $avatar = $(cellDom).find('.avatar')

  $avatar.on('click', (e) => {
    abortController = new AbortController()

    if (memberPopup.style.visibility === 'visible') {
      handlePopupClose()
    } else {
      e.stopPropagation()

      $(document).on('click', docClickHandler)

      const avatar = $avatar.get(0)!

      computePosition(avatar, memberPopup, {
        placement: 'bottom-start',
        middleware: [offset({ mainAxis: 10, crossAxis: -4 }), flip(), shift({ padding: 8 })],
      })
        .then(({ x, y }) => {
          Object.assign(memberPopup.style, {
            left: `${x}px`,
            top: `${y}px`,
          })
          memberPopup.style.visibility = 'visible'
        })
        .catch((err) => {
          console.error('计算位置失败', err)
          handlePopupClose()
        })

      const $memberPopup = $(memberPopup)

      const $content = $(`
              <div class="v2p-ctn">
                <div class="v2p-ctn-left">
                  <div class="v2p-avatar-box"></div>
                </div>

                <div class="v2p-ctn-right">
                  <div class="v2p-username v2p-loading"></div>
                  <div class="v2p-no v2p-loading"></div>
                  <div class="v2p-created-date v2p-loading"></div>
                </div>
              </div>
              `)

      $memberPopup.append($content)

      setTimeout(() => {
        fetchUserInfo(commentData.memberName, {
          signal: abortController?.signal,
        })
          .then((data) => {
            $memberPopup
              .find('.v2p-avatar-box')
              .removeClass('v2p-loading')
              .append(`<img class="v2p-avatar" src="${data.avatar_large}">`)
            $memberPopup.find('.v2p-username').removeClass('v2p-loading').text(data.username)
            $memberPopup
              .find('.v2p-no')
              .removeClass('v2p-loading')
              .text(`V2EX 第 ${data.id} 号会员`)
            $memberPopup
              .find('.v2p-created-date')
              .removeClass('v2p-loading')
              .text(`加入于 ${formatTimestamp(data.created)}`)

            if (data.bio && data.bio.trim().length > 0) {
              $memberPopup.append(`<div class="v2p-bio">${data.bio}</div>`)
            }

            // const userComments = commentDataList.filter(
            //   (data) => data.memberName === dataFromIndex.memberName
            // )
            // 如果回复多于一条：
            // if (userComments.length > 1) {
            //   const $replyList = $(
            //     `<div class="v2p-reply-list-box"><div>本页回复了：</div></div>`
            //   )
            //   $replyList.append(`
            //   <ul class="v2p-reply-list">
            //     ${userComments
            //       .map(({ content }) => {
            //         return `<li>${content}</li>`
            //       })
            //       .join('')}
            //   </ul>
            //   `)
            //   $memberPopup.append($replyList)
            // }
          })
          .catch((err: { name: string }) => {
            if (err.name !== 'AbortError') {
              $memberPopup.html(`<span>获取用户信息失败</span>`)
            }
          })
      }, 0)
    }
  })
}

/**
 * 处理回复内容，过长内容会被折叠。
 */
function processReplyContent(cellDom: HTMLElement) {
  const $cellDom = $(cellDom)

  if ($cellDom.find('.v2p-reply-content').length > 0) {
    return
  }

  const $replyContent = $cellDom.find('.reply_content')

  const height = $replyContent.height() ?? 0

  const shouldCollapsed = height + READABLE_CONTENT_HEIGHT >= MAX_CONTENT_HEIGHT

  if (shouldCollapsed) {
    const collapsedCSS = {
      maxHeight: `${READABLE_CONTENT_HEIGHT}px`,
      overflow: 'hidden',
      paddingBottom: '0',
    }

    const $contentBox = $('<div class="v2p-reply-content v2p-collapsed">').css(collapsedCSS)

    const $expandBtn = $('<button class="v2p-expand-btn normal button">展开回复</button>')

    const toggleContent = () => {
      const collapsed = $contentBox.hasClass('v2p-collapsed')

      $contentBox
        .toggleClass('v2p-collapsed')
        .css(
          collapsed ? { maxHeight: 'none', overflow: 'auto', paddingBottom: '40px' } : collapsedCSS
        )
      $expandBtn.html(collapsed ? '收起回复' : '展开回复')
    }

    $expandBtn.on('click', () => {
      toggleContent()
    })

    $contentBox.append($replyContent.clone()).replaceAll($replyContent).append($expandBtn)
  }
}

/**
 * 设置热门回复。
 */
function handlingPopularComments() {
  const popularCommentData = commentDataList
    .filter(({ likes }) => likes > 0)
    .sort((a, b) => b.likes - a.likes)

  if (popularCommentData.length <= 0) {
    return
  }

  const model = createModel({
    root: $commentBox,
    title: `本页共有 ${popularCommentData.length} 条热门回复`,
    onMount: ({ $modelContent }) => {
      const templete = $('<templete></templete>')

      popularCommentData.forEach(({ index }) => {
        templete.append($commentCells.eq(index).clone())
      })

      $modelContent.css({ padding: '0 20px' }).append(templete.html())
    },
    onOpen: ({ $modelContainer }) => {
      $modelContainer.find('.cell[id^="r_"]').each((_, cellDom) => {
        processReplyContent(cellDom)
      })
    },
  })

  {
    const commentBoxCount = $commentBox.find('.cell:first-of-type > span.gray')
    const countText = commentBoxCount.text()
    const newCountText = countText.substring(0, countText.indexOf('回复') + 2)
    const countTextSpan = `<span class="count-text">${newCountText}</span><span class="v2p-dot">·</span>`

    const $popularBtn = $(
      `<span class="v2p-popular-btn v2p-hover-btn"><span class="v2p-icon-heart">${iconHeart}</span>查看本页感谢回复</span>`
    )

    $popularBtn.on('click', () => {
      model.open()
    })

    commentBoxCount.empty().append(countTextSpan).append($popularBtn)
  }
}

/**
 * 设置回复的操作。
 */
function handlingControls() {
  const crtlAreas = $commentTableRows.find('> td:last-of-type > .fr')

  crtlAreas.each((_, el) => {
    const ctrlArea = $(el)

    const crtlContainer = $('<span class="v2p-controls">')

    const thankIcon = $(`<span class="v2p-control">${iconHeart}</span>`)

    const thankArea = ctrlArea.find('> .thank_area')
    const thanked = thankArea.hasClass('thanked')

    if (thanked) {
      thankIcon.prop('title', '已感谢').css({ color: '#f43f5e', cursor: 'default' })
      crtlContainer.append($('<a>').append(thankIcon))
    } else {
      const thankEle = thankArea.find('> .thank')
      const hide = thankEle.eq(0).removeClass('thank')
      const thank = thankEle.eq(1).removeClass('thank')

      hide.html(`<span class="v2p-control v2p-hover-btn" title="隐藏">${iconHide}</span>`)

      thankIcon.prop('title', '感谢').addClass('v2p-hover-btn')
      thank.empty().append(thankIcon)

      crtlContainer.append(hide).append(thank)
    }

    const reply = ctrlArea.find('a:last-of-type')

    reply
      .find('> img[alt="Reply"]')
      .replaceWith(
        `<span class="v2p-control v2p-ac-reply v2p-hover-btn" title="回复">${iconReply}</span>`
      )

    crtlContainer.append(reply)

    thankArea.remove()
    const floorNum = ctrlArea.find('.no').clone()
    ctrlArea.empty().append(crtlContainer, floorNum)
  })
}

/**
 * 插入表情到回复框。
 */
function insertEmojiBox() {
  const os = getOS()

  const replyTextArea = document.querySelector('#reply_content')

  const replyBtn = $(
    `<button class="normal button">回复<kbd>${os === 'macos' ? 'Cmd' : 'Ctrl'}+Enter</kbd></button>`
  ).replaceAll($('#reply-box input[type="submit"]'))

  const emoticonGroup = $('<div class="v2p-emoji-group">')
  const emoticonList = $('<div class="v2p-emoji-list">')
  const emoticonSpan = $('<span class="v2p-emoji">')

  const groups = emoticons.map((emojiGroup) => {
    const group = emoticonGroup.clone()

    group.append(`<div class="v2p-emoji-title">${emojiGroup.title}</div>`)

    const list = emoticonList.clone().append(
      emojiGroup.list.map((emoji) => {
        const emoticon = emoticonSpan
          .clone()
          .text(emoji)
          .on('click', () => {
            if (replyTextArea instanceof HTMLTextAreaElement) {
              const startPos = replyTextArea.selectionStart
              const endPos = replyTextArea.selectionEnd

              const valueToStart = replyTextArea.value.substring(0, startPos)
              const valueFromEnd = replyTextArea.value.substring(endPos, replyTextArea.value.length)
              replyTextArea.value = `${valueToStart}${emoji}${valueFromEnd}`

              replyTextArea.focus()

              replyTextArea.selectionStart = replyTextArea.selectionEnd = startPos + emoji.length
            }
          })
        return emoticon
      })
    )

    group.append(list)

    return group
  })
  const emoticonsBox = $('<div class="v2p-emoticons-box">').append(groups)

  const emojiBtn = $(
    `<button type="button" class="normal button">${iconEmoji}</button>`
  ).insertAfter(replyBtn)

  const emojiPopup = $('<div id="v2p-emoji-popup">')
    .append(emoticonsBox)
    .appendTo($('#reply-box'))
    .get(0)!

  const keyupHandler = (e: JQuery.KeyDownEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation() // 需要比关闭评论框的快捷键(Esc)先执行，否则会先关闭评论框。

      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      handlePopupClose()
    }
  }

  const docClickHandler = (e: JQuery.ClickEvent) => {
    if ($(e.target).closest(emojiPopup).length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      handlePopupClose()
    }
  }

  const handlePopupClose = () => {
    emojiPopup.style.visibility = 'hidden'
    $(document).off('click', docClickHandler)
    $('body').off('keydown', keyupHandler)
  }

  const handlePopupOpen = () => {
    $(document).on('click', docClickHandler)
    $('body').on('keydown', keyupHandler)

    computePosition(emojiBtn.get(0)!, emojiPopup, {
      placement: 'right-end',
      middleware: [offset({ mainAxis: 10, crossAxis: 8 }), flip(), shift({ padding: 8 })],
    })
      .then(({ x, y }) => {
        Object.assign(emojiPopup.style, {
          left: `${x}px`,
          top: `${y}px`,
        })
        emojiPopup.style.visibility = 'visible'
      })
      .catch(() => {
        handlePopupClose()
      })
  }

  emojiBtn.on('click', (e) => {
    e.stopPropagation()

    if (emojiPopup.style.visibility === 'visible') {
      handlePopupClose()
    } else {
      handlePopupOpen()
    }

    if (replyTextArea instanceof HTMLTextAreaElement) {
      replyTextArea.focus()
    }
  })
}

export function handlingComments() {
  {
    // 替换感谢的爱心。
    $commentCells
      .find('.small.fade')
      .addClass('v2p-heart-box')
      .find('img[alt="❤️"]')
      .replaceWith(`<span class="v2p-icon-heart">${iconHeart}</span>`)
  }

  handlingControls()
  handlingPopularComments()

  {
    $commentCells.each((i, cellDom) => {
      const dataFromIndex = commentDataList.at(i)

      // 处理头像点击事件。
      if (dataFromIndex) {
        processAvatar(cellDom, dataFromIndex)
      }

      processReplyContent(cellDom)

      // 先根据索引去找，如果能对应上就不需要再去 find 了，这样能加快处理速度。
      const currentComment =
        dataFromIndex?.id === cellDom.id
          ? dataFromIndex
          : commentDataList.find((data) => data.id === cellDom.id)

      if (currentComment) {
        const { memberName, refMemberNames, refFloors } = currentComment

        if (memberName === loginName && memberName !== topicOwnerName) {
          $(cellDom).find('.badges').append('<div class="badge you">YOU</div>')
        }

        if (!refMemberNames || refMemberNames.length === 0) {
          return
        }

        for (const refName of refMemberNames) {
          // 从当前评论往前找，找到第一个引用的用户的评论，然后把当前评论插入到那个评论的后面。
          for (let j = i - 1; j >= 0; j--) {
            const { memberName: compareName, floor: eachFloor } = commentDataList.at(j) || {}

            if (compareName === refName) {
              const firstRefFloor = refFloors?.at(0)

              // 如果手动指定了楼层，那么就以指定的楼层为准（一般来说，由用户指定会更精确），否则就以第一个引用的用户的评论的楼层为准。
              if (firstRefFloor && firstRefFloor !== eachFloor) {
                const targetIdx = commentDataList
                  .slice(0, j)
                  .findIndex((data) => data.floor === firstRefFloor)

                if (targetIdx >= 0) {
                  $commentCells.eq(targetIdx).append(cellDom)
                  return
                }
              }

              $commentCells.eq(j).append(cellDom)
              return
            }
          }
        }
      }
    })
  }

  insertEmojiBox()
}
