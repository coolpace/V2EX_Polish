import {
  BookOpenCheckIcon,
  ChevronsUpIcon,
  HeartIcon,
  MessageSquarePlusIcon,
  MoonStarIcon,
  PackagePlusIcon,
  SearchIcon,
  SunIcon,
} from 'lucide-react'

export function Wrapper(props: React.PropsWithChildren) {
  return (
    <div className="bg-main-50 text-foreground [&.theme-dark]:text-main-700">{props.children}</div>
  )
}

export function Content(props: React.PropsWithChildren) {
  return (
    <div className="px-4 py-6">
      <div className="mx-auto flex w-full max-w-5xl items-start gap-x-6 @container/content">
        {props.children}
      </div>
    </div>
  )
}

export function Box(props: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={`rounded-lg border border-solid border-transparent bg-content shadow-box group-[.theme-dark]:border-main-350 ${
        props.className ?? ''
      }`}
    >
      {props.children}
    </div>
  )
}

export function RightSide(props: React.PropsWithChildren) {
  return (
    <div className="hidden basis-[270px] flex-col gap-y-6 text-sm @4xl/content:flex">
      {props.children}
    </div>
  )
}

export function TopicItem(props: {
  title: string
  tag: string
  name: string
  time: string
  num: string
  avatar: string
}) {
  return (
    <div className="flex items-center border-b border-solid border-main-200 px-4 py-6 text-sm last-of-type:border-none">
      <div
        className={`mr-6 mt-[3px] size-12 shrink-0 self-start rounded bg-gradient-to-br ${props.avatar}`}
      />
      <div className="mr-7">
        <div className="text-base font-semibold">{props.title}</div>
        <div className="mt-1 flex items-center gap-x-3 text-[13px] text-main-500">
          <div className="rounded bg-main-100 px-[6px] py-px">{props.tag}</div>
          <span>{props.name}</span>
          <span>{props.time}</span>
        </div>
      </div>
      <span className="ml-auto whitespace-nowrap rounded-md bg-main-200 px-2 py-[2px] text-sm text-main-500">
        {props.num}
      </span>
    </div>
  )
}

export function TopicItemRight(props: { long?: boolean }) {
  return (
    <div className="flex items-center border-t border-solid border-main-200 p-2 text-sm">
      <div className="mr-2 size-6 shrink-0 rounded bg-gradient-to-b from-main-200 to-main-100" />
      <div className="flex-1">
        <div className="h-3 flex-1 rounded-sm bg-gradient-to-b from-main-200 to-main-100" />
        {props.long && (
          <div className="mt-[6px] h-3 w-2/3 rounded-sm bg-gradient-to-b from-main-200 to-main-100" />
        )}
      </div>
    </div>
  )
}

export function Paragraph({ width }: { width?: 'full' | '4/5' | '3/4' | '1/2' }) {
  return (
    <div
      className={`mt-[7px] h-[14px] rounded-sm bg-gradient-to-b from-main-200 to-main-100 ${
        width === 'full'
          ? 'w-full'
          : width === '4/5'
            ? 'w-4/5'
            : width === '3/4'
              ? 'w-3/4'
              : 'w-1/2'
      }`}
    />
  )
}

export function Header() {
  return (
    <div className="h-14 w-full bg-content px-4">
      <div className="mx-auto flex size-full max-w-5xl items-center">
        <div className="mr-6 text-3xl font-black tracking-tighter">V2EX</div>
        <div className="inline-flex h-8 w-52 items-center rounded-md bg-main-100 px-2">
          <SearchIcon className="text-main-400" height={16} width={16} />
        </div>

        <ul className="ml-auto inline-flex gap-5 whitespace-nowrap text-sm text-main-500">
          <li>首页</li>
          <li>记事本</li>
          <li>时间轴</li>
          <li>设置</li>
          <li>登出</li>
        </ul>
      </div>
    </div>
  )
}

export function Avatar(props: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`bg-gradient-to-r from-amber-200 to-yellow-500 ${props.className ?? ''}`} />
  )
}

function Coin(props: { className?: string }) {
  return (
    <span
      className={`mx-1 inline-block size-3 rounded-full last-of-type:mr-0 ${props.className ?? ''}`}
    />
  )
}

