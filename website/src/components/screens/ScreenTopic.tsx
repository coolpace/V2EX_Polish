import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  EyeOffIcon,
  HeartIcon,
  StarIcon,
  TagIcon,
  TwitterIcon,
} from 'lucide-react'

import {
  Avatar,
  Box,
  Content,
  Header,
  ReplyItem,
  RightSide,
  UserPanel,
  Wrapper,
} from '~/components/ui'

export function ScreenTopic() {
  return (
    <Wrapper>
      <Header />

      <Content>
        <div className="flex flex-1 flex-col gap-y-6">
          <Box className="px-3">
            <div className="flex p-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-[15px]">
                  V2EX
                  <ChevronRight size={12} strokeWidth={3} />
                  分享创造
                </div>
                <div className="mb-3 mt-2 text-[22px] font-bold">
                  ✨ V2EX 超强浏览器扩展：体验更先进的 V2EX！
                </div>
                <div className="flex items-center gap-2 text-xs text-main-600">
                  <span className="inline-flex items-center rounded border border-solid border-main-200 px-2">
                    <ChevronUp size={18} />
                  </span>
                  <span className="inline-flex items-center rounded border border-solid border-main-200 px-2">
                    <ChevronDown size={18} />
                  </span>
                  <span className="ml-1">coolpace</span>
                  <span>·</span>
                  <span>5 小时 25 分钟前</span>
                  <span>·</span>
                  <span>4096 次点击</span>
                </div>
              </div>
              <Avatar className="size-12 rounded" />
            </div>

            <div className="border-y border-solid border-main-200 px-2 py-5 text-[15px] [&>p:last-of-type]:mb-0 [&>p]:mb-[15px]">
              <p>
                V2EX Polish 是一款专为 V2EX 用户设计的浏览器插件，提供了丰富的扩展功能，让你的 V2EX
                页面焕然一新 ！如果你愿意，请为我们的项目点个 Star ⭐️
                或分享给他人，让更多的人知道我们的存在。
              </p>
            </div>

            <div className="flex items-center gap-x-6 px-1 py-2 text-xs text-main-600">
              <span className="flex items-center gap-1 whitespace-nowrap">
                <StarIcon size={15} />
                加入收藏
              </span>
              <span className="flex items-center gap-1 whitespace-nowrap">
                <TwitterIcon size={15} />
                Tweet
              </span>
              <span className="flex items-center gap-1 whitespace-nowrap">
                <EyeOffIcon size={15} />
                忽略主题
              </span>
              <span className="flex items-center gap-1 whitespace-nowrap">
                <HeartIcon size={15} />
                感谢
              </span>

              <span className="ml-auto flex items-center gap-2">
                <span>4096 次点击</span>
                <span>·</span>
                <span>8 人收藏</span>
              </span>
            </div>
          </Box>

          <Box className="px-3">
            <div className="flex items-center px-2 py-4 text-sm text-main-600">
              <span className="flex items-center gap-x-2">
                <span className="whitespace-nowrap">125 条回复</span>
                <span className="text-xl font-bold">·</span>
                <span className="whitespace-nowrap">34 条热门回复</span>
              </span>

              <span className="ml-auto flex items-center gap-x-2 text-xs">
                <span className="inline-flex items-center gap-x-1 whitespace-nowrap rounded bg-main-200 px-2 py-1">
                  <TagIcon size={12} />
                  插件
                </span>
                <span className="inline-flex items-center gap-x-1 whitespace-nowrap rounded bg-main-200 px-2 py-1">
                  <TagIcon size={12} />
                  程序
                </span>
                <span className="inline-flex items-center gap-x-1 whitespace-nowrap rounded bg-main-200 px-2 py-1">
                  <TagIcon size={12} />
                  开发
                </span>
              </span>
            </div>

            <div className="px-1 pb-3">
              <ReplyItem
                avatar={
                  <div className="size-10 rounded bg-gradient-to-br from-indigo-400 to-cyan-400" />
                }
                content="安装了一下，真的是现代化的体验！"
                floor="1"
                name="codennnn"
                time="21 天前"
              />
              <div className="border-l-[3px] border-solid border-main-300 bg-main-100">
                <ReplyItem
                  isOp
                  nested
                  avatar={<Avatar className="ml-3 size-6 rounded" />}
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
              </div>
            </div>
          </Box>
        </div>

        <RightSide>
          <UserPanel />
        </RightSide>
      </Content>
    </Wrapper>
  )
}
