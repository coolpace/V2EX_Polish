export function getPageTitle(title?: string): string {
  const mainTitle = 'V2EX Polish 浏览器插件'

  return title ? `${title} - ${mainTitle}` : mainTitle
}
