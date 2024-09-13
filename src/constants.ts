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

export const enum PopularEmoji {
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
  哭惹 = '[哭惹R]',
  哇 = '[哇R]',
  汗颜 = '[汗颜R]',
  害羞 = '[害羞R]',
  萌萌哒 = '[萌萌哒R]',
  偷笑 = '[偷笑R]',
}

export const emojiLinks = {
  [PopularEmoji.脱单doge]: {
    ld: 'https://i.imgur.com/L62ZP7V.png',
    hd: 'https://i.imgur.com/3mPhudo.png',
  },
  [PopularEmoji.doge]: {
    ld: 'https://i.imgur.com/agAJ0Rd.png',
    hd: 'https://i.imgur.com/HZL0hOa.png',
  },
  [PopularEmoji.辣眼睛]: {
    ld: 'https://i.imgur.com/n119Wvk.png',
    hd: 'https://i.imgur.com/A5WXoZJ.png',
  },
  [PopularEmoji.疑惑]: {
    ld: 'https://i.imgur.com/U3hKhrT.png',
    hd: 'https://i.imgur.com/3gCygBS.png',
  },
  [PopularEmoji.捂脸]: {
    ld: 'https://i.imgur.com/14cwgsI.png',
    hd: 'https://i.imgur.com/fLp3t8s.png',
  },
  [PopularEmoji.哦呼]: {
    ld: 'https://i.imgur.com/km62MY2.png',
    hd: 'https://i.imgur.com/CXXgF4E.png',
  },
  [PopularEmoji.傲娇]: {
    ld: 'https://i.imgur.com/TkdeN49.png',
    hd: 'https://i.imgur.com/m7IlCrD.png',
  },
  [PopularEmoji.思考]: {
    ld: 'https://i.imgur.com/MAyk5GN.png',
    hd: 'https://i.imgur.com/eRJTCx7.png',
  },
  [PopularEmoji.吃瓜]: {
    ld: 'https://i.imgur.com/Ug1iMq4.png',
    hd: 'https://i.imgur.com/Gy3nwkC.png',
  },
  [PopularEmoji.无语]: {
    ld: 'https://i.imgur.com/e1q9ScT.png',
    hd: 'https://i.imgur.com/wMfcBqD.png',
  },
  [PopularEmoji.大哭]: {
    ld: 'https://i.imgur.com/YGIx7lh.png',
    hd: 'https://i.imgur.com/SNHJxtv.png',
  },
  [PopularEmoji.酸了]: {
    ld: 'https://i.imgur.com/5FDsp6L.png',
    hd: 'https://i.imgur.com/wnQBodT.png',
  },
  [PopularEmoji.打call]: {
    ld: 'https://i.imgur.com/pmNOo2w.png',
    hd: 'https://i.imgur.com/4GfTlV0.png',
  },
  [PopularEmoji.歪嘴]: {
    ld: 'https://i.imgur.com/XzEYBoY.png',
    hd: 'https://i.imgur.com/84ycU43.png',
  },
  [PopularEmoji.星星眼]: {
    ld: 'https://i.imgur.com/2spsghH.png',
    hd: 'https://i.imgur.com/oEIJRru.png',
  },
  [PopularEmoji.OK]: {
    ld: 'https://i.imgur.com/6DMydmQ.png',
    hd: 'https://i.imgur.com/PE2dyjY.png',
  },
  [PopularEmoji.跪了]: {
    ld: 'https://i.imgur.com/TYtySHv.png',
    hd: 'https://i.imgur.com/0pjsMf0.png',
  },
  [PopularEmoji.响指]: {
    ld: 'https://i.imgur.com/Ac88cMm.png',
    hd: 'https://i.imgur.com/nkoevMu.png',
  },
  [PopularEmoji.哭惹]: {
    ld: 'https://i.imgur.com/HgxsUD2.png',
    hd: 'https://i.imgur.com/0aOdQJd.png',
  },
  [PopularEmoji.哇]: {
    ld: 'https://i.imgur.com/OZySWIG.png',
    hd: 'https://i.imgur.com/ngoi2I6.png',
  },
  [PopularEmoji.汗颜]: {
    ld: 'https://i.imgur.com/jrVZoLi.png',
    hd: 'https://i.imgur.com/O8alqc1.png',
  },
  [PopularEmoji.害羞]: {
    ld: 'https://i.imgur.com/OVQjxIr.png',
    hd: 'https://i.imgur.com/1PeoVR5.png',
  },
  [PopularEmoji.萌萌哒]: {
    ld: 'https://i.imgur.com/Ue1kikn.png',
    hd: 'https://i.imgur.com/vOHzwus.png',
  },
  [PopularEmoji.偷笑]: {
    ld: 'https://i.imgur.com/aF7QiE5.png',
    hd: 'https://i.imgur.com/WneGpK9.png',
  },
} as const satisfies Record<
  PopularEmoji,
  {
    /** 低清图。 */
    ld: string
    /** 高清图。 */
    hd: string
  }
>

/** 表情数据 */
export const emoticons = [
  {
    title: '流行',
    list: [
      PopularEmoji.脱单doge,
      PopularEmoji.doge,
      PopularEmoji.打call,
      PopularEmoji.星星眼,
      PopularEmoji.吃瓜,
      PopularEmoji.OK,
      PopularEmoji.哦呼,
      PopularEmoji.思考,
      PopularEmoji.疑惑,
      PopularEmoji.辣眼睛,
      PopularEmoji.傲娇,
      PopularEmoji.捂脸,
      PopularEmoji.无语,
      PopularEmoji.大哭,
      PopularEmoji.酸了,
      PopularEmoji.歪嘴,
      PopularEmoji.跪了,
      PopularEmoji.响指,

      PopularEmoji.哇,
      PopularEmoji.萌萌哒,
      PopularEmoji.害羞,
      PopularEmoji.偷笑,
      PopularEmoji.哭惹,
      PopularEmoji.汗颜,
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

/** 关于扩展的超链接。 */
export const enum Links {
  /** 官网主页 */
  Home = 'https://v2p.app',
  /** 问题反馈页 */
  Feedback = 'https://github.com/coolpace/V2EX_Polish/discussions/1?sort=new',
  /** 主题图片分享页 */
  Share = 'https://v2p.app/share',
  /** 赞赏支持页 */
  Support = 'https://v2p.app/support',
}

export const READABLE_CONTENT_HEIGHT = 250
export const MAX_CONTENT_HEIGHT = 550

export const READING_CONTENT_LIMIT = 150

/** Popup 中缓存的主题列表数据的过期时间。 */
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

/** 扩展初始化提供的默认选项。 */
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
    hideReplyTime: true,
    hideRefName: true,
    showImgInPage: true,
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
  showOptions = 'showOptions',
}

export const enum MessageFrom {
  Content,
  Web,
}
