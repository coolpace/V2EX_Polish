'use client'

import { useEffect, useRef, useState } from 'react'
import useEvent from 'react-use-event-hook'

import { useParams, useRouter } from 'next/navigation'
import { Button, Callout, Checkbox, Flex, Link, Text } from '@radix-ui/themes'
import { toBlob, toPng } from 'html-to-image'
import { AlertCircleIcon, CopyIcon, DownloadIcon } from 'lucide-react'

import type { RequestData as ImgRequestData } from '~/app/api/img-to-base64/route'
import {
  type RequestData as ShareRequestData,
  ResponseCode,
  type ResponseJson,
  type TopicInfo,
} from '~/app/api/share/route'
import { ShareCardThemeBasic } from '~/app/share/components/ShareCardThemeBasic'
import { HOST, isNumeric, trackEvent } from '~/utils'

import { ShareLoading } from './ShareLoading'
import { TopicLinkInput, type TopicLinkInputProps } from './TopicLinkInput'

const isDev = process.env.NODE_ENV === 'development'

const fetchTopicInfo = async (topicId: ShareRequestData['topicId']): Promise<ResponseJson> => {
  // return {
  //   code: ResponseCode.Success,
  //   data: JSON.parse(process.env.NEXT_PUBLIC_DATA!) as TopicInfo,
  // }

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
  const router = useRouter()

  const eleRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLImageElement>(null)

  const [topicInfo, setTopicInfo] = useState<TopicInfo>()
  const [topicUrl, setTopicUrl] = useState<TopicInfo['url']>()
  const [loading, setLoading] = useState(true)

  const [requestError, setRequestError] = useState(false)
  const [notFoundError, setNotFoundError] = useState(false)

  const [showSubtle, setShowSubtle] = useState(true)
  const [showQRCode, setShowQRCode] = useState(true)

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

  const handleSearchTopic: TopicLinkInputProps['onSearh'] = (val) => {
    let topicId: string | undefined

    if (val) {
      if (val.startsWith('http')) {
        topicId = val.split('/').pop()
      } else if (isNumeric(val)) {
        topicId = val
      }

      if (topicId && isNumeric(topicId)) {
        router.push(`/share/${topicId}`)
      }
    }
  }

  const handleCopy = async () => {
    trackEvent('点击复制分享图片按钮')

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
    trackEvent('点击下载分享图片按钮')

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
        setLoading(true)
        setRequestError(false)
        setNotFoundError(false)

        if (isNumeric(topicId)) {
          const { code, data } = await fetchTopicInfo(topicId)

          if (code === ResponseCode.Success) {
            setTopicInfo(data)
            setTopicUrl(data.url)
          } else {
            setNotFoundError(true)
          }
        } else {
          setNotFoundError(true)
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error(`无法获取主题 ${topicId}: ${err.message}`)
        }
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
      <div className="overflow-hidden shadow-lg">
        <div ref={eleRef} className="w-[375px]">
          {topicInfo ? (
            <ShareCardThemeBasic
              avatarRef={avatarRef}
              showQRCode={showQRCode}
              showSubtle={showSubtle}
              topicInfo={topicInfo}
            />
          ) : loading ? (
            <ShareLoading />
          ) : (
            <div>
              <div className="px-4 py-6 text-center text-xl text-main-500">( ´◔ ‸◔`)</div>
            </div>
          )}
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
                  '无法找到主题，可能已被删除或需要授权访问。'
                ) : null}
              </Callout.Text>
            </Callout.Root>
          )}

          <TopicLinkInput value={topicUrl} onChange={setTopicUrl} onSearh={handleSearchTopic} />

          <Flex gap="3">
            <Text size="2">
              <label htmlFor="show-qrcode">
                <Checkbox
                  checked={showQRCode}
                  id="show-qrcode"
                  mr="1"
                  variant="surface"
                  onCheckedChange={(checked) => {
                    setShowQRCode(checked ? true : false)
                  }}
                />
                显示分享二维码
              </label>
            </Text>

            {topicInfo &&
              Array.isArray(topicInfo.supplements) &&
              topicInfo.supplements.length > 0 && (
                <Text size="2">
                  <label htmlFor="show-subtle">
                    <Checkbox
                      checked={showSubtle}
                      id="show-subtle"
                      mr="1"
                      variant="surface"
                      onCheckedChange={(checked) => {
                        setShowSubtle(checked ? true : false)
                      }}
                    />
                    显示附言
                  </label>
                </Text>
              )}
          </Flex>

          <Flex gap="3">
            <Button
              highContrast
              disabled={!actionAvailable || downloading}
              variant="surface"
              onClick={() => {
                void handleDownload()
              }}
            >
              <DownloadIcon size={14} />

              {downloading ? '下载中...' : '保存为图片'}
            </Button>

            <Button
              highContrast
              color={copySuccess ? 'green' : copyFail ? 'red' : undefined}
              disabled={!actionAvailable || doingCopy}
              variant="classic"
              onClick={() => {
                void handleCopy()
              }}
            >
              <CopyIcon size={14} />

              {copySuccess
                ? '复制成功'
                : copyFail
                  ? '复制失败'
                  : doingCopy
                    ? '复制中...'
                    : '复制为图片'}
            </Button>
          </Flex>
        </Flex>
      </div>
    </div>
  )
}
