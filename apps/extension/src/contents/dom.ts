import type { CommentData, Options } from '../types'

export function getCommentDataList({
  options,
  $commentTableRows,
  $commentCells,
}: {
  options: Options
  $commentTableRows: JQuery
  $commentCells: JQuery
}) {
  return $commentTableRows
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
      const refMemberNames
        = memberNameMatches.length > 0
          ? memberNameMatches.map(([, name]) => {
              return name
            })
          : undefined

      const floorNumberMatches = Array.from(content.matchAll(/#(\d+)/g))
      const refFloors
        = floorNumberMatches.length > 0
          ? floorNumberMatches.map(([, floor]) => {
              return floor
            })
          : undefined

      let contentHtml: CommentData['contentHtml'] = undefined

      if (refMemberNames) {
        const canHideRefName
          = options.nestedReply.display === 'indent' && !!options.replyContent.hideRefName

        // 如果设置了「隐藏 @ 用户名 」，则把 @ 用户名 提取出来，并使用 span 包裹。
        if (canHideRefName) {
          if (refMemberNames.length === 1) {
            contentHtml = $content.html()
            const pattern = /(@<a href="\/member\/\w+">[\w\s]+<\/a>)\s+/g
            const replacement = '<span class="v2p-member-ref">$1</span> '

            // 将提及的用户使用 v2p-member-ref 包裹。
            contentHtml = contentHtml.replace(pattern, replacement)

            $content.html(contentHtml)
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
}

/**
 * 处理嵌套回复。
 */
export function handleNestedComment({
  options,
  $commentCells,
  commentDataList,
}: {
  options: Options
  $commentCells: JQuery
  commentDataList: readonly CommentData[]
}) {
  const display = options.nestedReply.display

  if (display !== 'off') {
    const cellList = $commentCells.get()

    const commentById = new Map<string, CommentData>()
    const floorMemberToIndex = new Map<string, number>()
    const lastSeenByMember = new Map<string, number>()

    for (let i = 0; i < commentDataList.length; i++) {
      const data = commentDataList[i]
      commentById.set(data.id, data)

      if (data.memberName && data.floor) {
        floorMemberToIndex.set(`${data.memberName}:${data.floor}`, i)
      }
    }

    // 在批量 DOM 移动前隐藏容器，避免每次 append 都触发 reflow。
    // 使用 visibility 而非 display:none，保持布局空间不变，避免页面跳动。
    const commentContainer = cellList[0]?.parentElement

    if (commentContainer) {
      commentContainer.style.visibility = 'hidden'
    }

    for (let i = 0; i < cellList.length; i++) {
      const cellDom = cellList[i]

      if (!cellDom || !(cellDom instanceof HTMLElement)) {
        continue
      }

      const currentComment = commentById.get(cellDom.id)

      if (currentComment) {
        const refMemberNames = currentComment.refMemberNames
        const refFloors = currentComment.refFloors

        let canNest = true

        if (!refMemberNames || refMemberNames.length === 0) {
          canNest = false
        }

        const moreThanOneRefMember = !!refMemberNames && refMemberNames.length > 1

        if (canNest) {
          if (options.nestedReply.multipleInsideOne === 'off' && moreThanOneRefMember) {
            canNest = false
          }
        }

        if (canNest && refMemberNames) {
          const refNamesInOrder = moreThanOneRefMember
            ? refMemberNames.toReversed()
            : refMemberNames

          const floorsInOrder = moreThanOneRefMember
            ? refFloors?.toReversed()
            : refFloors

          const desiredFloor = floorsInOrder?.at(0)

          let refCommentIdx = -1

          for (const refName of refNamesInOrder) {
            refCommentIdx = -1

            if (desiredFloor) {
              const idxByFloor = floorMemberToIndex.get(`${refName}:${desiredFloor}`)

              if (typeof idxByFloor === 'number' && idxByFloor < i) {
                refCommentIdx = idxByFloor
              }
            }

            if (refCommentIdx < 0) {
              const idxByLastSeen = lastSeenByMember.get(refName)

              if (typeof idxByLastSeen === 'number') {
                refCommentIdx = idxByLastSeen
              }
            }

            if (refCommentIdx >= 0) {
              if (display === 'indent') {
                cellDom.classList.add('v2p-indent')
              }

              const refCell = cellList[refCommentIdx]
              refCell.append(cellDom)
              break
            }
          }
        }

        lastSeenByMember.set(currentComment.memberName, i)
      }
    }

    // 批量 DOM 移动完成，恢复容器可见性。
    if (commentContainer) {
      commentContainer.style.visibility = ''
    }
  }
}
