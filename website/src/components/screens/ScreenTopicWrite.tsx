import { ArrowUpRightSquare, ChevronDownIcon, ChevronRightIcon, SendIcon } from 'lucide-react'

import { Box, Content, Header, Paragraph, RightSide, Wrapper } from '~/components/ui'

export function ScreenTopicWrite() {
  return (
    <Wrapper>
      <Header />

      <Content>
        <Box className="flex-1 px-3 text-sm">
          <div className="flex items-center px-2 py-4 text-xs">
            V2EX
            <ChevronRightIcon className="mx-1" size={13} />
            创作新主题
          </div>

          <div className="h-16 rounded-lg border-2 border-solid border-[var(--v2p-color-border)] bg-[var(--v2p-color-bg-input)] px-3 py-2 text-main-500">
            请输入主题标题，如果标题能够表达完整内容，则正文可以为空
          </div>

          <div className="flex items-center py-2">
            <div>
              <span className="whitespace-nowrap border-b-2 border-solid border-current px-px pb-px pt-1">
                正文
              </span>
              <span className="ml-3 whitespace-nowrap border-b-2 border-solid border-transparent px-px pb-px pt-1">
                预览
              </span>
            </div>

            <div className="ml-auto flex items-center">
              Syntax
              <div className="ml-2 rounded bg-background p-[4px] text-xs">
                <span className="inline-block rounded px-3 py-[3px]">V2EX 原生格式</span>
                <span className="ml-1 inline-block rounded bg-[var(--v2p-color-accent-100)] px-3 py-[3px]">
                  Markdown
                </span>
              </div>
            </div>
          </div>

          <div className="flex h-44 flex-col rounded-lg border-2 border-solid border-[var(--v2p-color-border)] bg-[var(--v2p-color-bg-input)]">
            <div className="mt-auto border-t border-dashed border-[var(--v2p-color-border)] px-[10px] py-[6px] text-xs text-main-500">
              选择、粘贴、拖放上传图片。
            </div>
          </div>

          <div className="flex items-center px-2 py-4 text-xs">
            <div className="flex items-center">
              主题节点
              <div className="ml-2 flex w-36 items-center justify-between rounded border border-solid border-main-300 bg-[var(--v2p-color-bg-input)] px-2 py-1">
                请选择一个节点
                <ChevronDownIcon size={13} />
              </div>
            </div>

            <div className="ml-auto flex items-center">
              V2EX 节点使用说明
              <ArrowUpRightSquare className="ml-1" size={14} />
            </div>
          </div>

          <div className="h-px bg-[var(--v2p-color-border)]"></div>

          <div className="px-2 py-4">
            <div className="inline-flex items-center rounded-md bg-main-100 px-3 py-1 font-semibold text-main-500 shadow-[0_1.8px_0_var(--v2p-color-main-200),0_1.8px_0_var(--v2p-color-main-100)] group-[.theme-dark]:bg-[#373e47]">
              <SendIcon className="mr-2" size={14} />
              发布主题
            </div>
          </div>
        </Box>

        <RightSide>
          <Box className="text-[13PX]">
            <div className="border-b border-solid border-[var(--v2p-color-border)] p-2 text-sm">
              发帖提示
            </div>

            <div className="px-2 py-3">
              <div className="mb-1">主题标题</div>
              <div className="flex-1">
                <Paragraph width="full" />
                <Paragraph width="full" />
                <Paragraph width="4/5" />
              </div>

              <div className="mb-1 mt-4">正文</div>
              <div className="flex-1">
                <Paragraph width="full" />
                <Paragraph width="full" />
                <Paragraph width="4/5" />
                <Paragraph width="1/2" />
              </div>

              <div className="mb-1 mt-4">选择节点</div>
              <div className="flex-1">
                <Paragraph width="full" />
                <Paragraph width="full" />
                <Paragraph width="1/2" />
              </div>

              <div className="mb-1 mt-4">尊重原创</div>
              <div className="flex-1">
                <Paragraph width="full" />
                <Paragraph width="3/4" />
              </div>
            </div>
          </Box>
        </RightSide>
      </Content>
    </Wrapper>
  )
}
