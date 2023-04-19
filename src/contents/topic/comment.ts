import { createButton } from '../../components/button'
import { createModel } from '../../components/model'
import { createPopup, type PopupControl } from '../../components/popup'
import { createToast } from '../../components/toast'
import { emoticons, MAX_CONTENT_HEIGHT, READABLE_CONTENT_HEIGHT } from '../../constants'
import { iconEmoji, iconHeart, iconHide, iconReply } from '../../icons'
import { fetchUserInfo } from '../../services'
import type { CommentData, Member } from '../../types'
import { escapeHTML, formatTimestamp, getOptions, getOS } from '../../utils'
import {
  $commentBox,
  $commentCells,
  $commentTableRows,
  $replyBox,
  commentDataList,
  loginName,
  topicOwnerName,
} from '../globals'
import { focusReplyInput, insertTextToReplyInput } from '../helpers'

let memberDataCache = new Map<Member['username'], Member>()

/**
 * 点击头像会展示该用户的信息。
 */
function processAvatar(cellDom: HTMLElement, popupControl: PopupControl, commentData: CommentData) {
  let abortController: AbortController | null = null

  const $avatar = $(cellDom).find('.avatar')

  $avatar.on('click', () => {
    popupControl.close()
    popupControl.open($avatar)

    const $content = $(`
      <div class="v2p-member-card">
        <div class="v2p-info">
          <div class="v2p-info-left">
            <div class="v2p-avatar-box"></div>
          </div>

          <div class="v2p-info-right">
            <div class="v2p-username v2p-loading"></div>
            <div class="v2p-no v2p-loading"></div>
            <div class="v2p-created-date v2p-loading"></div>
          </div>
        </div>
      </div>
    `)

    popupControl.$content.empty().append($content)

    void (async () => {
      const memberName = commentData.memberName

      // 缓存用户卡片的信息，只有在无缓存时才请求远程数据。
      if (!memberDataCache.has(memberName)) {
        abortController = new AbortController()

        popupControl.onClose = () => {
          abortController?.abort()
        }

        try {
          const memberData = await fetchUserInfo(memberName, {
            signal: abortController.signal,
          })

          memberDataCache = memberDataCache.set(memberName, memberData)
        } catch (err) {
          if (err && typeof err === 'object' && 'name' in err && err.name !== 'AbortError') {
            $content.html(`<span>获取用户信息失败</span>`)
          }
          return null
        }
      }

      const data = memberDataCache.get(memberName)

      if (data) {
        $content
          .find('.v2p-avatar-box')
          .removeClass('v2p-loading')
          .append(`<img class="v2p-avatar" src="${data.avatar_large}">`)

        const options = await getOptions()
        const $memberName = $(`<a href="${data.url}">${data.username}</a>`)
        if (options.openInNewTab) {
          $memberName.prop('target', '_blank')
        }
        $content.find('.v2p-username').removeClass('v2p-loading').append($memberName)

        $content.find('.v2p-no').removeClass('v2p-loading').text(`V2EX 第 ${data.id} 号会员`)

        $content
          .find('.v2p-created-date')
          .removeClass('v2p-loading')
          .text(`加入于 ${formatTimestamp(data.created)}`)

        if (data.bio && data.bio.trim().length > 0) {
          $content.append(`<div class="v2p-bio">${data.bio}</div>`)
        }
      }
    })()
  })
}

/**
 * 处理回复内容：
 *  - 过长内容会被折叠。
 */
function processReplyContent(cellDom: HTMLElement) {
  const $cellDom = $(cellDom)

  if ($cellDom.find('.v2p-reply-content').length > 0) {
    return
  }

  const $replyContent = $cellDom.find('.reply_content')

  const contentHeight = $replyContent.height() ?? 0

  const shouldCollapsed = contentHeight + READABLE_CONTENT_HEIGHT >= MAX_CONTENT_HEIGHT

  if (shouldCollapsed) {
    const collapsedCSS = {
      maxHeight: `${READABLE_CONTENT_HEIGHT}px`,
      overflow: 'hidden',
      paddingBottom: '0',
    }

    const $contentBox = $('<div class="v2p-reply-content v2p-collapsed">').css(collapsedCSS)

    const $expandBtn = createButton({ children: '展开回复', className: 'v2p-expand-btn' })

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

  const popularCount = popularCommentData.length

  if (popularCount <= 0) {
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
        processReplyContent(cellDom)
      })
    },
  })

  {
    const commentBoxCount = $commentBox.find('.cell:first-of-type > span.gray')
    const countText = commentBoxCount.text()
    const newCountText = countText.substring(0, countText.indexOf('回复') + 2)
    const countTextSpan = `<span class="count-text">${newCountText}</span><span class="v2p-dot">·</span>${popularCount} 条热门回复`

    const $popularBtn = $(
      `<span class="v2p-tool v2p-hover-btn"><span class="v2p-tool-icon">${iconHeart}</span>热门回复</span>`
    )

    $popularBtn.on('click', () => {
      model.open()
    })

    $('.v2p-tools').prepend($popularBtn)

    commentBoxCount.empty().append(countTextSpan)
  }
}

