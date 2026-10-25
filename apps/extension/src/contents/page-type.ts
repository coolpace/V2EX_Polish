/**
 * 页面类型的首帧标记。
 *
 * 部分布局规则必须在首帧就生效（例如窄窗口下主题页的右侧栏直接收起），
 * 而页面类型只能由脚本判断，因此由 theme-boot 在 document_start 阶段给
 * <html> 打上标记，样式与业务脚本都据此判断。
 */

/** 页面类型标记属性，对应样式中的 `:root[data-v2p-page='topic']`。 */
const PAGE_ATTRIBUTE = 'data-v2p-page'

/** 判断路径是否为主题页。 */
export function isTopicPath(pathname: string): boolean {
  return pathname.startsWith('/t/')
}

/** 标记页面类型，需在 document_start 阶段调用。 */
export function markPageType(): void {
  if (isTopicPath(window.location.pathname)) {
    document.documentElement.setAttribute(PAGE_ATTRIBUTE, 'topic')
  }
}
