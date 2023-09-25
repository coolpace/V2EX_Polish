/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @next/next/no-img-element */

'use client'

import { useEffect, useRef, useState } from 'react'
import useEvent from 'react-use-event-hook'

import { useParams } from 'next/navigation'
import { Avatar, Button, Callout, Checkbox, Flex, Link, Text, TextField } from '@radix-ui/themes'
import { toBlob, toPng } from 'html-to-image'
import { AlertCircleIcon, SearchIcon } from 'lucide-react'

import type { RequestData as ImgRequestData } from '~/app/api/img-to-base64/route'
import {
  type RequestData as ShareRequestData,
  ResponseCode,
  type ResponseJson,
  type TopicInfo,
} from '~/app/api/share/route'
import { HOST } from '~/utils'

const isDev = process.env.NODE_ENV === 'development'

const fetchTopicInfo = async (topicId: ShareRequestData['topicId']): Promise<ResponseJson> => {
  const res = await window.fetch(`${isDev ? HOST : ''}/api/share`, {
    method: 'POST',
    body: JSON.stringify({ topicId }),
    mode: 'no-cors',
  })

  const data: ResponseJson = await res.json()

  return data
}

async function convertImageToBase64(url: string): Promise<string> {
  const requestData: ImgRequestData = { imgUrl: url }
  const res = await fetch(`${isDev ? HOST : ''}/api/img-to-base64`, {
    method: 'POST',
    body: JSON.stringify(requestData),
    mode: 'no-cors',
  })

  const { data }: { data: string } = await res.json()

  return data
}

