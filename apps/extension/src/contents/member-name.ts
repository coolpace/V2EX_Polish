/** 从 V2EX 顶部导航读取当前登录用户名。 */
export function getCurrentMemberName(): string | undefined {
  const link = document.querySelector<HTMLAnchorElement>(
    '#Top .tools > a[href^="/member"]',
  )
  const memberName = link?.textContent?.trim()

  return memberName || undefined
}
