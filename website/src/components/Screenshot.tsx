import { MoonStarIcon, SearchIcon, SunIcon } from 'lucide-react'

function Container(props: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={`bg-content shadow-box group-[.theme-dark]:border-main-350 rounded-lg border border-solid border-transparent ${
        props.className ?? ''
      }`}
    >
      {props.children}
    </div>
  )
}

function TopicItem(props: {
  title: string
  tag: string
  name: string
  time: string
  num: string
  avatar: string
}) {
  return (
    <div className="border-main-200 flex items-center border-b border-solid px-4 py-6 text-sm last-of-type:border-none">
      <div
        className={`mr-6 mt-[3px] h-12 w-12 shrink-0 self-start rounded bg-gradient-to-br ${props.avatar}`}
      />
      <div className="mr-7">
        <div className="text-base font-semibold">{props.title}</div>
        <div className="text-main-500 mt-1 flex items-center gap-x-3 text-[13px]">
          <div className="bg-main-100 rounded px-[6px] py-px">{props.tag}</div>
          <span>{props.name}</span>
          <span>{props.time}</span>
        </div>
      </div>
      <span className="bg-main-200 text-main-500 ml-auto whitespace-nowrap rounded-md px-2 py-[2px] text-sm">
        {props.num}
      </span>
    </div>
  )
}

function TopicItem2(props: { long?: boolean }) {
  return (
    <div className="border-main-200 flex items-center border-t border-solid p-2 text-sm">
      <div className="from-main-200 to-main-100 mr-2 h-6 w-6 shrink-0 rounded bg-gradient-to-b" />
      <div className="flex-1">
        <div className="from-main-200 to-main-100 h-3 flex-1 rounded-sm bg-gradient-to-b" />
        {props.long && (
          <div className="from-main-200 to-main-100 mt-[6px] h-3 w-2/3 rounded-sm bg-gradient-to-b" />
        )}
      </div>
    </div>
  )
}

function Coin(props: { className?: string }) {
  return (
    <span
      className={`mx-1 inline-block h-3 w-3 rounded-full last-of-type:mr-0 ${
        props.className ?? ''
      }`}
    />
  )
}

