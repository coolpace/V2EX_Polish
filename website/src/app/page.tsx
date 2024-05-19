import type { Metadata } from 'next'
import Link from 'next/link'
import {
  BookMarkedIcon,
  BookOpenCheckIcon,
  FlameIcon,
  FoldVerticalIcon,
  ImageIcon,
  LaughIcon,
  ListTreeIcon,
  NewspaperIcon,
  PaletteIcon,
  SparklesIcon,
  TagsIcon,
  ViewIcon,
} from 'lucide-react'

import { Feature } from '~/components/Feature'
import { HoverButton } from '~/components/HoverButton'
import { EdgeIcon } from '~/components/icons/EdgeIcon'
import { FirefoxIcon } from '~/components/icons/FirefoxIcon'
import { SafariIcon } from '~/components/icons/SafariIcon'
import { TampermonkeyIcon } from '~/components/icons/TampermonkeyIcon'
import { InstallButton } from '~/components/InstallButton'
import { Introduction } from '~/components/Introduction'
import { PageContainer } from '~/components/PageContainer'
import { QA } from '~/components/QA'
import { Screenshot } from '~/components/Screenshot'
import { getPageTitle } from '~/utils'

export const metadata: Metadata = {
  title: getPageTitle(),
}

export default function HomePage() {
  return (
    <PageContainer className="mx-auto max-w-7xl">
      {/* Hero */}
      <section className="py-8">
        <div className="flex flex-col items-center">
          <div className="text-with-shadow flex items-center justify-center md:gap-6 lg:gap-7">
            <div className="text-5xl font-black md:text-6xl lg:text-7xl">
              V2EX
              <span className="text-polish ml-2 md:ml-3 lg:ml-4">Polish</span>
            </div>
          </div>

          <h1 className="hero-sub-heading mb-8 mt-4 px-1 text-center text-base md:mb-16 md:mt-8 md:text-xl">
            专为 V2EX 用户设计的浏览器插件，集合了众多实用功能，让原生页面焕然一新！
          </h1>

          <div className="flex select-none gap-x-6 gap-y-2">
            <InstallButton />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-main-500 md:flex md:items-center md:gap-6 md:text-sm">
            <HoverButton>
              <Link
                className="flex items-center gap-2"
                href="https://chromewebstore.google.com/detail/v2ex-polish/onnepejgdiojhiflfoemillegpgpabdm"
                target="_blank"
              >
                <span className="inline-block size-6">
                  <EdgeIcon />
                </span>
                <span className="break-all">
                  <span className="whitespace-nowrap">Edge</span>
                  <span className="ml-1 whitespace-nowrap">可用</span>
                </span>
              </Link>
            </HoverButton>

            <HoverButton>
              <Link
                className="flex items-center gap-2"
                href="https://addons.mozilla.org/zh-CN/firefox/addon/v2ex-polish/"
                target="_blank"
              >
                <span className="inline-block size-6">
                  <FirefoxIcon />
                </span>
                <span className="break-all">
                  <span className="whitespace-nowrap">Firefox</span>
                  <span className="ml-1 whitespace-nowrap">可用</span>
                </span>
              </Link>
            </HoverButton>

            <HoverButton>
              <Link
                className="flex items-center gap-2"
                href="https://github.com/coolpace/V2EX_Polish/blob/main/website/src/content/docs/use-in-safari.md"
                target="_blank"
              >
                <span className="inline-block size-6">
                  <SafariIcon />
                </span>
                <span className="break-all">
                  <span className="whitespace-nowrap">Safari</span>
                  <span className="ml-1 whitespace-nowrap">可用</span>
                </span>
              </Link>
            </HoverButton>

            <HoverButton>
              <Link
                className="flex items-center gap-2"
                href="https://greasyfork.org/zh-CN/scripts/459848-v2ex-polish-%E4%BD%93%E9%AA%8C%E6%9B%B4%E7%8E%B0%E4%BB%A3%E5%8C%96%E7%9A%84-v2ex"
                target="_blank"
              >
                <span className="inline-flex size-6 items-center">
                  <span className="size-5">
                    <TampermonkeyIcon />
                  </span>
                </span>
                油猴脚本可用
              </Link>
            </HoverButton>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-2 gap-x-12 md:grid-cols-3 md:px-4">
            <Introduction content=" ━ 绝不私自收集任何用户数据，安全可靠" title="尊重用户隐私" />
            <Introduction content=" ━ 安装体积小于 0.18M，即装即用" title="轻量便捷" />
            <Introduction content=" ━ 代码开源，所有功能均免费使用" title="免费使用" />
          </div>
        </div>
      </section>

      {/* Screenshot */}
      <section className="mx-auto hidden max-w-6xl md:block md:py-10 lg:py-16">
        <Screenshot />
      </section>

      {/* Features */}
      <section className="py-8 md:px-24 md:pb-24">
        <h2 className="mb-3 text-center text-xl font-bold md:text-3xl">这些功能，深受用户喜爱</h2>
        <p className="mb-14 text-center text-sm text-main-600 md:text-base">
          超过 20 多个功能扩展，给予你现代化的网页体验
        </p>
        <div className="grid w-full grid-cols-1 content-center gap-y-10 px-8 md:grid-cols-2 md:gap-x-14 md:gap-y-16 md:px-0 lg:grid-cols-3">
          <Feature
            description="UI 设计更现代化，为你带来愉悦的视觉体验"
            icon={<SparklesIcon />}
            title="界面美化"
          />
          <Feature
            description="主题下的评论回复支持层级展示，可以更轻松地跟踪和回复其他用户的评论"
            icon={<ListTreeIcon />}
            title="评论回复嵌套层级"
          />
          <Feature
            description="自动筛选出最受欢迎的回复，第一时间追上热评"
            icon={<FlameIcon />}
            title="热门回复展示"
          />
          <Feature
            description="评论输入框可以选择表情，让回复更加生动和有趣"
            icon={<LaughIcon />}
            title="表情回复支持"
          />
          <Feature
            description="智能折叠长篇回复，一键展开查看完整内容"
            icon={<FoldVerticalIcon />}
            title="长回复优化"
          />
          <Feature
            description="无需打开网页，插件内即可快速获取最热、最新的主题列表和消息通知"
            icon={<NewspaperIcon />}
            title="内置主题列表"
          />
          <Feature
            description="自动领取每日签到奖励"
            icon={<BookOpenCheckIcon />}
            title="自动每日签到"
          />
          <Feature
            description="暂存感兴趣的主题，方便日后阅读"
            icon={<BookMarkedIcon />}
            title="稍后阅读"
          />
          <Feature description="对用户设置标签以进行标记" icon={<TagsIcon />} title="用户标签" />
          <Feature description="粘贴、拖放极速上传图片" icon={<ImageIcon />} title="便捷图片上传" />
          <Feature
            description="无需再进入主题页面，在主题列表中即可浏览内容"
            icon={<ViewIcon />}
            title="主题内容预览"
          />
          <Feature
            description="自动跟随系统切换浅色/深色主题"
            icon={<PaletteIcon />}
            title="智能感应主题"
          />
        </div>
      </section>

      {/* Q&A */}
      <section className="rounded-md bg-main-100 p-3 md:rounded-xl md:p-8 lg:p-24">
        <h3 className="text-xl font-bold md:text-3xl">常见问题</h3>

        <div className="mt-5 grid grid-cols-1 gap-8 md:mt-8 md:grid-cols-2 md:gap-12 lg:gap-16">
          <QA
            a="油猴脚本不支持个性化设置、右键功能菜单、用户标签设置。浏览器扩展支持全部功能，并且经过了更多的测试。为了达到最佳的功能体验，我们更推荐你安装扩展。"
            q="使用油猴脚本和浏览器扩展有什么区别？"
          />
          <QA
            a="如果你使用了其他与 V2EX 相关的插件，那么很可能会引发功能冲突，从而导致页面异常，建议关闭其他插件以排查问题。"
            q="为什么我的页面内容有误、样式异常？"
          />
          <QA
            a="由于 V2EX 的原回复并没有记录回复的楼层，本扩展只能根据被回复的用户去寻找此用户的最近一条回复，然后嵌入到这后面去，这种方法并不能保证正确识别用户真正要回复的是哪一个楼层。"
            q="为什么有的「楼中楼」回复的楼层不正确？"
          />
          <QA
            a="PAT 并不是强制的，只有当你想要使用诸如 主题内容预览、获取消息通知 等功能时才需要设置，它是用来访问 V2EX 开放 API 的。如果你还没有，请前往这里创建。"
            q="为什么需要设置「个人访问令牌（PAT）」？"
          />
          <QA
            a="目前插件匹配的域名规则列表中，只添加了常见的确切域名，一些不常见的域名，如 `us.v2ex.com`、`jp.v2ex.com` 就没有加入规则中。"
            q="为什么插件在某些 V2EX 域名上不生效？"
          />
          <QA
            a="不会，「控制选项」和「用户标签」会自动通过远端进行备份和同步，无需担心重装插件会丢失数据。"
            q="重装插件会丢失我的设置吗？"
          />
        </div>
      </section>
    </PageContainer>
  )
}
