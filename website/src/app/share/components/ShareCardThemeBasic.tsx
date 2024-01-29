import { Avatar } from '@radix-ui/themes'

import type { TopicInfo } from '~/app/api/share/route'

interface ShareCardProps {
  avatarRef: React.RefObject<HTMLImageElement>
  topicInfo: TopicInfo
  showSubtle?: boolean
  showQRCode?: boolean
}

export function ShareCardThemeBasic(props: ShareCardProps) {
  const { topicInfo, avatarRef, showSubtle, showQRCode } = props

  return (
    <div className="theme-dark bg-background p-2">
      <div className="overflow-hidden rounded-lg border border-solid border-main-400 bg-content p-3 text-foreground">
        <div className="pb-2 text-2xl font-extrabold">V2EX</div>

        <h2 className="line-clamp-3 text-xl font-semibold">{topicInfo.title}</h2>

        <div className="mt-3 flex items-center px-1">
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
            <hr className="my-3 border-main-400" />

            <div
              className={`
              prose prose-slate prose-invert leading-6
              prose-p:mt-0 prose-p:text-foreground
              prose-a:pointer-events-none prose-a:font-normal prose-a:text-accent-600 prose-a:no-underline
              prose-blockquote:-mx-2 prose-blockquote:border-l-accent-200
              prose-blockquote:bg-subtle prose-blockquote:p-2 prose-blockquote:text-[15px] prose-blockquote:font-normal
              prose-blockquote:not-italic prose-blockquote:text-foreground prose-li:m-0
              prose-img:m-0
              `}
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

        {showQRCode && (
          <div className="flex pt-6">
            <div className="ml-auto flex items-center gap-x-3">
              <div className="text-xs/5">
                <p>长按扫码</p>
                <p>查看详情</p>
              </div>
              {/* eslint-disable @next/next/no-img-element */}
              <img
                alt="二维码"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=54x54&bgcolor=22272e&color=adbac7&data=${topicInfo.url}`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
