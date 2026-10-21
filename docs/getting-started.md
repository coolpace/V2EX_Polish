# 从零上手（Getting Started）

本页帮助你在本地完成环境准备、首次运行，并理解 monorepo 最终结构。

## 环境要求

- Node.js 20+
- pnpm 9
- Bun 1.3+
- 本机可用的 Chrome / Chromium 与 Firefox

## 安装与首次运行

```bash
pnpm install

# 扩展开发
pnpm dev

# Firefox 扩展开发
pnpm dev:firefox

# 官网开发
pnpm website:dev

# Worker 开发
pnpm worker:dev
```

## 仓库结构

```text
V2EX_Polish_Pro/
├─ apps/
│  ├─ extension/
│  │  ├─ package.json
│  │  ├─ public/                 # 静态资源
│  │  ├─ scripts/                # 构建脚本
│  │  ├─ shared/                 # runtime / tooling 共享常量
│  │  ├─ src/                    # 扩展源码
│  │  ├─ dist/
│  │  │  ├─ chrome/              # Chrome 可加载目录
│  │  │  ├─ firefox/             # Firefox 可加载目录
│  │  │  ├─ userscript/          # userscript 产物
│  │  │  └─ packages/            # zip 包
│  │  ├─ tsconfig.runtime.json
│  │  ├─ tsconfig.tooling.json
│  │  └─ tsdown.config.ts
│  ├─ website/
│  └─ hot-topics/
├─ docs/
├─ scripts/
│  └─ verify-manifest-snapshot.mjs
├─ chrome-dist-profile/
├─ firefox-dist-profile/
└─ package.json                  # workspace 代理命令
```

## 构建流向

扩展构建链路已经完全切到 `apps/extension/`：

- `apps/extension/public/` 提供静态资源
- `sass` 将 `apps/extension/src/styles/` 编译到 `apps/extension/dist/<target>/css/`
- `tsdown` 将 `apps/extension/src/` 打包到 `apps/extension/dist/<target>/scripts/`
- `apps/extension/scripts/build-manifest.ts` 生成 `apps/extension/dist/<target>/manifest.json`
- `apps/extension/scripts/build-userscript-style.mjs` 生成 `apps/extension/src/user-scripts/style.ts`
- `tsdown.userscript.config.ts` 生成 `apps/extension/dist/userscript/index.min.js`
- `pnpm build:dist` 负责生成可加载的未打包扩展目录
- `pnpm package:zip` 会调用 `web-ext build`，将 Chrome / Firefox 产物打包到 `apps/extension/dist/packages/<target>/`

运行时路径仍保持稳定：

- `scripts/jquery.min.js`
- `scripts/polyfill.js`
- `css/*`
- `pages/*.html`

## 常用命令

```bash
pnpm install
pnpm dev
pnpm dev:firefox
pnpm build
pnpm build:dist
pnpm package:zip
pnpm build:manifest
pnpm build:userscript
pnpm verify:all
pnpm website:build
pnpm worker:check
pnpm worker:deploy
```

根脚本都只是代理；如果你更习惯按 app 工作，也可以直接进入 `apps/extension/`、`apps/website/` 或 `apps/hot-topics/` 执行本地脚本。

## 手动加载扩展

```bash
pnpm build:dist
```

然后：

- Chrome / Edge / Arc：加载 `apps/extension/dist/chrome/`
- Firefox：加载 `apps/extension/dist/firefox/manifest.json`

## 验收入口

每次完成较大改动后，先运行：

```bash
pnpm verify:all
```

再按 [monorepo-smoke-checklist.md](./monorepo-smoke-checklist.md) 做 smoke test。

下一步：阅读 [development.md](./development.md)。
