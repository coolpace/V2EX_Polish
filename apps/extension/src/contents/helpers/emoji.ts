import { replaceEmojiWithHD } from '../../utils/emoji'
import { $commentCells } from '../globals'

export { isEmojiImage, markEmojiImages, replaceEmojiWithHD, transformEmoji } from '../../utils/emoji'

/**
 * 处理评论中的表情图片，将其转换为高清表情图片。
 */
export function replaceCommentEmojiWithHD($cells: JQuery = $commentCells) {
  const $embedImages = $cells.find('.reply_content .embedded_image, .payload .embedded_image')

  if ($embedImages.length > 0) {
    replaceEmojiWithHD($embedImages)
  }
}
