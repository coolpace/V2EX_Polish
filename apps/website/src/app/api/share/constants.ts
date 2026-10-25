/**
 * 分享接口的业务状态码。
 *
 * 独立于 route 模块存在的运行时常量，客户端可安全导入而不会把 route handler
 * （以及它依赖的 cheerio 等重量级模块）打进浏览器包。
 */
export enum ResponseCode {
  Success = 0,
  /** 由于不存在主题或需要授权访问，无法爬取到主题内容。 */
  NotFound = 1,
}
