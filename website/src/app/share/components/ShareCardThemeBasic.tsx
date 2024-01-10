/* eslint-disable @next/next/no-img-element */

import { Avatar } from '@radix-ui/themes'

import type { TopicInfo } from '~/app/api/share/route'

interface ShareCardProps {
  avatarRef: React.RefObject<HTMLImageElement>
  topicInfo: TopicInfo
  showSubtle?: boolean
}

export function ShareCardThemeBasic(props: ShareCardProps) {
  const { topicInfo, avatarRef, showSubtle } = props

  return (
    <div
      className="p-2"
      style={{
        backgroundImage: `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><path d="m0 0 4 4Zm4 0L0 4Z" stroke-width=".5" stroke="%23000"/></svg>')`,
      }}
    >
      <div className="overflow-hidden rounded border-[3px] border-solid border-main-800 bg-white p-3 text-black">
        <div className="pb-2 text-2xl font-extrabold">V2EX</div>

        <h2 className="line-clamp-3 text-xl font-semibold">{topicInfo.title}</h2>

        <div className="mt-3 flex items-center px-1 text-main-500">
          <Avatar
            ref={avatarRef}
            className="mr-2"
            fallback={topicInfo.member.username.at(0)?.toUpperCase() || ''}
            id="xxx"
            size="1"
            src={topicInfo.member.avatar}
          />
          <span className="mr-3 truncate">{topicInfo.member.username}</span>

          <span className="ml-auto whitespace-nowrap text-xs">
            {topicInfo.time.year}-{topicInfo.time.month}-{topicInfo.time.day}
          </span>
        </div>

        {topicInfo.content && (
          <>
            <hr className="my-3 bg-main-100" />

            <div
              className="prose prose-slate leading-6 prose-p:mt-0 prose-p:text-black prose-a:pointer-events-none prose-a:font-normal prose-a:text-green-600 prose-a:no-underline prose-blockquote:text-[15px] prose-blockquote:font-normal prose-blockquote:not-italic prose-li:m-0 prose-img:m-0"
              id="topic-content"
            >
              <div dangerouslySetInnerHTML={{ __html: topicInfo.content }} />

              {showSubtle &&
                topicInfo.supplements?.map((item, idx) => {
                  return (
                    <blockquote key={`${idx}`}>
                      <div dangerouslySetInnerHTML={{ __html: item.content }} />
                    </blockquote>
                  )
                })}
            </div>
          </>
        )}

        <div className="flex pt-6">
          <div className="ml-auto flex items-center gap-x-3">
            <div className="text-xs/5 text-main-400">
              <p>长按扫码</p>
              <p>查看详情</p>
            </div>
            <img
              alt="二维码"
              src={`https://api.qrserver.com/v1/create-qr-code/?size=54x54&bgcolor=ffffff&color=475569&data=${topicInfo.url}`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
