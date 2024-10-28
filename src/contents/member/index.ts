import { createButton } from '../../components/button'
import { StorageKey } from '../../constants'
import { fetchUserInfo } from '../../services'
import { getStorage } from '../../utils'
import { loginName } from '../globals'
import { getRegisterDays, getTagsText } from '../helpers'
import { type CallbackFunctions, openTagsSetter } from '../topic/content'
import { handleTopicList } from './topic-list'

void (async () => {
  const storage = await getStorage()

  const $memberName = $('#Main h1').addClass('v2p-member-name')
  const memberName = $memberName.text()
  const isOwner = memberName === loginName

  if (!isOwner) {
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

  handleTopicList({ isOwner })

  // MARK: 获取用户注册时间信息
  fetchUserInfo(memberName).then((memberData) => {
    const registerDays = getRegisterDays(memberData.created)

    if (registerDays <= 30) {
      $memberName.append(
        `<span class="v2p-register-days v2p-register-days-large">${registerDays <= 15 ? '15' : '30'} 天内注册</span>`
      )
    }
  })
})()
