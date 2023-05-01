import type { MessageFrom, StorageKey } from './constants'

declare global {
  interface Window {
    GM_addStyle?: (style: string) => void
    __V2P_DecodeStatus__?: 'decodeed'
    __V2P_StorageCache?: StorageSettings
  }
}

export interface SettingsSyncInfo {
  version: number
  lastSyncTime: number
}

export interface Options {
  openInNewTab: boolean
  autoCheckIn: {
    enabled: boolean
  }
  theme: {
    autoSwitch: boolean
  }
  replyContent: {
    autoFold?: boolean
  }
  nestedReply: {
    display: 'align' | 'indent'
  }
}

export interface API_Info {
  pat?: string
  limit?: number
  reset?: number
  remaining?: number
}

export interface DailyInfo {
  lastCheckInTime?: number
  checkInDays?: number
}

export interface Tag {
  name: string
}

export type MemberTag = Record<Member['username'], { tags?: Tag[] }>

export interface StorageItems {
  [StorageKey.SyncInfo]?: SettingsSyncInfo
  [StorageKey.Options]?: Options
  [StorageKey.API]?: API_Info
  [StorageKey.Daily]?: DailyInfo
  [StorageKey.MemberTag]?: MemberTag
}

export interface StorageSettings extends StorageItems {
  [StorageKey.Options]: Options
}

export interface Member {
  id: number
  /** 展示昵称 */
  username: string
  url: string

  avatar: string
  avatar_mini: string
  avatar_normal: string
  avatar_large: string
  avatar_xlarge: string
  avatar_xxlarge: string

  bio?: string
  github?: string
  website?: string
  twitter?: string
  btc?: string
  psn?: string
  location?: string
  tagline?: string

  created: number
  last_modified: number
}

export interface Topic {
  id: number
  title: string
  url: string
  /** 主题内容：纯文本 */
  content: string
  /** 主题内容：已经渲染好的 html 字符串 */
  content_rendered: string
  /** 回复数量 */
  replies: number
  /** 内容解析语法：0-普通文本，1-Markdown */
  syntax: 0 | 1
  created: number
  last_touched: number
  last_modified: number
  last_reply_by: string
  /** 附言 */
  supplements?: Pick<Topic, 'id' | 'content' | 'content_rendered' | 'created' | 'syntax'>[]

  /** 主题创建者信息 */
  member: Member

  /** 该主题所属的节点信息 */
  node: {
    id: number
    title: string
    name: string
    created: number
    url: string
    topics: number
    avatar: string
    header: string
    footer: string
    last_modified: number

    // v1:
    root?: boolean
    parent_node_name?: string
    aliases?: string[]
    title_alternative?: string
    stars?: number
    avatar_mini?: string
    avatar_normal?: string
    avatar_large?: string
  }
}

export interface TopicReply {
  id: number
  created: number
  content: string
  content_rendered: string
  member: { avatar: string } & Pick<Member, 'id' | 'url' | 'username'>
}

export interface Notification {
  id: number
  created: number
  member: Pick<Member, 'username'>

  /** 发送消息的人 */
  member_id: number
  /** 接收消息的人 */
  for_member_id: number

  /** 留言评论内容 */
  payload: string | null
  payload_rendered: Notification['payload']

  /** 已渲染的消息展示 html 字符串 */
  text: string
}

export interface DataWrapper<T = unknown> {
  success: boolean
  message?: string
  result: T
}

export interface V2EX_RequestErrorResponce {
  cause: Pick<DataWrapper, 'success'> & {
    message: string
  }
}

export interface CommentData {
  /** HTML 元素上的 id */
  id: string
  /** 回复者昵称 */
  memberName: string
  /** 回复者主页链接 */
  memberLink: any
  /** 回复者头像 */
  memberAvatar: string
  /** 回复内容 */
  content: string
  /** 该回复被感谢的次数 */
  likes: number
  /** 楼层数 */
  floor: string
  /** 遍历索引值 */
  index: number
  /** 回复中 @ 别人 */
  refMemberNames: string[] | undefined
  /** 回复中 # 楼层 */
  refFloors: string[] | undefined
  /** 是否已经感谢过 */
  thanked: boolean
}

export interface ImgurResponse {
  status: number
  success: boolean
  data: {
    /** 上传成功后生成的图片资源 hash */
    id: string
    /** 上传成功后生成的在线链接 */
    link: string
  }
}

export interface MessagePayload {
  from: MessageFrom
  data: string
}
