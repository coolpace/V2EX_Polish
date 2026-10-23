/**
 * 主题预览帧的标记。
 *
 * 由 theme-boot 在 document_start 阶段设置，样式与业务脚本据此在首帧确定布局：
 * - `'1'`：本扩展的预览弹窗（iframe 地址携带 PREVIEW_QUERY），隐藏顶部导航；
 * - `'embed'`：其他扩展或用户脚本用 iframe 实现的链接预览，无法携带我们的
 *   查询参数，只能按 iframe 环境识别，保留顶部导航、仅收起右侧栏。
 */

/** 预览弹窗附加在 iframe 地址上的查询参数。 */
export const PREVIEW_QUERY = 'v2p-preview'

/** 预览帧标记属性，对应样式中的 `:root[data-v2p-preview]`。 */
const PREVIEW_ATTRIBUTE = 'data-v2p-preview'

/** 预览帧标记值：完整预览（隐藏顶部导航），或仅收起右侧栏。 */
export type PreviewFrameMode = '1' | 'embed'

/** 预览帧判定所需的页面环境。 */
export interface PreviewFrameEnv {
  /** 当前文档是否运行在 iframe 中。 */
  embedded: boolean
  /** 当前文档的查询字符串。 */
  search: string
}

/** 判断查询字符串是否表示本扩展的预览弹窗。 */
function isPreviewSearch(search: string): boolean {
  return new URLSearchParams(search).get(PREVIEW_QUERY) === '1'
}

/** 计算当前环境应使用的预览帧标记，普通页面返回 null。 */
export function resolvePreviewFrameMode({
  embedded,
  search,
}: PreviewFrameEnv): PreviewFrameMode | null {
  if (isPreviewSearch(search)) {
    return '1'
  }

  return embedded ? 'embed' : null
}

/** 为预览帧打上标记，需在 document_start 阶段调用。 */
export function markPreviewFrame(): void {
  const mode = resolvePreviewFrameMode({
    embedded: window.top !== window,
    search: window.location.search,
  })

  if (mode) {
    document.documentElement.setAttribute(PREVIEW_ATTRIBUTE, mode)
  }
}
