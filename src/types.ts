import { type StorageKey } from './constants'

export interface Options {
  avatar?: boolean
}

export interface LegacyAPI {
  limit?: number
  reset?: number
  remaining?: number
}

export interface API {
  pat?: string
  limit?: number
  reset?: number
  remaining?: number
}

export interface StorageData {
  [StorageKey.Options]?: Options
  [StorageKey.LegacyAPI]?: LegacyAPI
  [StorageKey.API]?: API
}

export interface Topic {
  id: number
  title: string
  url: string
  content: string
  content_rendered: string
  /** 回复数量 */
  replies: number
  created: number
  last_touched: number
  last_modified: number
  last_reply_by: string

  /** 主题创建者信息 */
  member: {
    id: number
    username: string
    avatar: string
    created: number
    bio?: string
    github?: string
    website?: string
  }

  /** 节点信息 */
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
  }
}

export interface Member {
  id: number
  username: string
  bio?: string
  url: string

  avatar_mini: string
  avatar_normal: string
  avatar_large: string
  avatar_xlarge: string
  avatar_xxlarge: string

  location?: string
  tagline?: string
  github?: string
  website?: string
  twitter?: string
  created: number
  last_modified: number
}

export interface DataWrapper<T = unknown> {
  suucess: boolean
  message?: string
  result: T
}
