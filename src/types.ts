import { type StorageKey } from './constants'

export interface Options {
  avatar?: boolean
}

export interface LegacyAPI_Info {
  limit?: number
  reset?: number
  remaining?: number
}

export interface API_Info {
  pat?: string
  limit?: number
  reset?: number
  remaining?: number
}

export interface StorageData {
  [StorageKey.Options]?: Options
  [StorageKey.LegacyAPI]?: LegacyAPI_Info
  [StorageKey.API]?: API_Info
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
  created: number
  last_touched: number
  last_modified: number
  last_reply_by: string

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

export interface Member {
  id: number
  username: string
  url: string

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
  suucess: boolean
  message?: string
  result: T
}

export interface CommentData {
  id: string
  memberName: string
  memberLink: any
  content: string
  likes: number
  floor: string
  index: number
  refMemberNames: string[] | undefined
  refFloors: string[] | undefined
  thanked: boolean
}
