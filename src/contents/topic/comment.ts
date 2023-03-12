import { computePosition, flip, offset, shift } from '@floating-ui/dom'

import { emoticons, MAX_CONTENT_HEIGHT, READABLE_CONTENT_HEIGHT, V2EX } from '../../constants'
import type { Member } from '../../types'
import { formatTimestamp, getOS } from '../../utils'
import {
  $commentBox,
  $commentCells,
  $commentTableRows,
  commentDataList,
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
      // 通过判定点击的元素是否在评论框内来判断是否关闭评论框。
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
      document.body.classList.remove('v2p-modal-open')
    }

    const handleModalOpen = () => {
      if (!boundEvent) {
        $(document).on('click', docClickHandler)
        $(document).on('keydown', keyupHandler)
        boundEvent = true
      }

      cmContainer.fadeIn('fast')
      document.body.classList.add('v2p-modal-open')
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
      e.stopPropagation() // 需要比关闭评论框的快捷键先执行，否则会先关闭评论框。

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

    $commentCells.each((i, cellDom) => {
      const dataFromIndex = commentDataList.at(i)

      // 处理头像点击事件。
      if (dataFromIndex) {
        const avatar = cellDom.querySelector('.avatar')

        avatar?.addEventListener('click', (e) => {
          abortController = new AbortController()

          if (memberPopup.style.visibility === 'visible') {
            handlePopupClose()
          } else {
            e.stopPropagation()

            $(document).on('click', docClickHandler)

            const userComments = commentDataList.filter(
              (data) => data.memberName === dataFromIndex.memberName
            )

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
              .catch(() => {
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
              fetch(`${V2EX.API}/members/show.json?username=${dataFromIndex.memberName}`, {
                signal: abortController?.signal,
              })
                .then((res) => res.json())
                .then((data: Member) => {
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

                  // 如果回复多于一条：
                  if (userComments.length > 1) {
                    const $replyList = $(
                      `<div class="v2p-reply-list-box"><div>本页回复了：</div></div>`
                    )
                    $replyList.append(`
                    <ul class="v2p-reply-list">
                      ${userComments
                        .map(({ content }) => {
                          return `<li>${content}</li>`
                        })
                        .join('')}
                    </ul>
                    `)
                    $memberPopup.append($replyList)
                  }
                })
                .catch((err: { name: string }) => {
                  if (err.name !== 'AbortError') {
                    $memberPopup.append(`<span>获取用户信息失败</span>`)
                  }
                })
            }, 0)
          }
        })
      }

      {
        const replyContentBox = cellDom.querySelector('.reply_content')

        if (replyContentBox instanceof HTMLElement) {
          const eleHeight = replyContentBox.getBoundingClientRect().height

          const shouldCollapsed = eleHeight + READABLE_CONTENT_HEIGHT >= MAX_CONTENT_HEIGHT

          if (shouldCollapsed) {
            const expandBtn = document.createElement('button')
            expandBtn.classList.add('v2p-expand-btn', 'normal', 'button')

            const toggleContent = () => {
              const hasCollapsed = replyContentBox.classList.contains('v2p-reply-limit-content')

              replyContentBox.classList.toggle('v2p-reply-limit-content')
              replyContentBox.style.maxHeight = hasCollapsed
                ? 'none'
                : `${READABLE_CONTENT_HEIGHT}px`
              replyContentBox.style.overflow = hasCollapsed ? 'auto' : 'hidden'
              replyContentBox.style.paddingBottom = hasCollapsed ? '40px' : '0'
              expandBtn.innerText = hasCollapsed ? '收起回复' : '展开回复'
            }

            toggleContent()

            expandBtn.addEventListener('click', () => {
              toggleContent()
            })

            replyContentBox.appendChild(expandBtn)
          }
        }
      }

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
