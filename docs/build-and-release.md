# 构建、打包与发布（Build & Release）

返回索引：[README](./README.md) · 如果尚未本地跑通，请先阅读 [getting-started.md](./getting-started.md)

## 一键构建

```bash
pnpm build
```

`pnpm build` 会代理到 `apps/extension/`。构建前会先执行版本检查（见下文「构建时版本升级」），确认写回新版本号后才开始生成产物，随后完成：

1. 组装 `apps/extension/public/` 到 `apps/extension/dist/chrome` 与 `apps/extension/dist/firefox`
2. 编译 SCSS 到 `apps/extension/dist/<target>/css/`
3. 打包 TS 到 `apps/extension/dist/<target>/scripts/`
4. 生成 Chrome / Firefox manifest
5. 生成 userscript：`apps/extension/dist/userscript/index.min.js`
6. 打包带版本号的 zip 到 `apps/extension/dist/`（`v2ex-polish-chrome-<version>.zip` 与 `v2ex-polish-firefox-<version>.zip`）

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
- Chrome zip：`apps/extension/dist/v2ex-polish-chrome-<version>.zip`
- Firefox zip：`apps/extension/dist/v2ex-polish-firefox-<version>.zip`
- userscript：`apps/extension/dist/userscript/index.min.js`

> `<version>` 会自动读取 `apps/extension/package.json` 中的 `version`。例如当前版本为 `2.5.7` 时，Chrome 包名为 `v2ex-polish-chrome-2.5.7.zip`。

清理命令：

```bash
pnpm clean
```

它会清理 `apps/extension/dist/` 与生成的 `apps/extension/src/user-scripts/style.ts`。

## 构建时版本升级

扩展版本号只有 `apps/extension/package.json` 一处来源：manifest、userscript 的 `@version` 元数据与 zip 文件名都在构建时读取它。`pnpm build` 会在产物生成前自动处理版本，不需要再手动编辑 `package.json`。

检查脚本是 `apps/extension/scripts/check-version.ts`，纯逻辑在 `apps/extension/scripts/version-utils.ts`：它把工作区版本与 `git show HEAD:apps/extension/package.json` 中的版本做比较。

| 场景                               | 行为                                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------------------- |
| 工作区版本高于 HEAD                | 视为已手动升级，直接通过                                                                          |
| 无 Git 历史 / 非 Git 仓库          | 直接通过                                                                                          |
| 版本与 HEAD 相同或更低（本地终端） | 弹出菜单：Patch / Minor / Major / 自定义版本号，确认后写回 `package.json`；也可跳过检查或取消构建 |
| CI、管道等非交互环境               | 只打印提示并跳过，不改文件、不阻塞构建                                                            |

常用命令：

```bash
pnpm build                              # 交互式：未升级时弹菜单选择
V2EX_VERSION_BUMP=patch pnpm build      # 脚本化：自动升 patch（也可用 minor / major / 3.0.0）
V2EX_SKIP_VERSION_CHECK=1 pnpm build    # 完全跳过版本检查
pnpm version:check                      # 只检查 / 升级版本，不构建

# 根目录代理命令不透传 CLI 参数，需要传参时用 --dir
pnpm --dir apps/extension run check:version -- --bump minor
```

注意：

- `pnpm build:dist`、`pnpm dev` 与 `pnpm package:zip` 不触发版本检查，本地调试与重新归档仍使用当前版本。
- 发布 tag 必须是 `v<version>` 且与 `apps/extension/package.json` 一致（CI 会校验）。构建升级后记得把 `package.json` 一起提交再打 tag。

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

版本号由构建前检查自动写回；如果修改了域名白名单，需要重新生成 manifest 并重新构建。单独执行 `pnpm build:manifest` 只读取当前版本，不会触发版本检查。

## 发布流程

推送 `v*` 标签会触发 `.github/workflows/release.yml`：自动安装依赖、运行测试与校验、构建 Chrome/Firefox zip，并创建 GitHub Release。发布构建会设置 `EXTENSION_MINIFY=1`，本地需要压缩产物时可使用：

```bash
EXTENSION_MINIFY=1 pnpm build
```

### Chrome Web Store

- 上传 `apps/extension/dist/v2ex-polish-chrome-<version>.zip`
- 确认版本号高于当前商店版本
- 如果权限有变化，同步更新商店说明

### Firefox Add-ons (AMO)

- 上传 `apps/extension/dist/v2ex-polish-firefox-<version>.zip`
- Firefox 版 manifest 已在生成阶段自动处理差异

### Microsoft Edge Add-ons

- 直接复用 `apps/extension/dist/v2ex-polish-chrome-<version>.zip`

### GreasyFork

- 使用 `apps/extension/dist/userscript/index.min.js`
- 产物应包含完整的 `==UserScript==` 元数据、jQuery 和全部主题样式
- 发布前运行 `pnpm verify:extension`，其中会校验油猴产物并在无扩展 API 的 DOM 环境中执行 smoke test

### Cloudflare Worker

```bash
pnpm worker:deploy
```

部署前确认：

- `apps/hot-topics/wrangler.toml` 中 D1 配置正确
- `apps/hot-topics/migrations/` 中的迁移已应用（`pnpm --dir apps/hot-topics run db:migrate`）
- 扩展中的 Worker 地址与部署地址一致

## 发布前检查

- 已通过 `pnpm build` 完成版本升级，并把 `apps/extension/package.json` 与 `v<version>` tag 一起提交
- 已运行 `pnpm verify:all`
- 已按 [development.md](./development.md) 中「手动加载扩展」「热重载与监听」章节完成 smoke test
- 已确认 Chrome / Firefox 可加载目录和 zip 都来自 `apps/extension/dist/`
- 如本次改动涉及 Worker，已完成 `pnpm worker:check` 和接口验证
- 如本次改动涉及文档或开发流程，已同步更新 README、CONTRIBUTING 和 `docs/`

若遇到问题，前往 [troubleshooting.md](./troubleshooting.md)。
