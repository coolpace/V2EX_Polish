export function getPageTitle(title?: string): string {
  const mainTitle = 'V2EX Polish 官网'

  return title ? `${title} - ${mainTitle}` : mainTitle
}
