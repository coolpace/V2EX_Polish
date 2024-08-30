import type { CommentData, Options } from '../types'
import { processReplyContent } from './topic/content'

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
        const canHideRefName =
          options.nestedReply.display === 'indent' && !!options.replyContent.hideRefName

        // 如果设置了「隐藏 @ 用户名 」，则把 @ 用户名 提取出来，并使用 span 包裹。
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
}

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
    $commentCells.each((i, cellDom) => {
      const $cellDom = $(cellDom)

      const dataFromIndex = commentDataList.at(i)

      if (options.replyContent.autoFold) {
        processReplyContent($cellDom)
      }

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

        const moreThanOneRefMember = refMemberNames.length > 1

        if (options.nestedReply.multipleInsideOne === 'off' && refMemberNames.length > 1) {
          return
        }

        for (const refName of moreThanOneRefMember ? refMemberNames.toReversed() : refMemberNames) {
          // 从当前评论往前找，找到第一个引用的用户的评论，然后把当前评论插入到那个评论的后面。
          for (let j = i - 1; j >= 0; j--) {
            const { memberName: compareName, floor: eachFloor } = commentDataList.at(j) || {}

            if (compareName === refName) {
              let refCommentIdx = j

              const firstRefFloor = moreThanOneRefMember
                ? refFloors?.toReversed().at(0)
                : refFloors?.at(0)

              // 找到了指定回复的用户后，发现跟指定楼层对不上，则继续寻找。
              // 如果手动指定了楼层，那么就以指定的楼层为准（一般来说，由用户指定会更精确），否则就以第一个引用的用户的评论的楼层为准。
              if (firstRefFloor && firstRefFloor !== eachFloor) {
                const targetIdx = commentDataList
                  .slice(0, j)
                  .findIndex((data) => data.floor === firstRefFloor && data.memberName === refName)

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
