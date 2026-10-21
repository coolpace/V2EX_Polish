import { emojiLinks, type PopularEmoji } from '../constants'

/** 表情图片低清→高清的 URL 映射（模块级常量，避免每次调用重复创建）。 */
const emojiSrcMap = new Map<string, string>(
  Object.values(emojiLinks).map(({ ld, hd }) => [ld, hd]),
)

/** 表情图片的全部链接（低清 + 高清）。 */
const emojiImageSrcSet = new Set([...emojiSrcMap.keys(), ...emojiSrcMap.values()])

/** 表情图片的类名标记，用于在样式上与普通内容图片区分（见 v2ex-effect.scss）。 */
const EMOJI_IMG_CLASS = 'v2p-emoji-img'

/**
 * 判断图片是否为插件内置的表情图片（低清或高清链接）。
 *
 * 表情图片在 V2EX 中同样是 `img.embedded_image`，需要与普通内容图片区分开。
 */
export function isEmojiImage($img: JQuery): boolean {
  const src = $img.attr('src')

  return typeof src === 'string' && emojiImageSrcSet.has(src)
}

/**
 * 给表情图片添加标记类，便于在样式上与普通内容图片区分。
 */
export function markEmojiImages($imgs: JQuery): void {
  $imgs.each((_, img) => {
    const $img = $(img)

    if (isEmojiImage($img)) {
      $img.addClass(EMOJI_IMG_CLASS)
    }
  })
}

/**
 * 将形如 [表情代码] 转换成表情图片的网络链接。
 */
export function transformEmoji(textValue: string) {
  return textValue.replace(/\[[^\]]+\]/g, (x) => {
    if (Object.hasOwn(emojiLinks, x)) {
      const emojiLink = emojiLinks[x as PopularEmoji].ld

      if (typeof emojiLink === 'string') {
        return `${emojiLink} `
      }
    }

    return x
  })
}

/**
 * 将低清表情图片转换成高清表情图片。
 */
export function replaceEmojiWithHD($emojiImgs: JQuery) {
  if ($emojiImgs.length > 0) {
    markEmojiImages($emojiImgs)

    $emojiImgs.each((_, img) => {
      const $img = $(img)

      const src = $img.attr('src')

      if (typeof src === 'string') {
        const hd = emojiSrcMap.get(src)

        if (typeof hd === 'string') {
          $img.attr('src', hd)
          $img.css({
            width: 'var(--v2p-emoji-size)',
            height: 'var(--v2p-emoji-size)',
          })
        }
      }
    })
  }
}
