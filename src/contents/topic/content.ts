import { createButton } from '../../components/button'
import { createModal } from '../../components/modal'
import {
  emojiLinks,
  Links,
  MAX_CONTENT_HEIGHT,
  READABLE_CONTENT_HEIGHT,
  StorageKey,
} from '../../constants'
import type { Member, Options, Tag } from '../../types'
import { getStorage, getStorageSync } from '../../utils'
import {
  $body,
  $commentCells,
  $topicContentBox,
  $topicHeader,
  topicId,
  topicOwnerName,
} from '../globals'
import { getTagsText, loadIcons, setMemberTags } from '../helpers'

/**
 * 处理主题的正文内容。
 */
export function handleContent() {
  const storage = getStorageSync()
  const options = storage[StorageKey.Options]

  if (options.openInNewTab) {
    $topicContentBox
      .find('.topic_content a[href]')
      .prop('target', '_blank')
      .prop('rel', 'noopener noreferrer')
  }

  {
    const $topicContents = $topicContentBox.find('.subtle > .topic_content')

    const textLength = $topicContents.text().length

    if (textLength >= 200) {
      $topicContents.each((_, topicContent) => {
        if (textLength >= 400) {
          topicContent.style.fontSize = '14px'
        }
        topicContent.style.fontSize = '14.5px'
      })
    }
  }

  {
    const $topicBtns = $('.topic_buttons')
    const $topicBtn = $topicBtns.find('.tb').addClass('v2p-tb v2p-hover-btn')
    const $favoriteBtn = $topicBtn.eq(0)
    $favoriteBtn.append('<span class="v2p-tb-icon"><i data-lucide="star"></i></span>')
    $topicBtn.eq(1).append('<span class="v2p-tb-icon"><i data-lucide="twitter"></i></span>')
    $topicBtn.eq(2).append('<span class="v2p-tb-icon"><i data-lucide="eye-off"></i></span>')
    $topicBtn.eq(3).append('<span class="v2p-tb-icon"><i data-lucide="heart"></i></span>')

    if (topicId) {
      $topicBtns.append(
        ` &nbsp;<a href="${Links.Share}/${topicId}" target="_blank" class="tb v2p-tb v2p-hover-btn">分享<span class="v2p-tb-icon"><i data-lucide="arrow-up-right-square"></i></span></a>`
      )
    }

    loadIcons()

    // const url = $favoriteBtn.attr('href')

    // 在不刷新页面下执行主题的收藏操作。
    // ! 不刷新页面的话，会导致获取不到最新的 once 参数，从而导致接口请求异常。
    // if (typeof url === 'string') {
    //   let hasFavorited = !url.startsWith('/favorite')

    //   $favoriteBtn.attr('href', 'javascript:').on('click', () => {
    //     void (async () => {
    //       createToast({ message: hasFavorited ? '正在取消收藏...' : '正在加入收藏...' })
    //       $favoriteBtn.css('pointer-events', 'none')
    //       const originalContent = $favoriteBtn.html()

    //       try {
    //         if (hasFavorited) {
    //           $favoriteBtn.html($favoriteBtn.html().replace('取消收藏', '取消中...'))
    //           await unfavorite(url.replace('/favorite', '/unfavorite'))
    //           $favoriteBtn.html($favoriteBtn.html().replace('取消中...', '加入收藏'))
    //           hasFavorited = false
    //         } else {
    //           $favoriteBtn.html($favoriteBtn.html().replace('加入收藏', '收藏中...'))
    //           await addFavorite(url)
    //           $favoriteBtn.html($favoriteBtn.html().replace('收藏中...', '取消收藏'))
    //           hasFavorited = true
    //         }
    //       } catch (err) {
    //         $favoriteBtn.html(originalContent)
    //         if (err instanceof Error) {
    //           createToast({ message: `❌ ${err.message}` })
    //         }
    //       } finally {
    //         $favoriteBtn.css('pointer-events', 'auto')
    //       }
    //     })()
    //   })
    // }
  }
}

/**
 * 处理回复内容：
 *  - 过长内容会被折叠。
 *  - 对同一个元素重复执行此方法时，效果不会叠加。
 */
