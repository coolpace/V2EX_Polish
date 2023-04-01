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
]

export const READABLE_CONTENT_HEIGHT = 250
export const MAX_CONTENT_HEIGHT = 550

export const dataExpiryTime = 60 * 60 * 1000
