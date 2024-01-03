import { createButton } from '../../components/button'
import { MAX_CONTENT_HEIGHT, READABLE_CONTENT_HEIGHT, StorageKey } from '../../constants'
import type { Member, Options, Tag } from '../../types'
import { getStorage, getStorageSync } from '../../utils'
import { $commentCells, $topicContentBox, $topicHeader, topicOwnerName } from '../globals'
import { loadIcons, setMemberTags } from '../helpers'

/**
 * 处理主题的正文内容。
 */
export function handlingContent() {
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
    const topicBtn = $('.topic_buttons .tb').addClass('v2p-tb v2p-hover-btn')
    const $favoriteBtn = topicBtn.eq(0)
    $favoriteBtn.append('<span class="v2p-tb-icon"><i data-lucide="star"></i></span>')
    topicBtn.eq(1).append('<span class="v2p-tb-icon"><i data-lucide="twitter"></i></span>')
    topicBtn.eq(2).append('<span class="v2p-tb-icon"><i data-lucide="eye-off"></i></span>')
    topicBtn.eq(3).append('<span class="v2p-tb-icon"><i data-lucide="heart"></i></span>')
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
 */
export function processReplyContent(
  $cellDom: JQuery,
  replyContentOptions: Options['replyContent']
) {
  if (!replyContentOptions.autoFold || $cellDom.find('.v2p-reply-content').length > 0) {
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
 * 根据用户的昵称设置用户的标签。
 */
export function updateMemberTag(
  memberName: Member['username'],
  tags: Tag[] | undefined,
  options: Options
) {
  const $v2pTags = $(`.v2p-tags-${memberName}`)

  const tagsValue = tags?.map((it) => it.name).join('，')

  if ($v2pTags.length > 0) {
    if (tagsValue) {
      $v2pTags.html(`<b>#</b>&nbsp;${tagsValue}`)
    } else {
      $v2pTags.remove()
    }
  } else {
    if (tagsValue) {
      const $tags = $(
        `<div class="v2p-reply-tags v2p-tags-${memberName}" title="${tagsValue}"><b>#</b>&nbsp;${tagsValue}</div>`
      )

      $tags.on('click', () => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        openTagsSetter(memberName)
      })

      if (memberName === topicOwnerName) {
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

/**
 * 打开模态框，让用户编辑用户标签。
 */
export function openTagsSetter(memberName: Member['username']) {
  void (async () => {
    const storage = await getStorage(false)
    const latestTagsData = storage[StorageKey.MemberTag]
    const options = storage[StorageKey.Options]

    const tagsValue = latestTagsData
      ? Reflect.has(latestTagsData, memberName)
        ? latestTagsData[memberName].tags?.map((it) => it.name).join('，')
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

      await setMemberTags(memberName, tags)

      updateMemberTag(memberName, tags, options)
    }
  })()
}
