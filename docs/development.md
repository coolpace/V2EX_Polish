# 开发与调试（Development）

返回索引：[README](./README.md) · 如果尚未本地跑通，请先阅读 [getting-started.md](./getting-started.md)

## Workspace 结构

当前仓库有三个 app：

- `apps/extension/`：浏览器扩展与 userscript
- `apps/website/`：Next.js 官网
- `apps/hot-topics/`：Cloudflare Workers 热议主题接口

根 `package.json` 只做代理命令，所以日常开发统一在仓库根目录执行即可。

## 扩展开发模式

```bash
# Chrome / Chromium
pnpm dev

# Firefox
pnpm dev:firefox
```

两个命令都会先生成 extension dist，再启动 watch 和 `web-ext run`。

当前输出目录：

- Chrome：`apps/extension/dist/chrome/`
- Firefox：`apps/extension/dist/firefox/`
- userscript：`apps/extension/dist/userscript/`

## 浏览器调试 Profile

开发模式使用独立 profile，与日常浏览器隔离：

| 浏览器            | 目录                    | 用途                 |
| ----------------- | ----------------------- | -------------------- |
| Chrome / Chromium | `chrome-dist-profile/`  | 扩展调试专用用户数据 |
| Firefox           | `firefox-dist-profile/` | 扩展调试专用配置     |

如果 profile 被污染，可以删除后重建：

```bash
rm -rf chrome-dist-profile
rm -rf firefox-dist-profile

pnpm dev
```

## 手动加载扩展

如果不想通过 `web-ext` 启动浏览器，可以先构建未打包目录，再手动加载：

```bash
pnpm build:dist
```

构建完成后：

- Chrome / Edge / Arc：加载 `apps/extension/dist/chrome/`
- Firefox：加载 `apps/extension/dist/firefox/manifest.json`

## 热重载与监听

开发模式启动后，以下变更会自动触发重新构建：

| 文件类型   | 监听范围                              | 输出目录                                |
| ---------- | ------------------------------------- | --------------------------------------- |
| TypeScript | `apps/extension/src/**/*.ts`          | `apps/extension/dist/<target>/scripts/` |
| SCSS       | `apps/extension/src/styles/**/*.scss` | `apps/extension/dist/<target>/css/`     |

通常的生效流程是：

```text
代码变更 -> 自动重构建 -> 刷新扩展 -> 刷新页面
```

以下场景需要手动重新执行命令或重启开发进程：

- 修改 `apps/extension/package.json` 中的版本号
- 修改 `apps/extension/shared/v2ex-domains.ts`
- 新增或删除 tsup 入口
- 修改 `apps/extension/tsup.config.ts`
- 修改 `apps/extension/public/` 中的静态资源

## 单独构建命令

```bash
pnpm build:ext
pnpm build:style
pnpm build:dist
pnpm build:manifest
pnpm build:manifest:chrome
pnpm build:manifest:firefox
pnpm build:userscript
pnpm package:zip
pnpm watch
pnpm watch:ext
pnpm watch:style
```

这些根命令都会代理到 `apps/extension/`。

## 官网开发

```bash
pnpm website:dev
pnpm website:build
pnpm website:start
```

官网源码位于 `apps/website/src/`。

## Worker 调试

```bash
pnpm worker:dev
pnpm worker:check
pnpm worker:deploy
```

`apps/hot-topics/` 是独立子项目，当前扩展仍通过已部署的 Worker 地址访问热议主题接口，不会自动转发到本地 `wrangler dev`。

如果你要联调热议主题功能，请确认：

- `apps/hot-topics/wrangler.toml` 中 D1 配置已替换为真实值
- Worker 已部署到可访问地址
- 扩展中的接口地址配置与部署地址一致

下一步：阅读 [build-and-release.md](./build-and-release.md)。
