# 构建、打包与发布（Build & Release）

返回索引：[README](./README.md) · 如果尚未本地跑通，请先阅读 [getting-started.md](./getting-started.md)

## 一键构建

```bash
pnpm build
```

`pnpm build` 会代理到 `apps/extension/`，并完成：

1. 组装 `apps/extension/public/` 到 `apps/extension/dist/chrome` 与 `apps/extension/dist/firefox`
2. 编译 SCSS 到 `apps/extension/dist/<target>/css/`
3. 打包 TS 到 `apps/extension/dist/<target>/scripts/`
4. 生成 Chrome / Firefox manifest
5. 生成 userscript：`apps/extension/dist/userscript/index.min.js`
6. 打包 zip 到 `apps/extension/dist/packages/chrome/` 与 `apps/extension/dist/packages/firefox/`

如果只需要本地调试或手动加载扩展，可使用：

```bash
pnpm build:dist
```

它只生成 `dist/chrome`、`dist/firefox` 和 userscript，不生成 zip。

如果已经有未打包产物，只想重新归档发布包，可使用：

```bash
pnpm package:zip
```

## 产物位置

- Chrome 可加载目录：`apps/extension/dist/chrome/`
- Firefox 可加载目录：`apps/extension/dist/firefox/`
- Chrome zip：`apps/extension/dist/packages/chrome/*.zip`
- Firefox zip：`apps/extension/dist/packages/firefox/*.zip`
- userscript：`apps/extension/dist/userscript/index.min.js`

清理命令：

```bash
pnpm clean
```

它会清理 `apps/extension/dist/` 与生成的 `apps/extension/src/user-scripts/style.ts`。

## 版本与 manifest

- 扩展版本唯一来源：`apps/extension/package.json`
- 域名白名单来源：`apps/extension/shared/v2ex-domains.ts`
- manifest 生成脚本：`apps/extension/scripts/build-manifest.ts`

常用命令：

```bash
pnpm build:manifest
pnpm build:manifest:chrome
pnpm build:manifest:firefox
```

生成结果会直接写入：

- `apps/extension/dist/chrome/manifest.json`
- `apps/extension/dist/firefox/manifest.json`

发布前如果修改了版本号或域名白名单，需要重新生成 manifest 并重新构建。

## 发布流程

### Chrome Web Store

- 上传 `apps/extension/dist/packages/chrome/` 下最新 zip
- 确认版本号高于当前商店版本
- 如果权限有变化，同步更新商店说明

### Firefox Add-ons (AMO)

- 上传 `apps/extension/dist/packages/firefox/` 下最新 zip
- Firefox 版 manifest 已在生成阶段自动处理差异

### Microsoft Edge Add-ons

- 直接复用 `apps/extension/dist/packages/chrome/` 下的 zip

### GreasyFork

- 使用 `apps/extension/dist/userscript/index.min.js`

### Cloudflare Worker

```bash
pnpm worker:deploy
```

部署前确认：

- `apps/hot-topics/wrangler.toml` 中 D1 配置正确
- `apps/hot-topics/schema.sql` 已执行到目标数据库
- 扩展中的 Worker 地址与部署地址一致

## 发布前检查

- 已在 `apps/extension/package.json` 更新版本号
- 已运行 `pnpm verify:all`
- 已按 [monorepo-smoke-checklist.md](./monorepo-smoke-checklist.md) 完成 smoke test
- 已确认 Chrome / Firefox 可加载目录和 zip 都来自 `apps/extension/dist/`
- 如本次改动涉及 Worker，已完成 `pnpm worker:check` 和接口验证
- 如本次改动涉及文档或开发流程，已同步更新 README、CONTRIBUTING 和 `docs/`

若遇到问题，前往 [troubleshooting.md](./troubleshooting.md)。