/**
 * 设置回复的操作。
 */
function handlingControls() {
  const crtlAreas = $commentTableRows.find('> td:last-of-type > .fr')

  crtlAreas.each((_, el) => {
    const ctrlArea = $(el)

    const $controls = $('<span class="v2p-controls">')

    const thankIcon = $(`<span class="v2p-control v2p-control-thank">${iconHeart}</span>`)

    const thankArea = ctrlArea.find('> .thank_area')
    const thanked = thankArea.hasClass('thanked')

    if (thanked) {
      thankIcon.addClass('v2p-thanked')
      $controls.append($('<a>').append(thankIcon))
    } else {
      const thankEle = thankArea.find('> .thank')
      const $hide = thankEle.eq(0).removeClass('thank')
      const $thank = thankEle.eq(1).removeClass('thank')

      $hide.html(`<span class="v2p-control v2p-hover-btn v2p-control-hide">${iconHide}</span>`)

      thankIcon.addClass('v2p-hover-btn')
      $thank.empty().append(thankIcon)

      $thank.on('click', () => {
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

        thankIcon.addClass('v2p-thanked')
        $hide.hide()
        $thank.off('click')
        createToast({ message: '❤️ 已感谢回复' })
      })

      $controls.append($hide).append($thank)
    }

    const $reply = ctrlArea.find('a:last-of-type')

    $reply
      .find('> img[alt="Reply"]')
      .replaceWith(`<span class="v2p-control v2p-hover-btn v2p-control-reply">${iconReply}</span>`)

    $controls.append($reply)

    thankArea.remove()

    const floorNum = ctrlArea.find('.no').clone()

    ctrlArea.empty().append($controls, floorNum)
  })
}

/**
 * 插入表情到回复框。
 */
function insertEmojiBox() {
  const os = getOS()

  const $replyBtn = createButton({
    children: `回复<kbd>${os === 'macos' ? 'Cmd' : 'Ctrl'}+Enter</kbd>`,
    type: 'submit',
  }).replaceAll($replyBox.find('input[type="submit"]'))

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
            insertTextToReplyInput(emoji)
          })
        return emoticon
      })
    )

    group.append(list)

    return group
  })
  const emoticonsBox = $('<div class="v2p-emoticons-box">').append(groups)

  const $emojiBtn = createButton({ children: iconEmoji }).insertAfter($replyBtn)

  const $emojiContent = $('<div class="v2p-emoji-container">')
    .append(emoticonsBox)
    .appendTo($replyBox)
    .on('click', () => {
      focusReplyInput()
    })

  const keyupHandler = (ev: JQuery.KeyDownEvent) => {
    if (ev.key === 'Escape') {
      ev.preventDefault()
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      emojiPopup.close()
    }
  }

  $emojiBtn.on('click', () => {
    focusReplyInput()
  })

  const emojiPopup = createPopup({
    root: $replyBox,
    trigger: $emojiBtn,
    content: $emojiContent,
    options: { placement: 'right-end' },
    onOpen: () => {
      $('body').on('keydown', keyupHandler) // 在 body 上监听，因为需要比关闭评论框的快捷键(Esc)先执行，否则会先关闭评论框。
    },
    onClose: () => {
      $('body').off('keydown', keyupHandler)
    },
  })

  {
    // 给“取消回复框停靠”、“回到顶部”按钮添加样式。
    $replyBox
      .find('#undock-button, #undock-button + a')
      .addClass('v2p-hover-btn')
      .css('padding', '5px 4px')
  }
}

export async function handlingComments() {
  {
    // 此区块的逻辑需要在处理嵌套评论前执行。

    const popupControl = createPopup({ root: $commentBox })

    $commentCells.each((i, cellDom) => {
      const currentComment = commentDataList.at(i)

      if (currentComment?.id !== cellDom.id) {
        return
      }

      // 处理头像点击事件。
      processAvatar(cellDom, popupControl, currentComment)

      const $cellDom = $(cellDom)

      const { memberName, thanked } = currentComment

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
    })

    handlingControls()
    handlingPopularComments()
  }

  {
    const options = await getOptions()

    const display = options.nestedReply.display

    $commentCells.each((i, cellDom) => {
      const dataFromIndex = commentDataList.at(i)

      processReplyContent(cellDom)

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

  insertEmojiBox()
}
