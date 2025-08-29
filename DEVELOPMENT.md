# V2EX Polish 开发、调试与发布全流程

> 本文覆盖 Chrome / Firefox / Edge / Safari 扩展及油猴脚本从本地开发到发布的完整流程，附命令速查与发布前检查清单。若你久未回到项目，可直接从「命令速查」或「发布前检查清单」开始。

## 命令速查

```bash
# 安装依赖（首次或依赖变更后）
pnpm install

# 开发：Chrome 调试（自动生成清单 + 监听打包 + 启动 Chromium）
pnpm dev

# 开发：Firefox 调试（自动生成清单 + 监听打包 + 启动 Firefox）
pnpm dev:firefox

# 构建全部产物（扩展 + 压缩包 + 油猴脚本）
pnpm build

# 仅构建扩展脚本（tsup）
pnpm run build:ext

# 仅构建样式（sass -> extension/css）
pnpm run build:style

# 仅生成清单（Chrome 为主 / Firefox 为主）
pnpm run build:manifest
pnpm run build:manifest:chrome
pnpm run build:manifest:firefox

# 仅打包油猴脚本（写入合并样式并产出 dist/index.js）
pnpm run build:userscript

# 仅打包为 zip（基于 build-chrome / build-firefox）
pnpm run pack:chrome
pnpm run pack:firefox

# 清理构建产物
pnpm run clean

# 质量检查（TS/ES/Style/Prettier）
pnpm run lint
```

## 环境准备

- Node.js 18+（建议 LTS）
- pnpm 9（已通过 `packageManager` 锁定）
- Bun 1.1+（用于运行构建脚本与并行任务）
- web-ext（已在 devDependencies 中，命令由 npm scripts 调用）
- Sass（通过 `sass` 包调用，无需额外安装）

## 项目结构与构建流向

```text
V2EX_Polish_Pro/
├─ src/                        # TS 源码（contents/pages/background 等）
│  ├─ background/
│  ├─ contents/
│  ├─ pages/
│  ├─ styles/
│  ├─ user-scripts/
│  └─ ...
├─ extension/                  # 扩展打包前的落点（由构建写入）
│  ├─ css/                     # 由 sass 编译生成
│  ├─ scripts/                 # 由 tsup 编译生成
│  ├─ images/
│  ├─ pages/
│  ├─ manifest.json            # 由 scripts/build-manifest.ts 生成
│  └─ manifest-firefox.json    # 由 scripts/build-manifest.ts 生成
├─ build-chrome/               # 提交到 CWS/Edge 的源目录（由 scripts/build.ts 拷贝）
├─ build-firefox/              # 提交到 AMO 的源目录（由 scripts/build.ts 拷贝）
├─ dist/                       # 油猴脚本产物（dist/index.js）
├─ scripts/                    # 构建脚本
│  ├─ build.ts                 # 复制 extension → build-*
│  └─ build-manifest.ts        # 生成 manifest*.json
└─ website/                    # 网站与文档（含 Safari 使用说明）
```

构建主线：

- ts 构建：`tsup` 将 `src` 编译到 `extension/scripts`
- 样式构建：`sass` 将 `src/styles` 编译到 `extension/css`
- 清单生成：`scripts/build-manifest.ts` 产出 `extension/manifest*.json`
- 复制产出：`scripts/build.ts` 复制 `extension/` 到 `build-chrome` / `build-firefox`
- 压缩打包：`web-ext build` 生成 zip 到 `build-*`
- 用户脚本：`src/user-scripts/write-style.mjs` 合并样式到 `src/user-scripts/style.ts`，再由 `tsup` 产出 `dist/index.js`

## 开发与调试

### Chrome 调试

```bash
pnpm dev
```

- 自动生成清单并启动两路监听：
  - 样式监听：`sass src/styles -> extension/css`
  - 脚本监听：`tsup --watch -> extension/scripts`
- 自动启动 Chromium：
  - 使用 `web-ext run -t chromium --source-dir ./extension`
  - 自定义配置文件位于 `./chrome-profile`，会保留调试会话与安装状态
  - 默认起始页：`https://www.v2ex.com/`

#### 关于 `chrome-profile`（开发用浏览器配置）

- 作用：作为 Chromium 的独立用户数据目录，仅用于本项目调试。会持久化登录 Cookie、站点本地存储、扩展安装/启用状态、DevTools 设置等，避免每次调试都重新配置。
- 隔离性：与个人 Chrome 配置互不影响；仅 `web-ext run` 启动的调试浏览器使用该目录。
- 何时清理：出现页面行为异常、缓存污染、权限/安装状态错乱或希望回到「干净环境」时。
- 如何重置：关闭调试浏览器后删除目录并重新运行命令，会自动重建。

```bash
rm -rf ./chrome-profile
```

- 注意：该目录可安全删除，不建议手动修改内部文件。

调试建议：

- 如遇注入未生效，确认匹配域名是否覆盖当前页面，或在扩展管理页点击刷新/重新加载
- 如需查看后台日志，打开 `chrome://extensions` → Service Worker 日志

### Firefox 调试

```bash
pnpm dev:firefox
```

- 与 Chrome 类似，监听构建并通过 `web-ext run` 启动调试
- 使用 `./firefox-dev-profile` 作为开发配置文件，默认起始页 `https://www.v2ex.com/`
- Firefox 会自动使用 `extension/manifest.json` 或 `manifest-firefox.json`（由脚本生成）

注意：

- Firefox 不支持 `sidePanel` 权限，清单生成脚本会自动移除
- Firefox 背景脚本使用 `background.scripts` 而非 `service_worker`

### 油猴脚本开发与调试

生成与调试：

