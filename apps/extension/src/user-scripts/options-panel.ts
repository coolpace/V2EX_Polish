import { StorageKey } from '../constants'
import { setFont, setTheme } from '../contents/helpers'
import type {
  FontType,
  Options,
  ThemeType,
  TopicFilterRule,
} from '../types'
import {
  applyRemoteSettings,
  escapeHTML,
  getStorage,
  getV2P_Settings,
  isValidSettings,
  prepareBackupData,
  setStorage,
  setV2P_Settings,
} from '../utils'

type SettingsSection = 'settings' | 'tags' | 'filter' | 'token' | 'backup'

const VALID_SECTIONS = new Set<SettingsSection>([
  'settings',
  'tags',
  'filter',
  'token',
  'backup',
])

function normalizeSection(section: string | undefined): SettingsSection {
  if (VALID_SECTIONS.has(section as SettingsSection)) {
    return section as SettingsSection
  }

  return 'settings'
}

function formValue(root: HTMLElement, name: string): string {
  return root.querySelector<HTMLInputElement | HTMLSelectElement>(
    `[name="${name}"]`,
  )?.value ?? ''
}

function checked(root: HTMLElement, name: string): boolean {
  return root.querySelector<HTMLInputElement>(`[name="${name}"]`)?.checked === true
}

