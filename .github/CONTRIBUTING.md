# 贡献指南

感谢你为 V2EX Polish 贡献代码。

## 仓库结构

本仓库已经完成 monorepo 重构，根目录只保留 workspace 配置和代理脚本，实际 app 都在 `apps/` 下：

```text
apps/
├─ extension/     # 浏览器扩展与 userscript
│  ├─ src/        # runtime 源码
│  ├─ public/     # 静态资源
│  ├─ scripts/    # tooling 脚本
│  └─ dist/       # Chrome / Firefox / userscript 产物
├─ website/       # Next.js 官网
└─ hot-topics/    # Cloudflare Workers 热议主题接口
```

关键约定：

- 扩展版本唯一来源是 `apps/extension/package.json`
- 扩展 TypeScript 已拆成 `tsconfig.runtime.json` 和 `tsconfig.tooling.json`
- 不要直接修改 `apps/extension/dist/**`
- 不要直接修改 `apps/extension/src/user-scripts/style.ts`，它由构建脚本生成

## 快速开始

```bash
pnpm install

# Chrome 开发
pnpm dev

# Firefox 开发
pnpm dev:firefox

# 官网开发
pnpm website:dev

# Worker 开发
pnpm worker:dev
```

如果只想在某个 app 内工作，也可以直接进入对应目录执行同名脚本；根脚本只是代理。

## 扩展开发

- 运行时代码放在 `apps/extension/src/`
- 静态资源放在 `apps/extension/public/`
- 构建脚本放在 `apps/extension/scripts/`
- 域名白名单维护在 `apps/extension/shared/v2ex-domains.ts`
- Chrome 可加载目录是 `apps/extension/dist/chrome/`
- Firefox 可加载目录是 `apps/extension/dist/firefox/`
- userscript 产物是 `apps/extension/dist/userscript/index.min.js`

手动加载扩展时：

- Chrome / Edge / Arc：加载 `apps/extension/dist/chrome/`
- Firefox：加载 `apps/extension/dist/firefox/manifest.json`

本地开发 profile 目录为：

- `chrome-dist-profile/`
- `firefox-dist-profile/`

## 常用命令

- `pnpm verify:all`：完整验收入口，包含 extension typecheck、website typecheck、worker check、manifest 快照、userscript 构建和扩展构建
- `pnpm build`：生成 Chrome / Firefox zip 与 userscript
- `pnpm build:all`：生成未打包的 extension dist 与 userscript
- `pnpm build:manifest`：生成 Chrome 与 Firefox manifest
- `pnpm build:userscript`：只构建 userscript
- `pnpm clean`：清理 `apps/extension/dist` 与生成的 userscript 样式文件
- `pnpm website:build`：构建官网
- `pnpm worker:check`：检查 Worker
- `pnpm worker:deploy`：部署 Worker

## 提交前检查

提交 PR 前，至少完成以下验证：

1. 运行 `pnpm verify:all`
2. 按 [docs/monorepo-smoke-checklist.md](../docs/monorepo-smoke-checklist.md) 做 smoke test
3. 如改动影响扩展行为，在 Chrome 和 Firefox 都验证一次
4. 如改动影响 Worker 或官网，同步验证对应 app
5. 如改动影响开发流程、目录结构或发布方式，同步更新 README 与 `docs/`

## 改动边界建议

- 扩展功能改动优先落在 `apps/extension/src/contents/`、`apps/extension/src/pages/`、`apps/extension/src/background/`
- 通用 UI 组件放在 `apps/extension/src/components/`
- 样式改动集中在 `apps/extension/src/styles/`
- Worker 改动只放在 `apps/hot-topics/`
- 官网改动只放在 `apps/website/`

## 常见问题

- `pnpm dev` 无法启动浏览器：检查本机 Chrome / Chromium 是否可用，必要时删除 `chrome-dist-profile/` 后重试
- `pnpm dev:firefox` 无法启动：检查本机 Firefox 是否可用，必要时删除 `firefox-dist-profile/` 后重试
- manifest 变更未生效：重新执行 `pnpm build:manifest`
- Worker 本地可用但扩展拿不到热议主题：确认扩展配置的是已部署的 Worker 地址，而不是本地 `wrangler dev` 地址

## 提交规范

- 推荐使用 Conventional Commits
- 一个 commit 只做一件事
- 不要在 PR 中混入与任务无关的格式化或目录清理

如有疑问，优先查看 [docs/README.md](../docs/README.md)。
