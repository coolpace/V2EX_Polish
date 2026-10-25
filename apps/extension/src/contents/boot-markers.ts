/**
 * document_start 阶段的首帧标记入口。
 *
 * 扩展（theme-boot）与用户脚本入口共用同一套标记，避免缺少某一个入口时
 * 页面在不同分发形态下出现不同的首帧布局。
 */

import { markPageType } from './page-type'
import { markPreviewFrame } from './preview-frame'

/** 应用全部首帧标记：预览帧与页面类型。 */
export function markBootState(): void {
  markPreviewFrame()
  markPageType()
}
