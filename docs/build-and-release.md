# 构建、打包与发布（Build & Release）

返回索引：[README](./README.md) · 如果尚未本地跑通，请先阅读 [getting-started.md](./getting-started.md)

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

说明：

- `pnpm build` 只负责浏览器扩展与油猴脚本产物
- `hot-topics/` Worker 的部署由独立命令 `pnpm worker:deploy` 处理

产物定位：

- Chrome 压缩包：`build-chrome/*.zip`
- Firefox 压缩包：`build-firefox/*.zip`
- 油猴脚本：`dist/index.min.js`

清理：

```bash
pnpm run clean
```

## 版本与清单管理

- 版本号来源：读取 `package.json` 的 `version` 字段，无需在 `manifest` 或脚本中手动维护
- 受支持域名列表：在 `scripts/build-manifest.ts` 的 `HOSTS` 中维护
- 生成命令：`pnpm run build:manifest[:chrome|:firefox]`
- 生成后 `extension/manifest*.json` 会被覆盖

发布前请在 `package.json` 中更新版本号，并重新生成清单与构建产物。

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

### 发布到 GreasyFork（油猴脚本）

- 使用 `dist/index.js`
- 新建脚本并粘贴产物内容，或从外部 URL 引入（如自建托管地址）

建议：

- 在脚本头部添加简要元数据与说明（名称、描述、匹配域名）
- 确认产物为单文件，避免运行时分包导致加载失败

> Safari 的调试与转换、上架建议参见仓库文档：`website/src/content/docs/use-in-safari.md`

### 发布 Cloudflare Worker（`hot-topics/`）

先决条件：

- 已在 `hot-topics/wrangler.toml` 中配置真实的 D1 `database_id`
- 已将 `hot-topics/schema.sql` 初始化到目标数据库
- 已确认扩展端使用的是部署后可访问的 Worker 地址

部署命令：

```bash
pnpm worker:deploy
```

建议：

- 先运行 `pnpm worker:check` 确认 Worker TypeScript 无误
- 部署后手动验证 `/hot-topics` 接口返回格式是否与扩展侧预期一致
- 如果更换了 Worker 域名，记得同步更新扩展中的热议主题接口地址

## 发布前检查清单

- 已更新版本号（`package.json`）
- 已检查域名白名单 `HOSTS`
- 已完成冒烟测试：主页、主题页、发帖页、用户页、设置页、通知页、节点页
- 已确认 `extension/scripts` 与 `extension/css` 为最新（监听或构建）
- Chrome / Firefox 压缩包来源目录正确（不要混用）
- 油猴脚本为可用的单文件（必要时调整构建参数）
- 如增加权限，已在商店文案中说明用途
- 如本次改动涉及热议主题功能，已完成 Worker 部署与接口联调验证

若遇到问题，前往 [troubleshooting.md](./troubleshooting.md)。
