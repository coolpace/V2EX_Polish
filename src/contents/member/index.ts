import { createButton } from '../../components/button'
import { StorageKey } from '../../constants'
import { getStorage } from '../../utils'
import { loginName } from '../globals'
import { getTagsText } from '../helpers'
import { type CallbackFunctions, openTagsSetter } from '../topic/content'

void (async () => {
  const storage = await getStorage()

  const $memberName = $('h1')
  const memberName = $memberName.text()

  if (memberName !== loginName) {
    const memberAvatar = $('.avatar').prop('src')

    const tagData = storage[StorageKey.MemberTag]

    const $tagBlock = $('<div class="v2p-tag-block">')

    let $addTagBtn: JQuery | undefined

    const callbacks: CallbackFunctions = {
      onRemoveExistingTagBlock: () => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        insertAddBtn()
      },

      onInsertNewTagBlock: ({ $tags }) => {
        $tagBlock.append($tags)
        $addTagBtn?.remove()
      },
    }

    const insertAddBtn = () => {
      $addTagBtn = createButton({ children: '添加用户标签' })
        .on('click', () => {
          openTagsSetter({ memberName, memberAvatar, ...callbacks })
        })
        .appendTo($tagBlock)
    }

    if (tagData && Reflect.has(tagData, memberName)) {
      const tags = tagData[memberName].tags
      const tagsText = tags ? getTagsText(tags) : undefined

      if (tagsText) {
        const $tags = $(
          `<div class="v2p-reply-tags v2p-tags-${memberName}" style="margin-right: 5px;" title="${tagsText}"><b>#</b>&nbsp;${tagsText}</div>`
        )
        $tags.on('click', () => {
          openTagsSetter({ memberName, memberAvatar, ...callbacks })
        })
        $tagBlock.append($tags)
      } else {
        insertAddBtn()
      }
    } else {
      insertAddBtn()
    }

    $tagBlock.insertAfter($memberName)
  }
})()
