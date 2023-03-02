import { computePosition, flip, offset, shift } from '@floating-ui/dom'

import {
  $commentBox,
  $commentCells,
  $commentTableRows,
  commentDataList,
  getOS,
  loginName,
  topicOwnerName,
} from '../globals'
import { iconEmoji, iconHeart, iconHide, iconReply } from '../icons'

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

  const cmMask = $('<div class="v2p-cm-mask">')
  const cmContent = $(`
      <div class="v2p-cm-content box">
        <div class="v2p-cm-bar">
          <span>本页共有 ${popularCommentData.length} 条热门回复</span>
          <button class="v2p-cm-close-btn normal button">关闭<kbd>Esc</kbd></button>
        </div>
      </div>
    `)
  const cmContainer = cmMask.append(cmContent).hide()

  {
    const commentBoxCount = $commentBox.find('.cell:first-of-type > span.gray')
    const countText = commentBoxCount.text()
    const newCountText = countText.substring(0, countText.indexOf('回复') + 2)
    const countTextSpan = `<span class="count-text">${newCountText}</span><span class="v2p-dot">·</span>`

    let boundEvent = false

    const docClickHandler = (e: JQuery.ClickEvent) => {
      if ($(e.target).closest(cmContent).length === 0) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        handleModalClose()
      }
    }

    const keyupHandler = (e: JQuery.KeyDownEvent) => {
      if (e.key === 'Escape') {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        handleModalClose()
      }
    }

    const handleModalClose = () => {
      $(document).off('click', docClickHandler)
      $(document).off('keydown', keyupHandler)
      boundEvent = false

      cmContainer.fadeOut('fast')
      document.body.classList.remove('modal-open')
    }

    const handleModalOpen = () => {
      if (!boundEvent) {
        $(document).on('click', docClickHandler)
        $(document).on('keydown', keyupHandler)
        boundEvent = true
      }

      cmContainer.fadeIn('fast')
      document.body.classList.add('modal-open')
    }

    const closeBtn = cmContainer.find('.v2p-cm-close-btn')
    closeBtn.on('click', handleModalClose)

    const popularBtn = $(
      `<span class="v2p-popular-btn v2p-hover-btn"><span class="v2p-icon-heart">${iconHeart}</span>查看本页感谢回复</span>`
    )
    popularBtn.on('click', (e) => {
      e.stopPropagation()
      handleModalOpen()
    })

    commentBoxCount.empty().append(countTextSpan).append(popularBtn)
  }

  const templete = $('<templete></templete>')

  popularCommentData.forEach(({ index }) => {
    templete.append($commentCells.eq(index).clone())
  })

  cmContent.append(templete.html())

  $commentBox.append(cmContainer)
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

  const replyTextArea = window.document.querySelector('#reply_content')

  const replyBtn = $(
    `<button class="normal button">回复<kbd>${os === 'macos' ? 'Cmd' : 'Ctrl'}+Enter</kbd></button>`
  ).replaceAll($('#reply-box input[type="submit"]'))

  const emoticons = [
    {
      title: 'Smileys',
      list: [
        '😀',
        '😃',
        '😄',
        '😁',
        '😆',
        '😅',
        '🤣',
        '😂',
        '🙂',
        '🙃',
        '😉',
        '😮',
        '😲',
        '😳',
        '😱',
        '😭',
        '😞',
        '😓',
        '😩',
        '😚',
        '🤭',
        '😏',
        '😒',
        '😡',
        '😤',
      ],
    },
    {
      title: 'Others',
      list: ['👻', '👋', '🤚', '🖐', '🖖', '🐶', '🐔', '🤡', '💩'],
    },
  ]

  const emoticonGroup = $('<div class="v2p-emoji-group">')
  const emoticonList = $('<div class="v2p-emoji-list">')
  const emoticonSpan = $('<span class="v2p-emoji">')

  const groups = emoticons.map((emojiGroup) => {
    const group = emoticonGroup.clone()

    group.append(`<div class="v2p-emoji-name">${emojiGroup.title}</div>`)

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

  const docClickHandler = (e: JQuery.ClickEvent) => {
    if ($(e.target).closest(emojiPopup).length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      handlePopupClose()
    }
  }

  const handlePopupClose = () => {
    $(document).off('click', docClickHandler)
    emojiPopup.style.visibility = 'hidden'
  }

  const handlePopupOpen = () => {
    $(document).on('click', docClickHandler)

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
    /**
     * 替换感谢的爱心。
     */
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
      const commentFromIndex = commentDataList.at(i)

      // 先根据索引去找，如果能对应上就不需要再去 find 了，这样能加快处理速度。
      const currentComment =
        commentFromIndex?.id === cellDom.id
          ? commentFromIndex
          : commentDataList.find((data) => data.id === cellDom.id)

      if (currentComment) {
        const { memberName, refMemberNames, refFloors } = currentComment

        if (memberName === loginName && memberName !== topicOwnerName) {
          $(cellDom).find('.badges').append('<div class="badge you">YOU</div>')
        }

        const firstRefMemberName = refMemberNames?.at(0)
        const firstRefFloor = refFloors?.at(0)

        if (firstRefMemberName) {
          for (let j = i - 1; j >= 0; j--) {
            const { memberName: eachMemberName, floor: eachFloor } = commentDataList.at(j) || {}

            if (eachMemberName === firstRefMemberName) {
              // 首先以用户手动指定的楼层为准。
              if (firstRefFloor && firstRefFloor !== eachFloor) {
                const targetIdx = commentDataList
                  .slice(0, j)
                  .findIndex((data) => data.floor === firstRefFloor)

                if (targetIdx >= 0) {
                  $commentCells.eq(targetIdx).append(cellDom)
                  break
                }
              }

              $commentCells.eq(j).append(cellDom)
              break
            }
          }
        }
      }
    })
  }

  insertEmojiBox()
}
