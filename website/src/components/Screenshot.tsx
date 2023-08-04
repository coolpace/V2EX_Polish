import { SearchIcon } from 'lucide-react'

export function Screenshot() {
  return (
    <div className="screenshot bg-main-50 pointer-events-none select-none">
      <div className="bg-content mb-5 flex h-14 w-full items-center px-4">
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

      <div>
        <div className="mx-auto flex w-4/5 gap-x-3">
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
          </div>

          <div>
            <div className="bg-content rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
