import { MoonStarIcon, SearchIcon } from 'lucide-react'

function Item() {
  return (
    <div className="flex items-center border-b border-solid px-4 py-6 text-sm last-of-type:border-none">
      <div className="bg-main-100 mr-7 h-12 w-12 rounded" />
      <div>
        <div className="text-lg font-semibold">xxxxxxxxxxxxxxxxx</div>
        <div className="flex items-center gap-x-5">
          <div className="bg-main-100 text-main-500 rounded px-2 py-[1px]">旅行</div>
          <span>xxxxx</span>
          <span>xxxxx</span>
        </div>
      </div>
      <div className="bg-main-200 text-main-500 ml-auto rounded-md px-3 py-[2px]">38</div>
    </div>
  )
}

export function Screenshot() {
  return (
    <div className="screenshot bg-main-50 select-none">
      <div className="bg-content flex h-14 w-full items-center px-4">
        <div className="bg-main-100 inline-flex h-8 w-52 items-center rounded px-2">
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

      <div className="py-5">
        <div className="mx-auto flex w-4/5 gap-x-7">
          <div className="bg-content rounded-md px-2">
            <div className="flex items-center gap-x-6 whitespace-nowrap px-2 py-3">
              <span>技术</span>
              <span>创意</span>
              <span>好玩</span>
              <span>Apple</span>
              <span>酷工作</span>
              <span>交易</span>
              <span className="after:bg-main-700 text-main-50 relative z-10 after:absolute after:left-1/2 after:top-1/2 after:z-[-1] after:h-6 after:w-[140%] after:-translate-x-1/2 after:-translate-y-1/2 after:rounded after:content-['']">
                城市
              </span>
              <span>问与答</span>
              <span>最热</span>
              <span>全部</span>
              <span>R2</span>
              <span>节点</span>
              <span>关注</span>
            </div>
            <div className="bg-main-50 flex items-center gap-x-5 rounded-md p-2">
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
              <Item />
              <Item />
              <Item />
            </div>
          </div>

          <div className="flex-1 text-sm">
            <div className="bg-content rounded">
              <div className="flex gap-x-4 px-4 py-3">
                <div className="bg-main-200 h-12 w-12 rounded" />
                <div>
                  <div className="text-base">coolpace</div>
                  <div className="text-main-500 mt-1 text-[13px]">不要去追一匹马</div>
                </div>
                <div className="ml-auto">
                  <MoonStarIcon height={22} width={22} />
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
                <div className="bg-main-100 rounded-full px-3 py-[2px]">1235346456</div>
              </div>
              <div className="border-main-200 border-t border-solid py-3 text-center text-green-500">
                今日已自动签到
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
