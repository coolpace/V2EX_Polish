import { type Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
import {
  AppWindowIcon,
  BookMarkedIcon,
  BookOpenCheckIcon,
  FlameIcon,
  FoldVerticalIcon,
  ImageIcon,
  LaughIcon,
  ListTreeIcon,
  NewspaperIcon,
  SparklesIcon,
  TagsIcon,
  ViewIcon,
} from 'lucide-react'

import { Feature } from '~/components/Feature'
import { GitHubButton } from '~/components/GitHubButton'
import { InstallButton } from '~/components/InstallButton'
import { Introduction } from '~/components/Introduction'
import { Logo } from '~/components/Logo'
import { QA } from '~/components/QA'
import { getPageTitle } from '~/utils'

export const metadata: Metadata = {
  title: getPageTitle(),
}

const notoSans = Noto_Sans({
  weight: '900',
  subsets: ['latin'],
  display: 'swap',
})

export default function Page() {
  return (
    <div>
      <section>
        <div className="flex flex-col items-center">
          <div className="hero-title flex items-center justify-center gap-7">
            <div className="hidden h-[70px] w-[70px] md:block">
              <Logo />
            </div>
            <h1 className={`text-5xl font-bold lg:text-7xl ${notoSans.className}`}>
              V2EX
              <span className="text-polish ml-2 md:ml-3 lg:ml-4">Polish</span>
            </h1>
          </div>

          <p className="hero-sub-heading mb-8 mt-4 px-1 text-center text-base md:mb-16 md:mt-8 md:text-xl">
            专为 V2EX 用户设计的浏览器插件，丰富的扩展功能为你带来出色的体验
          </p>

          <div className="flex select-none gap-x-6 gap-y-2">
            <GitHubButton />
            <InstallButton />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-2 gap-x-12 md:grid-cols-3 md:px-4">
            <Introduction content=" ━ 绝不私自收集任何用户数据，安全可靠" title="尊重用户隐私" />
            <Introduction content=" ━ 包含 20 多个功能，给你前所未有的体验" title="功能丰富" />
            <Introduction content=" ━ 代码开源，所有功能均免费使用" title="免费使用" />
          </div>
        </div>
      </section>

      <section className="py-8 md:p-24">
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
            icon={<AppWindowIcon />}
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
            description="无需打开网页，插件内即可快速获取最热、最新的主题列表和消息通知"
            icon={<NewspaperIcon />}
            title="内置主题列表"
          />
        </div>
      </section>

      <section className="bg-main/5 p-3 md:p-8 lg:p-24">
        <h3 className="text-3xl font-bold">常见问题</h3>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
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
        </div>
      </section>
    </div>
  )
}