export function ShareInfo() {
  const { topicId } = useParams()

  const eleRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLImageElement>(null)

  const [topicInfo, setTopicInfo] = useState<TopicInfo>()
  const [loading, setLoading] = useState(true)

  const [requestError, setRequestError] = useState(false)
  const [notFoundError, setNotFoundError] = useState(false)

  const [showSubtle, setShowSubtle] = useState(true)

  const [downloading, setDownloading] = useState(false)

  const canUseClipboardItem = typeof ClipboardItem !== 'undefined'
  const [doingCopy, setDoingCopy] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [copyFail, setCopyFail] = useState(false)

  const replaceAvatarSrc = async (avatarUrl: string) => {
    const avatarSrc = await convertImageToBase64(avatarUrl)
    avatarRef.current?.setAttribute('src', avatarSrc)
  }

  const replaceContentImageSrc = async () => {
    if (eleRef.current) {
      const promises: Promise<void>[] = []

      eleRef.current.querySelectorAll('#topic-content img').forEach((ele) => {
        const src = ele.getAttribute('src')

        if (src?.startsWith('http')) {
          promises.push(
            convertImageToBase64(src).then((imgSrc) => {
              ele.setAttribute('src', imgSrc)
            })
          )
        }
      })

      await Promise.all(promises)
    }
  }

  const handleCopy = async () => {
    if (
      eleRef.current &&
      topicInfo &&
      canUseClipboardItem &&
      !doingCopy &&
      !copySuccess &&
      !copyFail
    ) {
      setDoingCopy(true)

      const trigger = async () => {
        const item = new ClipboardItem({
          'image/png': (async () => {
            if (!eleRef.current) {
              throw new Error()
            }

            const blobData = await toBlob(eleRef.current)

            if (!blobData) {
              throw new Error()
            }

            return blobData
          })(),
        })

        await navigator.clipboard.write([item])

        setCopySuccess(() => {
          setTimeout(() => {
            setCopySuccess(false)
          }, 2000)
          return true
        })
      }

      try {
        await replaceAvatarSrc(topicInfo.member.avatar)
        await trigger()
      } catch {
        try {
          await replaceContentImageSrc()
          await trigger()
        } catch {
          setCopyFail(() => {
            setTimeout(() => {
              setCopyFail(false)
            }, 2000)
            return true
          })
        }
      } finally {
        setDoingCopy(false)
      }
    }
  }

  const handleDownload = async () => {
    if (eleRef.current && topicInfo && !downloading) {
      setDownloading(true)

      const trigger = async () => {
        if (eleRef.current) {
          const dataURL = await toPng(eleRef.current)
          const trigger = document.createElement('a')
          trigger.href = dataURL
          trigger.download = `V2EX - ${topicInfo.title}.png`
          trigger.click()
        }
      }

      try {
        await replaceAvatarSrc(topicInfo.member.avatar)
        await trigger()
      } catch {
        await replaceContentImageSrc()
        await trigger()
      } finally {
        setDownloading(false)
      }
    }
  }

  const requestTopicInfo = useEvent(async () => {
    if (typeof topicId === 'string') {
      try {
        // setTopicInfo(JSON.parse(process.env.NEXT_PUBLIC_DATA!) as TopicInfo)
        // return
        setLoading(true)
        setRequestError(false)
        setNotFoundError(false)

        const { code, data } = await fetchTopicInfo(topicId)

        if (code === ResponseCode.Success) {
          setTopicInfo(data)
          console.log(data)
        } else {
          setNotFoundError(true)
        }
      } catch {
        setRequestError(true)
      } finally {
        setLoading(false)
      }
    }
  })

  useEffect(() => {
    requestTopicInfo()
  }, [requestTopicInfo])

  const actionAvailable = !loading && !requestError && !notFoundError

  return (
    <div className="flex items-start gap-x-8">
      <div className="overflow-hidden rounded-lg shadow-lg">
        <div
          ref={eleRef}
          className="w-[375px] p-2"
          style={{
            backgroundImage: `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><path d="m0 0 4 4Zm4 0L0 4Z" stroke-width=".5" stroke="%23000"/></svg>')`,
          }}
        >
          <div className="overflow-hidden rounded border-[3px] border-solid border-main-800 bg-white p-3 text-black">
            {topicInfo ? (
              <>
                <div className="pb-2 text-2xl font-extrabold">V2EX</div>

                <h2 className="line-clamp-3 text-xl font-semibold">{topicInfo.title}</h2>

                <div className="mt-3 flex items-center px-1 text-main-500">
                  <Avatar
                    ref={avatarRef}
                    className="mr-2"
                    fallback={topicInfo.member.username.at(0)?.toUpperCase() || ''}
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
              </>
            ) : loading ? (
              <>
                <div className="p-3">
                  <div className="h-7 w-3/4 rounded bg-main-200" />
                  <hr className="my-3 bg-main-100" />
                  <div className="prose pt-1 prose-p:mb-2 prose-p:mt-0 prose-p:h-4 prose-p:rounded prose-p:bg-main-200">
                    <p className="w-full" />
                    <p className="w-full" />
                    <p className="w-3/5" />
                    <p className="w-0" />
                    <p className="w-full" />
                    <p className="w-full" />
                    <p className="w-full" />
                    <p className="w-3/4" />
                    <p className="w-0" />
                    <p className="w-full" />
                    <p className="w-full" />
                    <p className="w-1/2" />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <div className="px-4 py-6 text-center text-xl text-main-500">( ´◔ ‸◔`)</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sticky top-[50px] min-w-[300px]">
        <Flex direction="column" gap="4">
          {(requestError || notFoundError) && (
            <Callout.Root color="red">
              <Callout.Icon>
                <AlertCircleIcon size={16} />
              </Callout.Icon>
              <Callout.Text>
                {requestError ? (
                  <>
                    获取主题信息时发生错误，请
                    <Link
                      onClick={() => {
                        requestTopicInfo()
                      }}
                    >
                      重试
                    </Link>
                    。
                  </>
                ) : notFoundError ? (
                  '无法找到主题，可能是因为它已被删除或需要授权访问。'
                ) : null}
              </Callout.Text>
            </Callout.Root>
          )}

          <TextField.Root>
            <TextField.Slot>
              <SearchIcon height="16" width="16" />
            </TextField.Slot>
            <TextField.Input
              defaultValue={topicInfo?.url}
              disabled={!actionAvailable}
              placeholder="输入 V2EX 主题链接..."
            />
          </TextField.Root>

          <Flex>
            <Text size="2">
              <label>
                <Checkbox
                  checked={showSubtle}
                  mr="1"
                  variant="soft"
                  onCheckedChange={(checked) => {
                    setShowSubtle(checked ? true : false)
                  }}
                />
                显示附言
              </label>
            </Text>
          </Flex>

          <Flex gap="3">
            <Button
              color={copySuccess ? 'green' : copyFail ? 'red' : undefined}
              disabled={!actionAvailable}
              highContrast={doingCopy}
              variant="surface"
              onClick={() => {
                void handleCopy()
              }}
            >
              {copySuccess
                ? '复制成功'
                : copyFail
                ? '复制失败'
                : doingCopy
                ? '复制中...'
                : '复制为图片'}
            </Button>

            <Button
              disabled={!actionAvailable}
              highContrast={downloading}
              onClick={() => {
                void handleDownload()
              }}
            >
              {downloading ? '下载中...' : '保存为图片'}
            </Button>
          </Flex>
        </Flex>
      </div>
    </div>
  )
}
