'use client'

import { useEffect, useRef, useState } from 'react'
import { useEvent } from 'react-use-event-hook'

import { useParams, useRouter } from 'next/navigation'
import { Button, Callout, Checkbox, Flex, Link, SegmentedControl, Text } from '@radix-ui/themes'
import { AlertCircleIcon, CopyIcon, DownloadIcon } from 'lucide-react'

import type { RequestData as ImgRequestData } from '~/app/api/img-to-base64/schema'
import { ResponseCode } from '~/app/api/share/constants'
import type { RequestData as ShareRequestData, ResponseJson, TopicInfo } from '~/app/api/share/schema'
import { ShareCardThemeBasic } from '~/app/share/components/ShareCardThemeBasic'
import {
  defaultShareCardThemeId,
  getShareCardTheme,
  shareCardThemes,
  shareCardThemeStorageKey,
} from '~/app/share/themes'
import { isNumeric, trackEvent } from '~/utils'
import { mapWithConcurrency } from '~/utils/async'

import { ShareLoading } from './ShareLoading'
import { TopicLinkInput, type TopicLinkInputProps } from './TopicLinkInput'

/**
 * html-to-image 在 canvas 单边超过此值时会自动等比缩小，导致长主题导出发糊。
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas#maximum_canvas_size
 */
const CANVAS_DIMENSION_LIMIT = 16384

/** 分享图默认最高像素比，兼顾清晰度与超长内容的稳定性 */
const MAX_SHARE_IMAGE_PIXEL_RATIO = 2

/** 贴边余量，避免刚好触及部分浏览器的 canvas 上限 */
const CANVAS_SAFE_RATIO = 0.98

/** 正文图片转换的并发上限，避免一次性向图片代理发出过多请求 */
const CONTENT_IMAGE_CONCURRENCY = 4

const fetchTopicInfo = async (topicId: ShareRequestData['topicId']): Promise<ResponseJson> => {
  const res = await window.fetch('/api/share', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topicId }),
  })

  if (!res.ok) {
    throw new Error(`请求失败: ${res.status}`)
  }

  const data = await res.json() as ResponseJson

  return data
}

async function convertImageToBase64(url: string): Promise<string> {
  const requestData: ImgRequestData = { imgUrl: url }

  const res = await fetch('/api/img-to-base64', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData),
  })

  if (!res.ok) {
    throw new Error(`请求失败: ${res.status}`)
  }

  const { data } = await res.json() as { data: string }

  return data
}

/**
 * 按卡片实际尺寸计算安全 pixelRatio，避免触发 html-to-image 的自动缩小。
 * 超长主题允许降到 1 以下，以保证整图清晰度可控。
 */
function resolveShareImagePixelRatio(element: HTMLElement): number {
  const cssWidth = Math.max(element.offsetWidth, 1)
  const cssHeight = Math.max(element.offsetHeight, 1)
  const safeLimit = CANVAS_DIMENSION_LIMIT * CANVAS_SAFE_RATIO
  const maxSafeRatio = Math.min(safeLimit / cssWidth, safeLimit / cssHeight)
  const preferredRatio = Math.min(window.devicePixelRatio || 1, MAX_SHARE_IMAGE_PIXEL_RATIO)

  return Math.max(0.1, Math.min(preferredRatio, maxSafeRatio))
}

