# 从零上手（Getting Started）

本页帮助你在本地完成环境准备与首次运行，并快速理解项目结构与构建流向。

当前仓库使用 `pnpm workspace` 管理两个 package：

- 根目录：浏览器扩展与油猴脚本主项目
- `hot-topics/`：Cloudflare Workers 子项目

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

# 开发：启动 Cloudflare Worker
pnpm worker:dev
```

## 项目结构与构建流向

```text
V2EX_Polish_Pro/
├─ pnpm-workspace.yaml          # workspace 包范围定义
├─ src/                        # TS 源码（contents/pages/background 等）
│  ├─ background/
│  ├─ contents/
│  ├─ pages/
│  ├─ styles/
│  ├─ user-scripts/
│  └─ ...
├─ hot-topics/                 # Cloudflare Workers 子项目
│  ├─ src/                     # Worker 源码
│  ├─ schema.sql               # D1 数据库建表脚本
│  ├─ package.json             # Worker 依赖与脚本
│  ├─ tsconfig.json            # Worker TypeScript 配置
│  └─ wrangler.toml            # Worker 部署配置
├─ extension/                  # 扩展打包前的落点（由构建写入）
│  ├─ css/                     # 由 sass 编译生成
│  ├─ scripts/                 # 由 tsup 编译生成
│  ├─ images/
│  ├─ pages/
│  ├─ manifest.json            # 由 scripts/build-manifest.ts 生成
│  └─ manifest-firefox.json    # 由 scripts/build-manifest.ts 生成
├─ build-chrome/               # 提交到 CWS/Edge 的源目录（由 scripts/build.ts 拷贝）
├─ build-firefox/              # 提交到 AMO 的源目录（由 scripts/build.ts 拷贝）
├─ dist/                       # 油猴脚本产物（dist/index.min.js）
├─ chrome-profile/             # Chromium 调试用独立用户数据目录（web-ext run 使用）
├─ firefox-dev-profile/        # Firefox 调试用独立用户配置目录（web-ext run 使用）
├─ scripts/                    # 构建脚本
│  ├─ build.ts                 # 复制 extension → build-*
│  └─ build-manifest.ts        # 生成 manifest*.json
└─ docs/                       # 开发文档
```

构建主线：

- ts 构建：`tsup` 将 `src` 编译到 `extension/scripts`
- 样式构建：`sass` 将 `src/styles` 编译到 `extension/css`
- 清单生成：`scripts/build-manifest.ts` 产出 `extension/manifest*.json`
- 复制产出：`scripts/build.ts` 复制 `extension/` 到 `build-chrome` / `build-firefox`
- 压缩打包：`web-ext build` 生成 zip 到 `build-*`
- 用户脚本：`src/user-scripts/write-style.mjs` 合并样式到 `src/user-scripts/style.ts`，再由 `tsup` 产出 `dist/index.min.js`
- Worker 接口：`hot-topics/` 使用 `wrangler` 部署到 Cloudflare Workers，并通过 D1 持久化热议主题数据

## 常用命令速查

```bash
# 安装依赖（首次或依赖变更后）
pnpm install

# 开发：Chrome 调试（自动生成清单 + 监听打包 + 启动 Chromium）
pnpm dev

# 开发：Firefox 调试（自动生成清单 + 监听打包 + 启动 Firefox）
pnpm dev:firefox

# 启动 Worker 本地开发
pnpm worker:dev

# 检查 Worker 类型
pnpm worker:check

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

# 部署 Worker
pnpm worker:deploy
```

## 关于 `hot-topics/` 的联调

`hot-topics/` 已经纳入 workspace，但扩展当前仍通过已部署的 Worker 地址访问热议主题接口，而不是自动连接本地 `wrangler dev` 地址。

这意味着：

- `pnpm worker:dev` 适合单独调试 Worker API 和 D1 逻辑
- 扩展端要验证真实热议主题功能，仍需要先部署 Worker，并将扩展里的接口地址改为实际可访问地址

详细说明见 [hot-topics.md](./hot-topics.md)。

下一步：阅读 [build-and-release.md](./build-and-release.md) 进行构建与发布。