export function processReplyContent($cellDom: JQuery) {
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

export interface CallbackFunctions {
  onRemoveExistingTagBlock?: () => void
  onInsertNewTagBlock?: (params: { $tags: JQuery }) => void
}

/**
 * 根据用户的昵称设置用户标签，会把标签插入到 cells 中。
 */
export function updateMemberTag(
  params: {
    memberName: Member['username']
    memberAvatar?: Member['avatar']
    tags: Tag[] | undefined
    options: Options
  } & CallbackFunctions
) {
  const { memberName, memberAvatar, tags, options, ...callbacks } = params

  const $v2pTags = $(`.v2p-tags-${memberName}`)

  const tagsText = tags ? getTagsText(tags) : undefined

  if ($v2pTags.length > 0) {
    if (tagsText) {
      $v2pTags.html(`<b>#</b>&nbsp;${tagsText}`)
    } else {
      $v2pTags.remove()
      callbacks.onRemoveExistingTagBlock?.()
    }
  } else {
    if (tagsText) {
      const $tags = $(
        `<div class="v2p-reply-tags v2p-tags-${memberName}" title="${tagsText}"><b>#</b>&nbsp;${tagsText}</div>`
      )

      $tags.on('click', () => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        openTagsSetter({ memberName, memberAvatar, ...callbacks })
      })

      if (callbacks.onInsertNewTagBlock) {
        callbacks.onInsertNewTagBlock({ $tags })
      } else {
        if (memberName === topicOwnerName) {
          // 如果为当前题主设置标签，也需要在主题头部区域同步展示标签。
          $topicHeader.append($tags.clone(true))
        }

        if (options.userTag.display === 'inline') {
          $tags
            .addClass('v2p-reply-tags-inline')
            .insertBefore(
              $commentCells
                .filter(`:has(> table strong > a[href="/member/${memberName}"])`)
                .find('> table .badges')
            )
        } else {
          $tags.insertBefore(
            $commentCells
              .filter(`:has(> table strong > a[href="/member/${memberName}"])`)
              .find('> table .reply_content')
          )
        }
      }
    }
  }
}

/**
 * 打开模态框，让用户编辑用户标签。
 */
export function openTagsSetter(
  params: {
    memberName: Member['username']
    memberAvatar?: Member['avatar']
  } & CallbackFunctions
) {
  const { memberName, memberAvatar, ...callbacks } = params

  void (async () => {
    const storage = await getStorage(false)
    const latestTagsData = storage[StorageKey.MemberTag]
    const options = storage[StorageKey.Options]
    const memberTagData = latestTagsData?.[memberName]

    const tagsValue = memberTagData
      ? Reflect.has(latestTagsData, memberName)
        ? memberTagData.tags
          ? getTagsText(memberTagData.tags)
          : undefined
        : undefined
      : undefined

    const newTagsValue = window.prompt(
      `对 @${memberName} 设置标签，多个标签以逗号（，）分隔。`,
      tagsValue
    )

    if (newTagsValue !== null) {
      const tags =
        newTagsValue.trim().length > 0
          ? newTagsValue
              .split(/,|，/g)
              .filter((it) => it.trim().length > 0)
              .map((it) => ({ name: it }))
          : undefined

      await setMemberTags({ memberName, memberAvatar: memberTagData?.avatar || memberAvatar, tags })

      updateMemberTag({ memberName, memberAvatar, tags, options, ...callbacks })
    }
  })()
}

/**
 * 处理主题中的图片, 点击图片会弹出图片放大预览。
 */
export function handleTopicImg() {
  const $imgs = $('.embedded_image')

  if ($imgs.length > 0) {
    const modal = createModal({
      root: $body,
      onMount: ({ $main, $header, $content }) => {
        $main.css({
          width: 'auto',
          height: 'auto',
          display: 'flex',
          'justify-content': 'center',
          'background-color': 'transparent',
          'pointer-events': 'none',
        })
        $header.remove()
        $content.css({
          display: 'flex',
          'justify-content': 'center',
          'align-items': 'center',
          'pointer-events': 'none',
        })
      },
      onOpen: ({ $content }) => {
        $content.empty()
      },
    })

    $imgs.each((_, img) => {
      const $img = $(img)

      if (img instanceof HTMLImageElement) {
        if (img.clientWidth !== img.naturalWidth) {
          $img.parent().removeAttr('href')

          $img.css({ cursor: 'zoom-in' })

          $img.on('click', () => {
            const $clonedImg = $img.clone()
            $clonedImg.css({ cursor: 'default', 'pointer-events': 'auto' })

            modal.open()
            modal.$content.append($clonedImg)
          })
        }
      }
    })
  }
}

/**
 * 将低清表情图片转换成高清表情图片。
 */
export function handleEmojiReplace() {
  const srcMap = new Map<string, string>()

  Object.values(emojiLinks).forEach(({ ld, hd }) => {
    srcMap.set(ld, hd)
  })

  const $embedImages = $commentCells.find(`.reply_content .embedded_image`)

  if ($embedImages.length > 0) {
    $embedImages.each((_, img) => {
      const $img = $(img)

      const src = $img.attr('src')

      if (typeof src === 'string') {
        const hd = srcMap.get(src)

        if (typeof hd === 'string') {
          $img.attr('src', hd)
          $img.css({
            width: '20px',
            height: '20px',
          })
        }
      }
    })
  }
}
