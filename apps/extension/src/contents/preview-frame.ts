/**
 * 主题预览弹窗的 iframe 标记。
 *
 * 预览页需要在首帧就确定布局（隐藏顶部导航与右侧栏），因此由 theme-boot
 * 在 document_start 阶段打上标记，样式与业务脚本都据此判断。
 */

/** 预览弹窗附加在 iframe 地址上的查询参数。 */
export const PREVIEW_QUERY = 'v2p-preview'

/** 预览帧标记属性，对应样式中的 `:root[data-v2p-preview='1']`。 */
const PREVIEW_ATTRIBUTE = 'data-v2p-preview'

/** 判断查询字符串是否表示预览帧。 */
export function isPreviewSearch(search: string): boolean {
  return new URLSearchParams(search).get(PREVIEW_QUERY) === '1'
}

/** 判断当前页面是否为预览弹窗中的 iframe。 */
export function isPreviewFrame(): boolean {
  return document.documentElement.getAttribute(PREVIEW_ATTRIBUTE) === '1'
}

/** 为预览帧打上标记，需在 document_start 阶段调用。 */
export function markPreviewFrame(): void {
  if (isPreviewSearch(window.location.search)) {
    document.documentElement.setAttribute(PREVIEW_ATTRIBUTE, '1')
  }
}
