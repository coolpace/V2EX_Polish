import type { Options } from './pages/option.type'

export const enum StorageKey {
  Options = 'options',
  LegacyAPI = 'legacy-api',
  API = 'api',
}

export const enum V2EX {
  Origin = 'https://www.v2ex.com',
  LegacyAPI = 'https://www.v2ex.com/api',
  API = 'https://www.v2ex.com/api/v2',
}

export const enum Menu {
  Root = 'menu',
  Decode = 'menu/decode',
}

/** 表情数据 */
export const emoticons = [
  {
    title: '小黄脸',
    list: [
      '😀',
      '😁',
      '😂',
      '🤣',
      '😅',
      '😊',
      '😋',
      '😘',
      '🥰',
      '😗',
      '🤩',
      '🤔',
      '🤨',
      '😐',
      '😑',
      '🙄',
      '😏',
      '😪',
      '😫',
      '🥱',
      '😜',
      '😒',
      '😔',
      '😨',
      '😰',
      '😱',
      '🥵',
      '😡',
      '🥳',
      '🥺',
      '🤭',
      '🧐',
      '🤓',
      '😭',
      '🤑',
      '🤮',
    ],
  },
  {
    title: '手势',
    list: [
      '🙋',
      '🙎',
      '🙅',
      '🙇',
      '🤷',
      '🤏',
      '👉',
      '✌️',
      '🤘',
      '🤙',
      '👌',
      '🤌',
      '👍',
      '👎',
      '👋',
      '🤝',
      '🙏',
      '👏',
    ],
  },
  {
    title: '庆祝',
    list: ['✨', '🎉', '🎊'],
  },
  {
    title: '其他',
    list: ['👻', '🤡', '👀', '💩', '🐴', '🦄', '🐔', '🐒', '🐧', '🙈', '🙉', '🙊', '🐵'],
  },
] as const satisfies readonly { title: string; list: readonly string[] }[]

/** 关于扩展的超链接 */
export const enum Links {
  /** 官网主页 */
  Home = 'https://v2p.app',
  /** 问题反馈页 */
  Feedback = 'https://github.com/coolpace/V2EX_Polish/discussions/1',
}

export const READABLE_CONTENT_HEIGHT = 250
export const MAX_CONTENT_HEIGHT = 550

/** Popup 中缓存的主题列表数据的过期时间 */
export const dataExpiryTime = 60 * 60 * 1000

/** 请求 V2EX API 返回的特定信息 */
export const enum RequestMessage {
  InvalidToken = 'Invalid token',
  TokenExpired = 'Token expired',
}

// 注册应用获取 Client ID：https://api.imgur.com/oauth2/addclient
// 查看已注册的应用：https://imgur.com/account/settings/apps
export const imgurClientIdPool = [
  '3107b9ef8b316f3',

  // 以下 Client ID 来自「V2EX Plus」
  '442b04f26eefc8a',
  '59cfebe717c09e4',
  '60605aad4a62882',
  '6c65ab1d3f5452a',
  '83e123737849aa9',
  '9311f6be1c10160',
  'c4a4a563f698595',
  '81be04b9e4a08ce',
] as const satisfies readonly string[]

export const defaultOptions: Options = {
  openInNewTab: false,
}
