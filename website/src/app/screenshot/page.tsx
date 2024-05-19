import type { Metadata } from 'next'
import { SettingsIcon, ShapesIcon } from 'lucide-react'

import { FeaturesBg } from '~/components/FeatureBg'
import { PageContainer } from '~/components/PageContainer'
import { ScreenHome } from '~/components/screens/ScreenHome'
import { Avatar, ReplyItem } from '~/components/ui'
import { getPageTitle } from '~/utils'

export const metadata: Metadata = {
  title: getPageTitle('Features'),
  description: 'V2P 功能介绍，发现更多实用功能。',
}

export default function FeaturesPage() {
  return (
    <PageContainer className="flex flex-col gap-y-5">
      <FeaturesBg className="!aspect-[1280_/_640]">
        <div className="text-with-shadow flex items-center justify-center gap-7 pt-5">
          <div className="text-7xl font-black">
            V2EX
            <span className="text-polish ml-4">Polish</span>
          </div>
        </div>
        <div className="px-8 pb-8 pt-6 text-center text-4xl font-bold">
          丰富的功能扩展，重塑你的浏览体验
        </div>
        <div className="px-20">
          <div className="overflow-hidden rounded-2xl shadow-2xl shadow-main-300">
            <ScreenHome />
          </div>
        </div>
      </FeaturesBg>

      <FeaturesBg>
        <div className="px-8 pb-8 pt-9 text-center text-5xl font-bold">
          重新设计的界面，让 V2EX 焕然一新
        </div>
        <div className="px-20">
          <div className="overflow-hidden rounded-2xl shadow-xl shadow-main-100">
            <ScreenHome />
          </div>
        </div>
      </FeaturesBg>

      <FeaturesBg className="flex items-center gap-10 p-16">
        <div className="basis-2/5">
          <div className="text-5xl font-bold">楼中楼 - 嵌套回复</div>
          <div className="mt-10 text-3xl leading-relaxed">
            主题下的评论回复支持嵌套层级展示，更轻松地跟踪和回复其他用户的评论。
          </div>
        </div>

        <div className="flex-1 shadow-xl shadow-main-100">
          <div className="overflow-hidden rounded-2xl bg-white px-4">
            <div className="flex items-center px-2 pb-2 pt-3 text-sm text-main-600">
              <span className="flex items-center gap-x-2">
                <span className="whitespace-nowrap">125 条回复</span>
                <span className="text-xl font-bold">·</span>
                <span className="whitespace-nowrap">34 条热门回复</span>
              </span>
            </div>
            <ReplyItem
              avatar={
                <div className="size-10 rounded bg-gradient-to-br from-indigo-400 to-cyan-400" />
              }
              content="安装了一下，真的是现代化的体验！"
              floor="1"
              name="codennnn"
              time="21 天前"
            />
            <div className="pb-5">
              <div className="border-l-[3px] border-solid border-main-300 bg-main-100 pl-3">
                <ReplyItem
                  isOp
                  nested
                  avatar={<Avatar className="size-6 rounded" />}
                  content={
                    <>
                      <span className="mr-1 text-sm">
                        @
                        <span className="text-main-500 underline underline-offset-2">codennnn</span>
                      </span>
                      感谢你尝试 V2EX Polish ，我们希望打造一个超高质量的 V2EX 扩展。
                    </>
                  }
                  floor="2"
                  name="coolpace"
                  time="21 天前"
                />
                <div className="border-l border-solid border-main-300 bg-main-100 pl-3">
                  <ReplyItem
                    nested
                    avatar={
                      <div className="size-6 rounded bg-gradient-to-br from-indigo-400 to-cyan-400" />
                    }
                    content={
                      <>
                        <span className="mr-1 text-sm">
                          @
                          <span className="text-main-500 underline underline-offset-2">
                            coolpace
                          </span>
                        </span>
                        UI
                        比之前的版本又好看了，大家提的意见大部分都采纳了，已经安利给别的朋友了，大家都说好看
                      </>
                    }
                    floor="3"
                    name="codennnn"
                    time="21 天前"
                  />
                  <div className="border-l border-solid border-main-300 bg-main-100 pl-3">
                    <ReplyItem
                      nested
                      avatar={
                        <div className="size-6 rounded bg-gradient-to-br from-violet-200 to-pink-200" />
                      }
                      content={
                        <>
                          <span className="mr-1 text-sm">
                            @
                            <span className="text-main-500 underline underline-offset-2">
                              codennnn
                            </span>
                          </span>
                          很不错，希望能长期更新维护，加油
                        </>
                      }
                      floor="5"
                      name="dingding"
                      time="21 天前"
                    />
                  </div>
                </div>
              </div>
            </div>
            <ReplyItem
              avatar={
                <div className="size-10 rounded bg-gradient-to-br from-teal-400 to-yellow-200" />
              }
              content="体验优秀，反馈响应也很及时，给开发者点赞👍"
              floor="4"
              name="watercurly"
              time="21 天前"
            />
          </div>
        </div>
      </FeaturesBg>

      <FeaturesBg className="flex items-center gap-10 p-16">
        <div className="basis-2/5">
          <div className="text-5xl font-bold">快捷弹窗</div>
          <div className="mt-10 text-3xl leading-relaxed">
            随时随地查看 V2EX 主题列表，无需打开网页。
          </div>
        </div>

        <div className="flex-1 shadow-xl shadow-main-100">
          <div className="overflow-hidden rounded-2xl bg-white">
            <div className="p-3">
              <div className="flex items-center rounded bg-main-100 p-1">
                <div className="flex items-center text-sm">
                  <div className="px-3 py-2">稍后阅读</div>
                  <div className="rounded bg-main-800 px-2 py-1 text-white">最热</div>
                  <div className="px-3 py-2">最新</div>
                  <div className="px-3 py-2">消息</div>
                </div>
                <div className="ml-auto mr-4 flex items-center gap-4">
                  <ShapesIcon size={18} />
                  <SettingsIcon size={18} />
                </div>
              </div>
            </div>

            <div>
              <div className="p-4">
                <div className="text-lg font-bold">30 岁从大厂裸辞全家搬往英国的故事</div>
                <div className="mt-1 line-clamp-3 text-sm text-main-500">
                  从上海搬来伦敦已经 200 多天了，现在回想 2022
                  年年初的情景，仿佛是上辈子的事。这些事现在仿佛已经完全消失在空气之中了，但却对我们造成了很大的影响。我们做一个决定可能只需要短短几天，但是因此产生的波澜却要在今后的人生中长久回荡。所以我还是想讲完它。
                </div>
              </div>
              <div className="p-4">
                <div className="text-lg font-bold">V 站的风气是不是在网上算好的一批了</div>
                <div className="mt-1 line-clamp-3 text-sm text-main-500">
                  现在网上冲个浪，很少有人能正儿八经地谈论主题了。大多评论要不是丢下句网络流行语（比如“666”，流汗表情之类的）就走人，要不甩下句脏话就溜，更有甚者可以在与主题无关的情况下对喷起来，全是毫无营养的东西。年纪大了了，真是看得头疼。感觉
                  V 站除了什么政治相关的话题，讨论氛围还是能有早些年头那种和谐感的。
                </div>
              </div>
              <div className="p-4">
                <div className="text-lg font-bold">
                  都在说大环境不好，那么你们心目中大环境好的时候是什么样子的？
                </div>
                <div className="mt-1 line-clamp-3 text-sm text-main-500">
                  我先来抛砖引玉一个，记得大概 6 、7 年前在深圳找的第一份 java
                  工作，面试的时候就问了下会不会 SSM
                  ，然后写了一个数组里找最大值的算法就过了，那个时候面试基本都是问你会不会用，而不是像现在一样八股文问原理，然后公司都是拿融资疯狂扩招的状态。
                </div>
              </div>
              <div className="p-4">
                <div className="text-lg font-bold">
                  为了更加科学的发帖，我统计了过去几周的 V2EX 的在线人数
                </div>
                <div className="mt-1 line-clamp-3 text-sm text-main-500">
                  目标: 分析 V2EX 论坛用户在线规律，科学发帖让更多人可以看到。你可以在 CodeSandbox
                  中直接运行本项目。以在线预览图表。
                </div>
              </div>
            </div>
          </div>
        </div>
      </FeaturesBg>

      <FeaturesBg className="flex items-center gap-10 p-16">
        <div className="basis-2/5">
          <div className="text-5xl font-bold">预览回复</div>
          <div className="mt-10 text-3xl leading-relaxed">
            预览即将发送的内容，保证内容符合你的要求。
          </div>
        </div>

        <div className="flex-1 text-xl">
          <div className="rounded-xl border-[3px] border-solid border-main-200 bg-content p-5">
            <div className="flex items-center gap-3">
              <span className="shadow-[0_1px_currentColor]">编辑</span>
              <span>预览</span>
            </div>

            <div className="mt-4 rounded-md border-[3px] border-solid border-main-300 p-4">
              <p>/t/973118</p>
              <p>https://www.v2ex.com/t/973118</p>
              <p>https://www.v2p.app</p>
              <p>https://i.imgur.com/8POFF6j.jpeg</p>
            </div>
          </div>

          <div className="flex justify-center py-4 text-5xl">👇</div>

          <div className="rounded-xl border-[3px] border-solid border-main-200 bg-content p-5">
            <div className="flex items-center gap-3">
              <span>编辑</span>
              <span className="shadow-[0_1px_currentColor]">预览</span>
            </div>
            <div className="mt-4 [&>p]:mb-4">
              <p>
                <span className="bg-accent-50 text-accent-500 underline decoration-[1.5px] underline-offset-[0.46ex]">
                  /t/973118
                </span>
              </p>
              <p>
                <span className="bg-accent-50 text-accent-500 underline decoration-[1.5px] underline-offset-[0.46ex]">
                  https://www.v2ex.com/t/973118
                </span>
              </p>
              <p>
                <span className="bg-main-100 underline decoration-[1.5px] underline-offset-[0.46ex]">
                  https://www.v2p.app
                </span>
              </p>
              <p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="xxx" src="https://i.imgur.com/8POFF6j.jpeg" />
              </p>
            </div>
          </div>
        </div>
      </FeaturesBg>
    </PageContainer>
  )
}
