import { StorageKey } from '../../constants'
import type { Member, MemberTag, Tag } from '../../types'
import { getStorage, isBrowserExtension, setStorage } from '../../utils'

export async function setMemberTags(params: {
  memberName: Member['username']
  memberAvatar?: Member['avatar']
  tags: Tag[] | undefined
}) {
  const { memberName, memberAvatar, tags } = params

  const storage = await getStorage(false)
  const tagData = storage[StorageKey.MemberTag]

  if (!isBrowserExtension()) {
    // 非浏览器扩展不能设置用户标签。
    return
  }

  if (tags && tags.length > 0) {
    const newTagData: MemberTag = {
      ...tagData,
      [memberName]: { tags, avatar: memberAvatar || tagData?.[memberName]?.avatar },
    }
    await setStorage(StorageKey.MemberTag, newTagData)
  }
  else {
    if (tagData && Reflect.has(tagData, memberName)) {
      delete tagData[memberName]
      await setStorage(StorageKey.MemberTag, tagData)
    }
  }
}

/**
 * 将用户标签数据转换为字符串。
 */
export function getTagsText(tags: Tag[]): string {
  return tags.join('，')
}

/**
 * 计算用户注册时间。
 *
 * @param created - 用户注册时间, 单位为秒。
 */
export function getRegisterDays(created: number): number {
  const registerDays = Math.ceil((Date.now() / 1000 - created) / (60 * 60 * 24))

  return registerDays
}
