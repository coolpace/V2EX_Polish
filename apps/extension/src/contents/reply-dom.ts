/** 返回元素中匹配选择器的直接子元素。 */
function getDirectChild<T extends Element>(
  element: Element,
  selector: string,
): T | null {
  return Array.from(element.children).find(
    (child) => child.matches(selector),
  ) as T | undefined ?? null
}

/** 从回复行中读取作者主页链接，兼容旧版与新 Flexbox 结构。 */
export function getReplyAuthorLinkFromRow(
  row: Element,
): HTMLAnchorElement | null {
  const cell = getDirectChild<HTMLTableCellElement>(row, 'td:nth-child(3)')

  if (!cell) {
    return null
  }

  const directAuthor = getDirectChild<HTMLElement>(cell, 'strong')

  if (directAuthor) {
    return getDirectChild<HTMLAnchorElement>(directAuthor, 'a')
  }

  const headerRow = getDirectChild<HTMLElement>(cell, '.flex-one-row')

  if (!headerRow) {
    return null
  }

  const authorRow = getDirectChild<HTMLElement>(headerRow, '.flex-one-row') ?? headerRow

  return authorRow.querySelector<HTMLAnchorElement>('strong > a')
}

/** 从回复 cell 中读取作者主页链接。 */
export function getReplyAuthorLinkFromCell(
  cell: Element,
): HTMLAnchorElement | null {
  const table = getDirectChild<HTMLTableElement>(cell, 'table')
  const tbody = table && getDirectChild<HTMLTableSectionElement>(table, 'tbody')
  const row = tbody && getDirectChild<HTMLTableRowElement>(tbody, 'tr')

  return row ? getReplyAuthorLinkFromRow(row) : null
}

/** 从回复 cell 中读取操作栏，兼容旧版 .fr 与新版 Flexbox 行。 */
export function getReplyActionsFromCell(
  cell: Element,
): HTMLElement | null {
  const table = getDirectChild<HTMLTableElement>(cell, 'table')
  const tbody = table && getDirectChild<HTMLTableSectionElement>(table, 'tbody')
  const row = tbody && getDirectChild<HTMLTableRowElement>(tbody, 'tr')
  const contentCell = row && getDirectChild<HTMLTableCellElement>(row, 'td:last-of-type')

  if (!contentCell) {
    return null
  }

  const legacyActions = getDirectChild<HTMLElement>(contentCell, '.fr')

  if (legacyActions) {
    return legacyActions
  }

  return Array.from(contentCell.querySelectorAll<HTMLElement>('.flex-one-row'))
    .filter((element) => Boolean(getDirectChild<HTMLElement>(element, '.no')))
    .at(-1) ?? null
}

/** 从操作栏中读取真正的回复链接，避免误选感谢区里的最后一个链接。 */
export function getReplyLinkFromActions(
  actions: Element,
): HTMLAnchorElement | null {
  return Array.from(actions.querySelectorAll<HTMLAnchorElement>('a'))
    .find((link) => {
      return Array.from(link.children).some(
        (child) => child.matches('img[alt="Reply"]'),
      )
    }) ?? null
}

/** 移除回复 cell 的原生操作按钮，只保留楼层号。 */
export function removeReplyActionsFromCell(cell: Element): void {
  const actions = getReplyActionsFromCell(cell)

  if (!actions) {
    return
  }

  for (const child of Array.from(actions.children)) {
    if (!child.matches('.no')) {
      child.remove()
    }
  }
}
