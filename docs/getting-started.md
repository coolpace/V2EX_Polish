# 从零上手（Getting Started）

本页帮助你在本地完成环境准备与首次运行，并快速理解项目结构与构建流向。

## 环境要求

- Node.js 18+（建议 LTS）
- pnpm 9（已通过 `packageManager` 锁定）
- Bun 1.1+（用于运行构建脚本与并行任务）
- web-ext（已在 devDependencies 中，命令由 npm scripts 调用）
- Sass（通过 `sass` 包调用，无需额外安装）

## 安装与首次运行

```bash
# 安装依赖（首次或依赖变更后）
pnpm install

# 开发：Chrome 调试（自动生成清单 + 监听打包 + 启动 Chromium）
pnpm dev

# 开发：Firefox 调试（自动生成清单 + 监听打包 + 启动 Firefox）
pnpm dev:firefox
```

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
├─ chrome-profile/             # Chromium 调试用独立用户数据目录（web-ext run 使用）
├─ firefox-dev-profile/        # Firefox 调试用独立用户配置目录（web-ext run 使用）
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

## 常用命令速查

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

下一步：阅读 [build-and-release.md](./build-and-release.md) 进行构建与发布。