export function Screenshot(props: { className?: string }) {
  return (
    <div
      className={`bg-main-50 text-main-800 [&.theme-dark]:text-main-700 cursor-default select-none ${props.className}`}
    >
      <div className="bg-content h-14 w-full px-4">
        <div className="mx-auto flex h-full w-full max-w-5xl items-center">
          <div className="bg-main-100 inline-flex h-8 w-52 items-center rounded-md px-2">
            <SearchIcon className="text-main-400" height={16} width={16} />
          </div>

          <ul className="text-main-500 ml-auto inline-flex gap-5 whitespace-nowrap text-sm">
            <li>首页</li>
            <li>记事本</li>
            <li>时间轴</li>
            <li>设置</li>
            <li>登出</li>
          </ul>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="mx-auto flex w-full max-w-5xl items-start gap-x-6 overflow-hidden">
          <Container className="flex-1 px-3">
            <div className="flex items-center gap-x-5 whitespace-nowrap px-4 py-3 text-sm">
              <span>技术</span>
              <span>创意</span>
              <span>好玩</span>
              <span>Apple</span>
              <span>酷工作</span>
              <span>交易</span>
              <span className="text-main-50 after:bg-main-700 relative z-10 after:absolute after:left-1/2 after:top-1/2 after:z-[-1] after:h-6 after:w-[140%] after:-translate-x-1/2 after:-translate-y-1/2 after:rounded after:content-['']">
                城市
              </span>
              <span>问与答</span>
              <span>最热</span>
              <span>全部</span>
              <span>R2</span>
              <span>节点</span>
              <span>关注</span>
            </div>

            <div className="bg-main-100 flex items-center gap-x-5 rounded px-3 py-2 text-sm">
              <span>北京</span>
              <span>上海</span>
              <span>深圳</span>
              <span>广州</span>
              <span>杭州</span>
              <span>成都</span>
              <span>新加波</span>
              <span>纽约</span>
              <span>洛杉矶</span>
            </div>

            <div>
              <TopicItem
                avatar="from-indigo-400 to-cyan-400"
                name="godlucky"
                num="38"
                tag="问与答"
                time="2 天前"
                title="大家好，我是一个新人，也是一名独立开发者，海内存知己，天涯若比邻，很高兴能认识大家"
              />
              <TopicItem
                avatar="from-emerald-400 to-cyan-400"
                name="hardman"
                num="129"
                tag="生活"
                time="48 天前"
                title="目前在吉隆坡，下周去新加坡，请 V 友推荐玩的地方"
              />
              <TopicItem
                avatar="from-teal-400 to-yellow-200"
                name="moonrailgun"
                num="86"
                tag="程序员"
                time="1 小时 50 分钟前"
                title="为了更加科学的发帖，我统计了过去几周的 V2EX 的在线人数"
              />
              <TopicItem
                avatar="from-violet-200 to-pink-200"
                name="djyde"
                num="162"
                tag="分享创造"
                time="10 天前"
                title="开发一个浏览器插件在第三天卖出 1000 元"
              />
            </div>
          </Container>

          <div className="basis-[270px] flex-col gap-y-6 text-sm md:hidden lg:flex">
            <Container>
              <div className="flex gap-x-4 px-4 py-3">
                <div className="h-12 w-12 rounded bg-gradient-to-r from-amber-200 to-yellow-500" />
                <div>
                  <div className="text-base">coolpace</div>
                  <div className="text-main-500 mt-1 text-[13px]">不要去追一匹马</div>
                </div>
                <div className="text-main-600 relative ml-auto h-[22px] w-[22px]">
                  <SunIcon
                    className="absolute left-0 top-0 hidden group-[.theme-dark]:inline-block"
                    height={22}
                    width={22}
                  />
                  <MoonStarIcon
                    className="absolute left-0 top-0 inline-block group-[.theme-dark]:hidden"
                    height={22}
                    width={22}
                  />
                </div>
              </div>

              <div className="text-main-500 flex items-center justify-center py-2">
                <div className="border-main-300 flex flex-col items-center border-r border-solid px-4">
                  <span className="text-base">4</span>
                  <span className="mt-1 whitespace-nowrap">节点收藏</span>
                </div>
                <div className="border-main-300 flex flex-col items-center border-r border-solid px-4">
                  <span className="text-base">62</span>
                  <span className="mt-1 whitespace-nowrap">主题收藏</span>
                </div>
                <div className="flex flex-col items-center px-4">
                  <span className="text-base">9</span>
                  <span className="mt-1 whitespace-nowrap">特别关注</span>
                </div>
              </div>

              <div className="border-main-200 border-t border-solid p-3">
                <div className="bg-main-200 relative h-[3px] w-full after:absolute after:inset-y-0 after:left-0 after:right-1/4 after:bg-green-400 after:content-['']" />
              </div>

              <div className="border-main-200 border-t border-solid px-3 py-2">创作主题</div>
              <div className="border-main-200 flex items-center justify-between border-t border-solid px-3 py-2">
                <span>0 条未读提醒</span>
                <div className="bg-main-100 flex items-center rounded-full px-3 py-[3px] text-xs font-semibold">
                  4
                  <Coin className="bg-gradient-to-r from-amber-200 to-yellow-500" />
                  32
                  <Coin className="bg-gradient-to-r from-zinc-300 to-zinc-400" />
                  11
                  <Coin className="bg-gradient-to-r from-amber-400 to-amber-600" />
                </div>
              </div>
              <div className="border-main-200 border-t border-solid py-3 text-center text-green-500">
                今日已自动签到
              </div>
            </Container>

            <Container className="text-[13PX]">
              <div className="text-main-500 p-2 text-sm">今日热议主题</div>
              <TopicItem2 />
              <TopicItem2 />
              <TopicItem2 long />
            </Container>
          </div>
        </div>
      </div>
    </div>
  )
}
