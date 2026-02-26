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

export type ThemeType = 'light-default' | 'dark-default' | 'dawn' | 'minimalist'

export type FontType = 'system' | 'vivoSans' | 'notoSans' | 'lxgwWenKai'

/** V2EX Polish 选项设置。 */
export interface Options {
  /** 链接打开方式：是否在新标签页中打开主题链接 */
  openInNewTab: boolean

  /** 自动签到功能配置 */
  autoCheckIn: {
    /** 是否开启自动签到功能 */
    enabled: boolean
  }

  /** 界面主题相关配置 */
  theme: {
    /** 主题类型：可选择明亮、暗黑或黎明主题 */
    type?: ThemeType
    /** 是否启用自动跟随系统主题切换 */
    autoSwitch: boolean
    /** 界面布局紧凑度：默认或紧凑模式 */
    mode?: 'default' | 'compact'
  }

  /** 回复功能配置 */
  reply: {
    /** 回复内容预加载策略：关闭或自动加载 */
    preload?: 'off' | 'auto'
    /** 回复布局方式：自动、水平或垂直布局 */
    layout?: 'auto' | 'horizontal' | 'vertical'
  }

  /** 回复内容显示配置 */
  replyContent: {
    /** 是否自动折叠过长回复 */
    autoFold?: boolean
    /** 是否隐藏回复时间戳 */
    hideReplyTime?: boolean
    /** 是否隐藏回复中的 @ 用户名 */
    hideRefName?: boolean
    /** 是否启用图片页内预览功能 */
    showImgInPage?: boolean
  }

  /** 嵌套回复显示配置 */
  nestedReply: {
    /** 嵌套回复的显示方式：对齐、缩进或关闭 */
    display: 'align' | 'indent' | 'off'
    /** 多重 @ 用户时的嵌套处理：保持嵌套或关闭 */
    multipleInsideOne?: 'nested' | 'off'
  }

  /** 用户标签配置 */
  userTag: {
    /** 用户标签的显示方式：行内或块级显示 */
    display: 'inline' | 'block'
  }

  /** 上下文菜单配置 */
  contextMenu?: {
    /** 是否启用右键上下文菜单 */
    enabled: boolean
  }

  /** 是否隐藏用户账号信息 */
  hideAccount?: boolean

  /** 界面字体配置 */
  font?: {
    /** 字体类型：系统默认或在线字体 */
    type: FontType
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

/**
 * 用户标签类型。
 *
 * 旧格式为 `{ name: string }`，现已简化为纯字符串以节省存储空间。
 */
export type Tag = string

/**
 * 旧版 Tag 格式，用于数据迁移时的类型兼容。
 */
export interface LegacyTag {
  name: string
}

export type MemberTag = Record<Member['username'], { tags?: Tag[], avatar?: Member['avatar'] }>

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

/** 用户发帖记录项 */
export interface UserTopicItem {
  /** 帖子标题 */
  title: string
  /** 帖子链接 */
  url: string
  /** 所属节点 */
  node?: {
    name: string
    url: string
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

export type MessageData
  = | {
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