export function UserPanel() {
  return (
    <Box>
      <div className="flex gap-x-4 px-4 py-3">
        <Avatar className="size-12 rounded" />
        <div>
          <div className="text-base">coolpace</div>
          <div className="mt-1 text-[13px] text-main-500">不要去追一匹马</div>
        </div>
        <div className="relative ml-auto size-[22px] text-main-600">
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

      <div className="flex items-center justify-center py-2 text-main-500">
        <div className="flex flex-col items-center border-r border-solid border-main-300 px-4">
          <span className="text-base">4</span>
          <span className="mt-1 whitespace-nowrap">节点收藏</span>
        </div>
        <div className="flex flex-col items-center border-r border-solid border-main-300 px-4">
          <span className="text-base">62</span>
          <span className="mt-1 whitespace-nowrap">主题收藏</span>
        </div>
        <div className="flex flex-col items-center px-4">
          <span className="text-base">9</span>
          <span className="mt-1 whitespace-nowrap">特别关注</span>
        </div>
      </div>

      <div className="border-t border-solid border-main-200 p-3">
        <div className="relative h-[3px] w-full bg-main-200 after:absolute after:inset-y-0 after:left-0 after:right-1/4 after:bg-green-400 after:content-['']" />
      </div>

      <div className="border-t border-solid border-main-200 px-3 py-2">创作主题</div>
      <div className="flex items-center justify-between border-t border-solid border-main-200 px-3 py-2">
        <span>0 条未读提醒</span>
        <div className="flex items-center rounded-full bg-main-100 px-3 py-[3px] text-xs font-semibold">
          4
          <Coin className="bg-gradient-to-r from-amber-200 to-yellow-500" />
          32
          <Coin className="bg-gradient-to-r from-zinc-300 to-zinc-400" />
          11
          <Coin className="bg-gradient-to-r from-amber-400 to-amber-600" />
        </div>
      </div>

      <div className="hidden border-t border-solid border-main-200 py-3 text-center text-green-500 group-[[data-page='home']]/page:block">
        今日已自动签到
      </div>

      <div className="hidden grid-cols-3 gap-3 border-t border-solid border-main-200 px-2 py-3 text-xs text-main-600 group-[[data-page='topic']]/page:grid">
        <span className="flex items-center justify-center gap-x-1">
          <HeartIcon size={16} />
          热门回复
        </span>
        <span className="flex items-center justify-center gap-x-1">
          <MessageSquarePlusIcon size={16} />
          回复主题
        </span>
        <span className="flex items-center justify-center gap-x-1">
          <BookOpenCheckIcon size={16} />
          稍后阅读
        </span>
        <span className="flex items-center justify-center gap-x-1">
          <ChevronsUpIcon size={16} />
          回到顶部
        </span>
        <span className="flex items-center justify-center gap-x-1">
          <PackagePlusIcon size={16} />
          更多功能
        </span>
      </div>
    </Box>
  )
}

export function ReplyItem(props: {
  name: string
  floor: string
  nested?: boolean
  isOp?: boolean
  time: string
  avatar?: React.ReactNode
  content: string | React.ReactNode
}) {
  return (
    <div
      className={`flex text-xs ${
        props.nested ? 'py-3' : 'border-t border-solid border-main-200 py-5'
      }`}
    >
      {props.avatar}
      <div className="ml-3 flex-1 pt-1">
        <span className="flex items-center gap-x-3">
          <span className="text-sm font-semibold text-main-600">{props.name}</span>
          {props.isOp && (
            <span className="inline-flex items-center overflow-hidden rounded border border-solid border-emerald-400 text-xs font-semibold">
              <span className="bg-emerald-50 px-1 py-px text-emerald-400 group-[.theme-dark]:bg-emerald-900">
                OP
              </span>
              <span className="bg-emerald-400 px-1 py-px text-content">YOU</span>
            </span>
          )}
          <span className="ml-1 text-main-500">{props.time}</span>
        </span>
        <p className="mt-2 text-[15px] leading-5">{props.content}</p>
      </div>
      <div className="ml-3 mr-1">
        <span className="px-2 py-1 text-main-350">{props.floor}</span>
      </div>
    </div>
  )
}