function getShareImageExportOptions(element: HTMLElement) {
  return {
    pixelRatio: resolveShareImagePixelRatio(element),
    skipFonts: true,
    style: {
      imageRendering: '-webkit-optimize-contrast',
    },
  } as const
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

  const [themeId, setThemeId] = useState<string>(defaultShareCardThemeId)

  useEffect(() => {
    const stored = window.localStorage.getItem(shareCardThemeStorageKey)

    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is client-only; reading it in an effect avoids hydration mismatch
      setThemeId(stored)
    }
  }, [])

  const handleThemeChange = (value: string) => {
    setThemeId(value)
    window.localStorage.setItem(shareCardThemeStorageKey, value)
  }

  const [downloading, setDownloading] = useState(false)
  /** 正文图片部分转换失败时提示用户，避免导出结果无声缺图 */
  const [exportWarning, setExportWarning] = useState(false)

  const canUseClipboardItem = typeof ClipboardItem !== 'undefined'
  const [doingCopy, setDoingCopy] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [copyFail, setCopyFail] = useState(false)

  const replaceAvatarSrc = async (avatarUrl: string) => {
    try {
      const avatarSrc = await convertImageToBase64(avatarUrl)
      avatarRef.current?.setAttribute('src', avatarSrc)
    }
    catch (err) {
      console.error('替换头像图片出错：', err)
    }
  }

  /**
   * 正文图片可能来自任意图床，单张转换失败不应影响整张卡片导出，
   * 因此逐个容错，只统计失败数量。
   */
  const replaceContentImageSrc = async () => {
    const container = eleRef.current

    if (!container) {
      return { failed: 0 }
    }

    const images = Array.from(container.querySelectorAll<HTMLImageElement>('.topic-content img'))
      .filter((ele) => ele.getAttribute('src')?.startsWith('http'))

    const results = await mapWithConcurrency(images, CONTENT_IMAGE_CONCURRENCY, async (ele) => {
      const src = ele.getAttribute('src')

      if (src) {
        ele.setAttribute('src', await convertImageToBase64(src))
      }
    })

    return { failed: results.filter((result) => result.status === 'rejected').length }
  }

  const handleSearchTopic: TopicLinkInputProps['onSearh'] = (val) => {
    let topicId: string | undefined

    if (val) {
      if (val.startsWith('http')) {
        topicId = val.split('/').pop()
      }
      else if (isNumeric(val)) {
        topicId = val
      }

      if (topicId && isNumeric(topicId)) {
        router.push(`/share/${topicId}`)
      }
    }
  }

  /** 导出依赖体积较大的 html-to-image，悬停或聚焦时预加载，减少点击后的等待 */
  const preloadExportLib = () => {
    void import('html-to-image')
  }

  const handleCopy = async () => {
    trackEvent('点击复制分享图片按钮')

    if (
      eleRef.current
      && topicInfo
      && canUseClipboardItem
      && !doingCopy
      && !copySuccess
      && !copyFail
    ) {
      setDoingCopy(true)
      setExportWarning(false)

      const triggerCopy = async () => {
        const item = new ClipboardItem({
          'image/png': (async () => {
            if (!eleRef.current) {
              throw new Error()
            }

            try {
              const { toBlob } = await import('html-to-image')

              const blobData = await toBlob(
                eleRef.current,
                getShareImageExportOptions(eleRef.current),
              )

              if (!blobData) {
                throw new Error()
              }

              return blobData
            }
            catch (err) {
              console.error('复制图片出错：', err)

              return Promise.reject(err instanceof Error ? err : new Error(String(err)))
            }
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
        await triggerCopy()
      }
      catch {
        try {
          const { failed } = await replaceContentImageSrc()
          setExportWarning(failed > 0)
          await triggerCopy()
        }
        catch (err) {
          console.error('复制图片出错：', err)

          setCopyFail(() => {
            setTimeout(() => {
              setCopyFail(false)
            }, 2000)

            return true
          })
        }
      }
      finally {
        setDoingCopy(false)
      }
    }
  }

  const handleDownload = async () => {
    trackEvent('点击下载分享图片按钮')

    if (eleRef.current && topicInfo && !downloading) {
      setDownloading(true)
      setExportWarning(false)

      const triggerDownload = async () => {
        if (eleRef.current) {
          const { toPng } = await import('html-to-image')

          const dataURL = await toPng(
            eleRef.current,
            getShareImageExportOptions(eleRef.current),
          )

          const trigger = document.createElement('a')
          trigger.href = dataURL
          trigger.download = `V2EX - ${topicInfo.title}.png`
          trigger.click()
        }
      }

      try {
        await replaceAvatarSrc(topicInfo.member.avatar)
        await triggerDownload()
      }
      catch {
        try {
          const { failed } = await replaceContentImageSrc()
          setExportWarning(failed > 0)
          await triggerDownload()
        }
        catch (err) {
          console.error('下载图片出错：', err)
        }
      }
      finally {
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
          }
          else {
            setNotFoundError(true)
          }
        }
        else {
          setNotFoundError(true)
        }
      }
      catch (err) {
        if (err instanceof Error) {
          console.error(`无法获取主题 ${topicId}: ${err.message}`)
        }

        setRequestError(true)
      }
      finally {
        setLoading(false)
      }
    }
  })

  useEffect(() => {
    void requestTopicInfo()
  }, [requestTopicInfo])

  const actionAvailable = !loading && !requestError && !notFoundError

  return (
    <div className="flex items-start gap-x-8">
      <div className="overflow-hidden shadow-lg">
        <div ref={eleRef} className="share-card w-93.75">
          {topicInfo
            ? (
                <ShareCardThemeBasic
                  avatarRef={avatarRef}
                  showQRCode={showQRCode}
                  showSubtle={showSubtle}
                  theme={getShareCardTheme(themeId)}
                  topicInfo={topicInfo}
                />
              )
            : loading
              ? (
                  <ShareLoading />
                )
              : (
                  <div>
                    <div className="px-4 py-6 text-center text-xl text-main-500">( ´◔ ‸◔`)</div>
                  </div>
                )}
        </div>
      </div>

      <div className="sticky top-12.5 min-w-75">
        <Flex direction="column" gap="4">
          {(requestError || notFoundError) && (
            <Callout.Root color="red">
              <Callout.Icon>
                <AlertCircleIcon size={16} />
              </Callout.Icon>
              <Callout.Text>
                {requestError
                  ? (
                      <>
                        获取主题信息时发生错误，
                        <Link
                          onClick={() => {
                            void requestTopicInfo()
                          }}
                        >
                          点击重试
                        </Link>
                        。
                      </>
                    )
                  : notFoundError
                    ? (
                        '无法找到主题，可能已被删除或需要授权访问。'
                      )
                    : null}
              </Callout.Text>
            </Callout.Root>
          )}

          {exportWarning && (
            <Callout.Root color="amber">
              <Callout.Icon>
                <AlertCircleIcon size={16} />
              </Callout.Icon>
              <Callout.Text>
                部分图片无法加载，导出的图片中可能缺少这些内容。
              </Callout.Text>
            </Callout.Root>
          )}

          <TopicLinkInput value={topicUrl} onChange={setTopicUrl} onSearh={handleSearchTopic} />

          <Flex direction="column" gap="1">
            <Text size="2" weight="medium">分享主题</Text>
            <SegmentedControl.Root
              size="2"
              value={themeId}
              onValueChange={handleThemeChange}
            >
              {shareCardThemes.map((theme) => (
                <SegmentedControl.Item key={theme.id} value={theme.id}>
                  {theme.name}
                </SegmentedControl.Item>
              ))}
            </SegmentedControl.Root>
          </Flex>

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

            {topicInfo
              && Array.isArray(topicInfo.supplements)
              && topicInfo.supplements.length > 0 && (
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
              onFocus={preloadExportLib}
              onMouseEnter={preloadExportLib}
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
              onFocus={preloadExportLib}
              onMouseEnter={preloadExportLib}
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