function splitValues(value: string): string[] {
  return value
    .split(/[\n,，]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function cloneOptions(options: Options): Options {
  return JSON.parse(JSON.stringify(options)) as Options
}

async function saveGeneralOptions(
  panel: HTMLElement,
  onStatus: (message: string) => void,
): Promise<void> {
  const storage = await getStorage(false)
  const current = cloneOptions(storage[StorageKey.Options])
  const themeType = formValue(panel, 'theme.type') as ThemeType
  const fontType = formValue(panel, 'font.type') as FontType

  const next: Options = {
    ...current,
    topic: {
      openMode: formValue(panel, 'topic.openMode') as Options['topic']['openMode'],
    },
    autoCheckIn: {
      enabled: checked(panel, 'autoCheckIn.enabled'),
    },
    theme: {
      type: themeType,
      autoSwitch: checked(panel, 'theme.autoSwitch'),
      mode: formValue(panel, 'theme.mode') as Options['theme']['mode'],
    },
    reply: {
      preload: formValue(panel, 'reply.preload') as Options['reply']['preload'],
      layout: formValue(panel, 'reply.layout') as Options['reply']['layout'],
    },
    replyContent: {
      autoFold: checked(panel, 'replyContent.autoFold'),
      hideReplyTime: checked(panel, 'replyContent.hideReplyTime'),
      hideRefName: checked(panel, 'replyContent.hideRefName'),
      showImgInPage: checked(panel, 'replyContent.showImgInPage'),
    },
    nestedReply: {
      display: formValue(panel, 'nestedReply.display') as Options['nestedReply']['display'],
      multipleInsideOne: checked(panel, 'nestedReply.multipleInsideOne')
        ? 'nested'
        : 'off',
    },
    userTag: {
      display: formValue(panel, 'userTag.display') as Options['userTag']['display'],
    },
    contextMenu: {
      enabled: checked(panel, 'contextMenu.enabled'),
    },
    hideAccount: checked(panel, 'hideAccount'),
    font: {
      type: fontType,
    },
  }

  await setStorage(StorageKey.Options, next)
  setTheme(themeType)
  setFont(fontType)
  onStatus('设置已保存，刷新页面可应用全部布局变化')
}

async function renderTags(container: HTMLElement): Promise<void> {
  const storage = await getStorage(false)
  const tags = storage[StorageKey.MemberTag] ?? {}
  const entries = Object.entries(tags).filter(([, value]) => value.tags?.length)

  container.innerHTML = `
    <div class="v2p-settings-heading">
      <div>
        <h2>用户标签</h2>
        <p>标签保存在当前脚本管理器中，可用于主题页和用户页的快速识别。</p>
      </div>
      <button type="button" class="v2p-primary" data-action="add-tag">添加标签</button>
    </div>
    <div class="v2p-tag-list">
      ${
        entries.length > 0
          ? entries
              .map(
                ([memberName, value]) => `
          <div class="v2p-tag-row">
            <a href="/member/${encodeURIComponent(memberName)}" target="_blank">
              ${value.avatar ? `<img src="${escapeHTML(value.avatar)}" alt="">` : ''}
              <strong>${escapeHTML(memberName)}</strong>
            </a>
            <span>${escapeHTML(value.tags?.join('，') ?? '')}</span>
            <button type="button" data-action="remove-tag" data-member="${escapeHTML(memberName)}">删除</button>
          </div>
        `,
              )
              .join('')
          : '<div class="v2p-empty">尚未设置用户标签</div>'
      }
    </div>
  `

  container.querySelector('[data-action="add-tag"]')?.addEventListener('click', () => {
    void (async () => {
      const memberName = window.prompt('请输入 V2EX 用户名')

      if (!memberName?.trim()) {
        return
      }

      const value = window.prompt('请输入标签，多个标签用逗号分隔')

      if (!value?.trim()) {
        return
      }

      const nextTags = {
        ...tags,
        [memberName.trim()]: {
          ...tags[memberName.trim()],
          tags: splitValues(value),
        },
      }

      await setStorage(StorageKey.MemberTag, nextTags)
      await renderTags(container)
    })()
  })

  container.querySelectorAll<HTMLElement>('[data-action="remove-tag"]').forEach((button) => {
    button.addEventListener('click', () => {
      void (async () => {
        const memberName = button.dataset.member

        if (!memberName || !window.confirm(`删除 ${memberName} 的全部标签？`)) {
          return
        }

        const nextTags = { ...tags }
        delete nextTags[memberName]
        await setStorage(StorageKey.MemberTag, nextTags)
        await renderTags(container)
      })()
    })
  })
}

function downloadBackup(data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const date = new Date().toISOString().slice(0, 10)

  link.href = url
  link.download = `v2ex-polish-backup-${date}.json`
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

async function restoreBackup(file: File): Promise<void> {
  const text = await file.text()
  const data: unknown = JSON.parse(text)

  if (!isValidSettings(data)) {
    throw new Error('无效的 V2EX Polish 配置文件')
  }

  await applyRemoteSettings(data)
  window.__V2P_StorageCache = undefined
}

export async function mountOptionsPanel(params: {
  container: HTMLElement
  initialSection?: string
  close: () => void
}): Promise<void> {
  const { container, close } = params
  const storage = await getStorage(false)
  const options = storage[StorageKey.Options]
  const filter = options.topicFilter
  let activeSection = normalizeSection(params.initialSection)

  container.innerHTML = `
    <div class="v2p-settings-layout">
      <aside class="v2p-settings-nav">
        <div class="v2p-settings-brand">V2EX Polish</div>
        <button type="button" data-section="settings">控制选项</button>
        <button type="button" data-section="tags">用户标签</button>
        <button type="button" data-section="filter">主题屏蔽</button>
        <button type="button" data-section="token">API Token</button>
        <button type="button" data-section="backup">配置备份与恢复</button>
      </aside>
      <main class="v2p-settings-main">
        <header class="v2p-settings-topbar">
          <div>
            <strong>设置</strong>
            <span class="v2p-settings-status" role="status"></span>
          </div>
          <button type="button" class="v2p-icon-button" data-action="close" aria-label="关闭设置">×</button>
        </header>

        <section class="v2p-settings-section" data-panel="settings">
          <h2>控制选项</h2>
          <div class="v2p-form-grid">
            <label>颜色主题
              <select name="theme.type">
                <option value="light-default">浅色默认</option>
                <option value="dark-default">深色默认</option>
                <option value="dawn">Rose Pine Dawn</option>
                <option value="minimalist">极简</option>
              </select>
            </label>
            <label class="v2p-check"><input type="checkbox" name="theme.autoSwitch"> 自动跟随系统</label>
            <label>间距模式
              <select name="theme.mode">
                <option value="default">自然</option>
                <option value="compact">紧凑</option>
              </select>
            </label>
            <label>界面字体
              <select name="font.type">
                <option value="system">系统默认</option>
                <option value="vivoSans">Vivo Sans</option>
                <option value="notoSans">Noto Sans SC</option>
                <option value="lxgwWenKai">霞鹜文楷</option>
              </select>
            </label>
            <label>主题打开方式
              <select name="topic.openMode">
                <option value="default">当前标签页</option>
                <option value="newTab">新标签页</option>
                <option value="preview">页内预览</option>
              </select>
            </label>
            <label>回复预加载
              <select name="reply.preload">
                <option value="auto">自动</option>
                <option value="off">关闭</option>
              </select>
            </label>
            <label>回复布局
              <select name="reply.layout">
                <option value="vertical">垂直</option>
                <option value="horizontal">水平</option>
                <option value="auto">自动</option>
              </select>
            </label>
            <label>嵌套回复
              <select name="nestedReply.display">
                <option value="indent">缩进</option>
                <option value="align">对齐</option>
                <option value="off">关闭</option>
              </select>
            </label>
            <label>用户标签显示
              <select name="userTag.display">
                <option value="inline">行内</option>
                <option value="block">块级</option>
              </select>
            </label>
          </div>

          <div class="v2p-check-grid">
            <label class="v2p-check"><input type="checkbox" name="autoCheckIn.enabled"> 自动签到</label>
            <label class="v2p-check"><input type="checkbox" name="nestedReply.multipleInsideOne"> 多重 @ 保持嵌套</label>
            <label class="v2p-check"><input type="checkbox" name="replyContent.autoFold"> 自动折叠长回复</label>
            <label class="v2p-check"><input type="checkbox" name="replyContent.hideReplyTime"> 隐藏回复时间</label>
            <label class="v2p-check"><input type="checkbox" name="replyContent.hideRefName"> 隐藏回复中的 @ 用户名</label>
            <label class="v2p-check"><input type="checkbox" name="replyContent.showImgInPage"> 图片页内预览</label>
            <label class="v2p-check"><input type="checkbox" name="contextMenu.enabled"> 启用油猴菜单快捷操作</label>
            <label class="v2p-check"><input type="checkbox" name="hideAccount"> 隐藏账号信息</label>
          </div>

          <button type="button" class="v2p-primary" data-action="save-settings">保存设置</button>
        </section>

        <section class="v2p-settings-section" data-panel="tags"></section>

        <section class="v2p-settings-section" data-panel="filter">
          <h2>主题屏蔽</h2>
          <label class="v2p-check"><input type="checkbox" name="filter.enabled"> 启用主题屏蔽</label>
          <label>标题关键词（每行一个）
            <textarea name="filter.quickTitles" rows="4"></textarea>
          </label>
          <label>节点名称（每行一个）
            <textarea name="filter.quickNodes" rows="4"></textarea>
          </label>
          <label class="v2p-check"><input type="checkbox" name="filter.advancedEnabled"> 启用高级规则</label>
          <label>高级规则 JSON
            <textarea name="filter.advanced" rows="10" spellcheck="false"></textarea>
          </label>
          <p class="v2p-help">高级规则采用与扩展设置相同的 TopicFilterRule[] 结构；格式错误时不会保存。</p>
          <button type="button" class="v2p-primary" data-action="save-filter">保存主题屏蔽</button>
        </section>

        <section class="v2p-settings-section" data-panel="token">
          <h2>API Token</h2>
          <p class="v2p-help">PAT 只保存在当前脚本管理器的本地存储中，不会进入配置备份。</p>
          <label>个人访问令牌
            <input type="password" name="api.pat" autocomplete="off" placeholder="填写 V2EX PAT">
          </label>
          <button type="button" class="v2p-primary" data-action="save-token">保存令牌</button>
        </section>

        <section class="v2p-settings-section" data-panel="backup">
          <h2>配置备份与恢复</h2>
          <p class="v2p-help">配置、用户标签和稍后阅读可导出为 JSON。PAT 与签到状态不会写入备份。</p>
          <div class="v2p-action-row">
            <button type="button" data-action="export">导出 JSON</button>
            <button type="button" data-action="import">导入 JSON</button>
            <button type="button" data-action="backup-note">备份到 V2EX 记事本</button>
            <button type="button" data-action="restore-note">从记事本恢复</button>
          </div>
          <input type="file" accept=".json,application/json" name="backup-file" hidden>
        </section>
      </main>
    </div>
  `

  const status = container.querySelector<HTMLElement>('.v2p-settings-status')

  const setStatus = (message: string) => {
    if (status) {
      status.textContent = message
    }
  }

  const setValue = <T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
    name: string,
    value: string | boolean,
  ) => {
    const input = container.querySelector<T>(`[name="${name}"]`)

    if (!input) {
      return
    }

    if (input instanceof HTMLInputElement && input.type === 'checkbox') {
      input.checked = Boolean(value)
    }
    else {
      input.value = String(value ?? '')
    }
  }

  setValue<HTMLSelectElement>('theme.type', options.theme.type ?? 'light-default')
  setValue<HTMLInputElement>('theme.autoSwitch', options.theme.autoSwitch)
  setValue<HTMLSelectElement>('theme.mode', options.theme.mode ?? 'default')
  setValue<HTMLSelectElement>('font.type', options.font?.type ?? 'system')
  setValue<HTMLSelectElement>('topic.openMode', options.topic.openMode)
  setValue<HTMLInputElement>('autoCheckIn.enabled', options.autoCheckIn.enabled)
  setValue<HTMLSelectElement>('reply.preload', options.reply.preload ?? 'auto')
  setValue<HTMLSelectElement>('reply.layout', options.reply.layout ?? 'vertical')
  setValue<HTMLInputElement>('replyContent.autoFold', options.replyContent.autoFold !== false)
  setValue<HTMLInputElement>('replyContent.hideReplyTime', options.replyContent.hideReplyTime !== false)
  setValue<HTMLInputElement>('replyContent.hideRefName', options.replyContent.hideRefName !== false)
  setValue<HTMLInputElement>('replyContent.showImgInPage', options.replyContent.showImgInPage !== false)
  setValue<HTMLSelectElement>('nestedReply.display', options.nestedReply.display)
  setValue<HTMLInputElement>(
    'nestedReply.multipleInsideOne',
    options.nestedReply.multipleInsideOne !== 'off',
  )
  setValue<HTMLSelectElement>('userTag.display', options.userTag.display)
  setValue<HTMLInputElement>('contextMenu.enabled', options.contextMenu?.enabled !== false)
  setValue<HTMLInputElement>('hideAccount', options.hideAccount === true)
  setValue<HTMLInputElement>('filter.enabled', filter?.enabled === true)
  setValue<HTMLTextAreaElement>(
    'filter.quickTitles',
    (filter?.quick.titleKeywords ?? []).join('\n'),
  )
  setValue<HTMLTextAreaElement>(
    'filter.quickNodes',
    (filter?.quick.nodes ?? []).join('\n'),
  )
  setValue<HTMLInputElement>('filter.advancedEnabled', filter?.advanced.enabled === true)
  setValue<HTMLTextAreaElement>(
    'filter.advanced',
    JSON.stringify(filter?.advanced.rules ?? [], null, 2),
  )
  setValue<HTMLInputElement>('api.pat', storage[StorageKey.API]?.pat ?? '')

  const selectSection = (section: SettingsSection) => {
    activeSection = section
    container.querySelectorAll<HTMLElement>('[data-section]').forEach((button) => {
      button.classList.toggle('active', button.dataset.section === section)
    })
    container.querySelectorAll<HTMLElement>('[data-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.panel !== section
    })
  }

  selectSection(activeSection)

  container.querySelectorAll<HTMLElement>('[data-section]').forEach((button) => {
    button.addEventListener('click', () => {
      selectSection(normalizeSection(button.dataset.section))
    })
  })

  container.querySelector('[data-action="close"]')?.addEventListener('click', close)
  container.querySelector('[data-action="save-settings"]')?.addEventListener('click', () => {
    void saveGeneralOptions(container, setStatus).catch((error: unknown) => {
      setStatus(error instanceof Error ? error.message : '保存设置失败')
    })
  })

  container.querySelector('[data-action="save-filter"]')?.addEventListener('click', () => {
    void (async () => {
      try {
        const rules = JSON.parse(
          formValue(container, 'filter.advanced'),
        ) as TopicFilterRule[]

        if (!Array.isArray(rules)) {
          throw new Error('高级规则必须是数组')
        }

        const storageNow = await getStorage(false)
        const next = cloneOptions(storageNow[StorageKey.Options])

        next.topicFilter = {
          version: 1,
          enabled: checked(container, 'filter.enabled'),
          quick: {
            titleKeywords: splitValues(formValue(container, 'filter.quickTitles')),
            nodes: splitValues(formValue(container, 'filter.quickNodes')),
          },
          advanced: {
            enabled: checked(container, 'filter.advancedEnabled'),
            rules,
          },
        }

        await setStorage(StorageKey.Options, next)
        setStatus('主题屏蔽设置已保存')
      }
      catch (error) {
        setStatus(error instanceof Error ? error.message : '主题屏蔽设置格式错误')
      }
    })()
  })

  container.querySelector('[data-action="save-token"]')?.addEventListener('click', () => {
    void (async () => {
      try {
        const current = await getStorage(false)
        await setStorage(StorageKey.API, {
          ...current[StorageKey.API],
          pat: formValue(container, 'api.pat').trim() || undefined,
        })
        setStatus('API Token 已保存')
      }
      catch (error) {
        setStatus(error instanceof Error ? error.message : 'API Token 保存失败')
      }
    })()
  })

  container.querySelector('[data-action="export"]')?.addEventListener('click', () => {
    void (async () => {
      const current = await getStorage(false)
      downloadBackup(prepareBackupData(current))
      setStatus('配置已导出')
    })()
  })

  const fileInput = container.querySelector<HTMLInputElement>('[name="backup-file"]')

  container.querySelector('[data-action="import"]')?.addEventListener('click', () => {
    fileInput?.click()
  })

  fileInput?.addEventListener('change', () => {
    void (async () => {
      const file = fileInput.files?.[0]

      if (!file || !window.confirm('导入将覆盖当前配置、用户标签和稍后阅读，是否继续？')) {
        return
      }

      try {
        await restoreBackup(file)
        setStatus('配置已导入，刷新页面后全部生效')
      }
      catch (error) {
        setStatus(error instanceof Error ? error.message : '配置导入失败')
      }
      finally {
        fileInput.value = ''
      }
    })()
  })

  container.querySelector('[data-action="backup-note"]')?.addEventListener('click', () => {
    void (async () => {
      try {
        setStatus('正在备份到 V2EX 记事本...')
        await setV2P_Settings(await getStorage(false))
        setStatus('备份到 V2EX 记事本成功')
      }
      catch (error) {
        setStatus(error instanceof Error ? error.message : '备份失败')
      }
    })()
  })

  container.querySelector('[data-action="restore-note"]')?.addEventListener('click', () => {
    void (async () => {
      try {
        const remote = await getV2P_Settings()

        if (!remote || !window.confirm('从 V2EX 记事本恢复会合并远端配置，是否继续？')) {
          return
        }

        await applyRemoteSettings(remote.config)
        window.__V2P_StorageCache = undefined
        setStatus('已从 V2EX 记事本恢复配置')
      }
      catch (error) {
        setStatus(error instanceof Error ? error.message : '恢复失败')
      }
    })()
  })

  const tagsContainer = container.querySelector<HTMLElement>('[data-panel="tags"]')

  if (tagsContainer) {
    await renderTags(tagsContainer)
  }
}
