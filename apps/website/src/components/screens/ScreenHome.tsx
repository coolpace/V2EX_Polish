import {
  Box,
  Content,
  Header,
  RightSide,
  TopicItem,
  TopicItemRight,
  UserPanel,
  Wrapper,
} from '~/components/ui'

export function ScreenHome() {
  return (
    <Wrapper>
      <Header />

      <Content>
        <Box className="flex-1 px-3">
          <div className="flex items-center gap-x-5 whitespace-nowrap px-4 py-3 text-sm">
            <span>技术</span>
            <span>创意</span>
            <span>好玩</span>
            <span>Apple</span>
            <span>酷工作</span>
            <span>交易</span>
            <span className="relative z-10 text-main-50 after:absolute after:left-1/2 after:top-1/2 after:z-[-1] after:h-6 after:w-[140%] after:-translate-x-1/2 after:-translate-y-1/2 after:rounded after:bg-main-700 after:content-['']">
              城市
            </span>
            <span>问与答</span>
            <span>最热</span>
            <span>全部</span>
            <span>R2</span>
            <span>节点</span>
            <span>关注</span>
          </div>

          <div className="flex items-center gap-x-5 rounded bg-main-100 px-3 py-2 text-sm">
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
        </Box>

        <RightSide>
          <UserPanel />

          <Box className="text-[13PX]">
            <div className="p-2 text-sm text-main-500">今日热议主题</div>
            <TopicItemRight />
            <TopicItemRight />
            <TopicItemRight long />
          </Box>
        </RightSide>
      </Content>
    </Wrapper>
  )
}
