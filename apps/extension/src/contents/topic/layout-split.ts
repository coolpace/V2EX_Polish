/**
 * 计算主题页水平布局所需的左右分组。
 *
 * V2EX 新版用 `#topic-replies` 包住回复区，分栏边界必须落在 `#Main` 的
 * 直接子元素上，不能再用回复区自身的 `.prev('.sep20')` 作为分界。
 * 返回 `null` 表示当前结构无法安全分栏，调用方应保持垂直布局。
 */
export function getHorizontalLayoutGroups(
  main: Element | null | undefined,
  target: Element | null | undefined,
): { left: Element[], right: Element[] } | null {
  if (!main || !target) {
    return null
  }

  const children = Array.from(main.children)

  // 已经分过栏时不再重复包裹，避免切换后累积嵌套容器。
  if (children.some((el) => el.matches('.v2p-left-side, .v2p-left-group, .v2p-right-side'))) {
    return null
  }

  const anchor = children.find((el) => el === target || el.contains(target))

  if (!anchor) {
    return null
  }

  const anchorIndex = children.indexOf(anchor)
  const previous = children[anchorIndex - 1]
  // 与原实现保持一致：仅当紧邻的前一个兄弟是分隔线时，把它一并划入右栏。
  const startIndex = previous?.classList.contains('sep20') ? anchorIndex - 1 : anchorIndex
  const left = children.slice(0, startIndex)
  const right = children.slice(startIndex)

  if (left.length === 0 || right.length === 0) {
    return null
  }

  return { left, right }
}
