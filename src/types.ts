import type { MessageFrom, StorageKey } from './constants'

declare global {
  interface Window {
    GM_addStyle?: (style: string) => void
    __V2P_AddingReading?: boolean
    __V2P_DecodeStatus?: 'decodeed'
    __V2P_StorageCache?: StorageSettings
    __V2P_Tasks?: Map<TaskId, (result: unknown) => void>
  }
}

export interface SettingsSyncInfo {
  /** 当前使用的备份版本。 */
  version: number
  /** 上次同步的时间。 */
  lastSyncTime: number
  /** 上次检查更新的时间 */
  lastCheckTime?: number
}

export type ThemeType = 'light-default' | 'dark-default' | 'dawn'

/** V2EX Polish 选项设置。 */
export interface Options {
  /** 是否在新标签页打开主题。 */
  openInNewTab: boolean
  /** 自动签到设置。 */
  autoCheckIn: {
    /** 是否启用自动签到。 */
    enabled: boolean
  }
  /** 颜色主题设置。 */
  theme: {
    /** 主题。 */
    type?: ThemeType
    /** 是否自动跟随系统切换主题。 */
    autoSwitch: boolean
    /** 主题间距模式。 */
    mode?: 'default' | 'compact'
  }
  /** 主题回复设置。 */
  reply: {
    /** 是否预加载回复内容。 */
    preload?: 'off' | 'auto'
    /** 是否使用水平布局。 */
    layout?: 'auto' | 'horizontal'
  }
  /** 回复内容设置。 */
  replyContent: {
    /** 是否自动折叠回复内容。 */
    autoFold?: boolean
    /** 是否隐藏回复时间。 */
    hideReplyTime?: boolean
    /** 是否隐藏 @ 提及用户名。 */
    hideRefName?: boolean
    /** 在主题中点击图片时，是否在页内预览图片大图。 */
    showImgInPage?: boolean
  }
  /** 嵌套回复设置。 */
  nestedReply: {
    /** 嵌套回复展示形式。 */
    display: 'align' | 'indent' | 'off'
    /** 当一条回复中指定了多个用户时，是否参与嵌套。 */
    multipleInsideOne?: 'nested' | 'off'
  }
  /** 用户标签设置。 */
  userTag: {
    /** 用户标签展示形式。 */
    display: 'inline' | 'block'
  }
  /** 隐藏账号信息。 */
  hideAccount?: boolean
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

export type MemberTag = Record<Member['username'], { tags?: Tag[]; avatar?: Member['avatar'] }>

export interface ReadingItem extends Pick<Topic, 'url' | 'title' | 'content'> {
  addedTime: number
  read?: boolean
}

export interface StorageItems {
  [StorageKey.SyncInfo]?: SettingsSyncInfo
  [StorageKey.Options]?: Options
  [StorageKey.API]?: API_Info
  [StorageKey.Daily]?: DailyInfo
  [StorageKey.MemberTag]?: MemberTag
  [StorageKey.ReadingList]?: {
    data?: ReadingItem[]
  }
}

export interface StorageSettings extends StorageItems {
  [StorageKey.Options]: Options
}

export interface Member {
  id: number
  /** 展示昵称。 */
  username: string
  /** 用户主页链接。 */
  url: string

  avatar: string
  avatar_mini: string
  avatar_normal: string
  avatar_large: string
  avatar_xlarge: string
  avatar_xxlarge: string

  /** 用户简介。 */
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

export type HotTopic = Pick<Topic, 'id' | 'title' | 'url' | 'member'>

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

export interface V2EX_Response {
  success: boolean
  message?: string
}

export interface CommentData {
  /** HTML 元素上的 id */
  id: string
  /** 回复者昵称 */
  memberName: string
  /** 回复者主页链接 */
  memberLink: string
  /** 回复者头像 */
  memberAvatar: string
  /** 回复内容 */
  content: string
  /** 经过处理的回复内容 HTML 文本 */
  contentHtml?: string
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

/** CSRF 字符串，通常在请求 V2EX API 时需要传递它。 */
export type Once = string

type TaskId = string | number

export type MessageData =
  | {
      from: MessageFrom.Content
      payload?: {
        task?: {
          id: TaskId
          expression: string
        }
      }
    }
  | {
      from: MessageFrom.Web
      payload?: {
        status?: 'ready'
        task?: {
          id: TaskId
          result: unknown
        }
      }
    }