```bash
# 1) 合并 extension/css 为 userscript 样式源
pnpm run output:css
# 2) 打包 userscript 入口为 dist/index.js
pnpm run output:userscript
# 或一次性：
pnpm run build:userscript
```

使用方式：

- 本地调试（GreaseMonkey）：在元数据中添加 `@require file:///绝对路径/dist/index.js`（源码中也有注释说明）
- 发布后安装（Tampermonkey/GreasyFork）：直接指向发布页安装脚本

可选优化（确保单文件产出）：

- 若需要严格单文件，可考虑在脚本命令中添加 `--format iife --splitting false`，避免动态分包（根据需要调整 `package.json` 的 `output:userscript` 命令）

## 构建与打包

一键构建：

```bash
pnpm build
```

执行顺序（概览）：

- `build:manifest` `build:style` `build:ext` `build:userscript` 并行
- `scripts/build.ts` 将 `extension/` 复制到 `build-chrome` 与 `build-firefox`
  - 同时处理 Firefox 清单重命名为 `manifest.json`
- `web-ext build` 将 `build-*` 目录各自打包为 zip（位于相同目录内）

产物定位：

- Chrome 压缩包：`build-chrome/*.zip`
- Firefox 压缩包：`build-firefox/*.zip`
- 油猴脚本：`dist/index.js`

清理：

```bash
pnpm run clean
```

## 版本与清单管理

- 版本号在 `scripts/build-manifest.ts` 的 `generateManifest()` 中维护：

```ts
version: '2.2.14' // 发布前需手动更新
```

- 受支持域名列表在同文件的 `HOSTS` 中维护
- 生成命令：`pnpm run build:manifest[:chrome|:firefox]`
- 生成后 `extension/manifest*.json` 会被覆盖

发布前请务必更新版本号并重新生成清单与构建产物。

## 发布流程

### 发布到 Chrome Web Store

- 使用 `build-chrome` 目录下最新 zip 包
- 进入 Chrome 开发者控制台，创建或更新条目并上传 zip
- 填写版本更新说明，提交审核
- 审核通过后将按商店策略逐步推送

注意：

- 版本需高于商店中现有版本
- 如修改权限范围，需在「隐私」与「权限」说明中同步体现

### 发布到 Firefox Add-ons (AMO)

- 使用 `build-firefox` 目录下最新 zip 包
- 登录 AMO 开发者后台，创建或更新扩展，上传 zip 并等待签名与审核

注意：

- `sidePanel` 权限在 Firefox 版会自动移除
- 背景脚本采用 `background.scripts` 形式
- `browser_specific_settings.gecko.id` 由清单生成脚本写入，首次发布后请保持一致

### 发布到 Microsoft Edge Add-ons

- 使用 `build-chrome` 目录下的 zip（Edge 基于 Chromium，可直接复用）
- 登录 Microsoft Partner Center，创建或更新条目并上传 zip

注意：

- 如使用 Chrome 列表资源，可适度复用文案与截图，但建议进行 Edge 定制化说明

### 发布到 GreasyFork（油猴脚本）

- 使用 `dist/index.js`
- 新建脚本并粘贴产物内容，或从外部 URL 引入（如自建托管地址）

建议：

- 在脚本头部添加简要元数据与说明（名称、描述、匹配域名）
- 确认产物为单文件，避免运行时分包导致加载失败

## Safari 调试与发布

建议先阅读仓库内补充文档：`./website/src/content/docs/use-in-safari.md`

调试与转换（Xcode）：

- 准备可转换目录：优先使用 `build-chrome`（已包含编译后脚本与样式）
- 执行转换（macOS）：

```bash
# 生成 Xcode 工程（仅 macOS，需 Xcode）
xcrun safari-web-extension-converter ./build-chrome \
  --project-location ./safari \
  --macos-only \
  --no-open
```

- 打开 `./safari/*.xcodeproj`，设置签名、Bundle Identifier
- 选择运行目标为「My Mac」或目标设备，运行并在 Safari 中启用扩展

发布到 App Store（可选）：

- 使用 Xcode Archive → Distribute App 完成上传
- 在 App Store Connect 完成元数据与审核流程

注意：

- 若你已有更详细的 Safari 教程或截图，请在上述文档中维护；本节保持高层流程与命令

## 发布前检查清单

- 已更新版本号（`scripts/build-manifest.ts`）
- 已检查域名白名单 `HOSTS`
- 已完成冒烟测试：主页、主题页、发帖页、用户页、设置页、通知页、节点页
- 已确认 `extension/scripts` 与 `extension/css` 为最新（监听或构建）
- Chrome / Firefox 压缩包来源目录正确（不要混用）
- 油猴脚本为可用的单文件（必要时调整构建参数）
- 如增加权限，已在商店文案中说明用途

## 常见问题与排错

- 启动命令找不到 `bun`：请先安装 Bun 并确保 PATH 正确
- 注入未生效：检查当前页面是否匹配清单中的域名与路径；刷新扩展
- Firefox 启动报权限不支持：确认使用了 Firefox 清单（由脚本自动处理）
- 清单变更未生效：重新执行 `pnpm run build:manifest` 或直接 `pnpm build`
- 浏览器配置被污染：删除 `./chrome-profile` / `./firefox-dev-profile` 后重新启动

## 质量与规范

- 类型检查：`pnpm run lint:ts`
- ESLint：`pnpm run lint:es`
- Stylelint：`pnpm run lint:style`
- Prettier：`pnpm run lint:prettier`

建议在提交前执行 `pnpm run lint`，确保无报错后再打包发布。

---

若流程或命令发生变更，请同步更新本文档与 `package.json` 脚本，避免知识漂移。祝开发顺利！
