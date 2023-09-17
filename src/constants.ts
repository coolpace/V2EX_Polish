import type { Options } from './types'

export const EXTENSION_NAME = 'V2EX_Polish'

export const enum StorageKey {
  SyncInfo = 'settings-sync',
  Options = 'options',
  API = 'api',
  Daily = 'daily',
  MemberTag = 'member-tag',
  ReadingList = 'reading-list',
}

export const enum V2EX {
  Origin = 'https://www.v2ex.com',
  API = 'https://www.v2ex.com/api/v2',
}

export const enum Menu {
  Root = 'menu',
  Decode = 'menu/decode',
  Reading = 'menu/reading',
  Options = 'menu/options',
}

export const enum BiliEmoji {
  脱单doge = '[脱单doge]',
  辣眼睛 = '[辣眼睛]',
  跪了 = '[跪了]',
  疑惑 = '[疑惑]',
  捂脸 = '[捂脸]',
  哦呼 = '[哦呼]',
  响指 = '[响指]',
  傲娇 = '[傲娇]',
  思考 = '[思考]',
  吃瓜 = '[吃瓜]',
  无语 = '[无语]',
  doge = '[doge]',
  大哭 = '[大哭]',
  酸了 = '[酸了]',
  打call = '[打call]',
  歪嘴 = '[歪嘴]',
  星星眼 = '[星星眼]',
  OK = '[OK]',
}

export const biliEmojiLink = {
  [BiliEmoji.脱单doge]: 'https://i.imgur.com/L62ZP7V.png',
  [BiliEmoji.doge]: 'https://i.imgur.com/agAJ0Rd.png',
  [BiliEmoji.辣眼睛]: 'https://i.imgur.com/n119Wvk.png',
  [BiliEmoji.疑惑]: 'https://i.imgur.com/U3hKhrT.png',
  [BiliEmoji.捂脸]: 'https://i.imgur.com/14cwgsI.png',
  [BiliEmoji.哦呼]: 'https://i.imgur.com/km62MY2.png',
  [BiliEmoji.傲娇]: 'https://i.imgur.com/TkdeN49.png',
  [BiliEmoji.思考]: 'https://i.imgur.com/MAyk5GN.png',
  [BiliEmoji.吃瓜]: 'https://i.imgur.com/Ug1iMq4.png',
  [BiliEmoji.无语]: 'https://i.imgur.com/e1q9ScT.png',
  [BiliEmoji.大哭]: 'https://i.imgur.com/YGIx7lh.png',
  [BiliEmoji.酸了]: 'https://i.imgur.com/5FDsp6L.png',
  [BiliEmoji.打call]: 'https://i.imgur.com/pmNOo2w.png',
  [BiliEmoji.歪嘴]: 'https://i.imgur.com/XzEYBoY.png',
  [BiliEmoji.星星眼]: 'https://i.imgur.com/2spsghH.png',
  [BiliEmoji.OK]: 'https://i.imgur.com/6DMydmQ.png',
  [BiliEmoji.跪了]: 'https://i.imgur.com/TYtySHv.png',
  [BiliEmoji.响指]: 'https://i.imgur.com/Ac88cMm.png',
} as const satisfies Record<BiliEmoji, string>

/** 表情数据 */
export const emoticons = [
  {
    title: 'Bilibili',
    list: [
      BiliEmoji.脱单doge,
      BiliEmoji.doge,
      BiliEmoji.打call,
      BiliEmoji.星星眼,
      BiliEmoji.吃瓜,
      BiliEmoji.OK,
      BiliEmoji.哦呼,
      BiliEmoji.思考,
      BiliEmoji.疑惑,
      BiliEmoji.辣眼睛,
      BiliEmoji.傲娇,
      BiliEmoji.捂脸,
      BiliEmoji.无语,
      BiliEmoji.大哭,
      BiliEmoji.酸了,
      BiliEmoji.歪嘴,
      BiliEmoji.跪了,
      BiliEmoji.响指,
    ],
  },
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
      '😎',
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
    list: ['👻', '🤡', '🐔', '👀', '💩', '🐴', '🦄', '🐧', '🐶', '🐒', '🙈', '🙉', '🙊', '🐵'],
  },
] as const satisfies readonly { title: string; list: readonly string[] }[]

/** 关于扩展的超链接 */
export const enum Links {
  /** 官网主页 */
  Home = 'https://v2p.app',
  /** 问题反馈页 */
  Feedback = 'https://github.com/coolpace/V2EX_Polish/discussions/1?sort=new',
}

export const READABLE_CONTENT_HEIGHT = 250
export const MAX_CONTENT_HEIGHT = 550

export const READING_CONTENT_LIMIT = 150

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

/** 扩展初始化提供的默认选项 */
export const defaultOptions: Options = {
  openInNewTab: false,
  autoCheckIn: {
    enabled: true,
  },
  theme: {
    autoSwitch: false,
  },
  reply: {
    preload: 'off',
  },
  replyContent: {
    autoFold: true,
    hideRefName: false,
  },
  nestedReply: {
    display: 'indent',
    multipleInsideOne: 'nested',
  },
  userTag: {
    display: 'inline',
  },
}

export const enum MessageKey {
  action = 'action',
  colorScheme = 'colorSchemes',
}

export const enum MessageFrom {
  Content,
  Web,
}
