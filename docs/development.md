# 开发与调试（Development）

返回索引：[README](./README.md) · 如果尚未本地跑通，请先阅读 [getting-started.md](./getting-started.md)

## 开发模式切换

项目当前是一个 `pnpm workspace` 仓库，包含两个开发单元：

- 根目录：浏览器扩展主项目
- `hot-topics/`：Cloudflare Workers 子项目

扩展主项目支持同时为 Chrome 和 Firefox 开发，通过不同的命令启动对应的开发环境：

```bash
# Chrome 开发模式（默认）
pnpm dev

# Firefox 开发模式
pnpm dev:firefox
```

两个命令的执行流程相同：

1. 构建所有资源（样式、脚本、清单）
2. 启动文件监听（TS + SCSS）
3. 自动打开目标浏览器并加载扩展

> 注意：同一时间只能运行一个开发模式。切换浏览器前需先停止当前进程（`Ctrl + C`）。

## Workspace 约定

统一在仓库根目录执行依赖安装和脚本：

```bash
# 安装整个 workspace 的依赖
pnpm install

# 直接调试 Worker
pnpm worker:dev

# 仅检查 Worker 类型
pnpm worker:check
```

如果需要直接使用 `pnpm --filter`，当前 Worker package 名称为 `v2ex-hot-topics`。

## 浏览器调试配置

开发模式使用独立的浏览器配置目录，与日常使用的浏览器完全隔离：

| 浏览器  | 配置目录               | 用途                      |
| ------- | ---------------------- | ------------------------- |
| Chrome  | `chrome-profile/`      | Chromium 调试专用用户数据 |
| Firefox | `firefox-dev-profile/` | Firefox 调试专用配置      |

这些目录由 `web-ext` 自动创建和管理，具有以下特点：

- **首次运行自动创建**：无需手动配置
- **配置持久化**：`--keep-profile-changes` 保留登录状态和扩展设置
- **完全隔离**：不影响日常浏览器配置

### 重置配置

如果调试配置被污染或需要重置：

```bash
# 删除 Chrome 调试配置
rm -rf chrome-profile

# 删除 Firefox 调试配置
rm -rf firefox-dev-profile

# 重新启动开发模式会自动重建
pnpm dev
```

## 手动加载扩展

除了使用 `pnpm dev` 自动启动浏览器外，你也可以手动将扩展加载到浏览器中进行调试。

### 适用场景

- 希望在日常使用的浏览器中测试，而非 web-ext 创建的隔离环境
- web-ext 工具因环境问题无法正常工作
- 需要同时加载多个扩展版本进行对比测试

### 前置步骤

手动加载前，需要先构建扩展文件：

```bash
# 构建所有资源（样式、脚本、清单）
pnpm run build:all
```

构建完成后，`extension/` 目录将包含完整的扩展文件。

### Chrome 浏览器

1. 在地址栏输入 `chrome://extensions/` 并访问
2. 开启页面右上角的 **开发者模式** 开关
3. 点击左侧 **加载已解压的扩展程序** 按钮
4. 在弹出的文件选择器中，选择项目的 `extension/` 目录
5. 扩展加载成功后，工具栏会出现 V2EX Polish 图标

> 提示：如果图标未显示在工具栏，点击工具栏的拼图图标，将 V2EX Polish 固定到工具栏。

### Firefox 浏览器

1. 在地址栏输入 `about:debugging` 并访问
2. 点击左侧菜单中的 **此 Firefox**
3. 点击 **临时载入附加组件** 按钮
4. 在弹出的文件选择器中，选择项目的 `extension/manifest.json` 文件
5. 扩展加载成功后，工具栏会出现 V2EX Polish 图标

> 注意：Firefox 临时加载的扩展在浏览器关闭后会被移除，下次需要重新加载。

### 刷新已加载的扩展

代码变更并重新编译后，需要刷新扩展才能生效：

- **Chrome**：在 `chrome://extensions/` 页面，点击扩展卡片上的刷新按钮 ↻
- **Firefox**：在 `about:debugging` 页面，点击扩展条目中的 **重新载入** 按钮

## 热重载与代码变更监听

开发模式启动后，以下文件类型的变更会自动触发重新编译：

| 文件类型   | 监听范围               | 编译工具 | 输出目录             |
| ---------- | ---------------------- | -------- | -------------------- |
| TypeScript | `src/**/*.ts`          | tsup     | `extension/scripts/` |
| SCSS       | `src/styles/**/*.scss` | sass     | `extension/css/`     |

### 变更生效流程

```text
代码变更 → 自动编译 → 刷新扩展 → 刷新页面
           (自动)      (手动)      (手动)
```

1. **代码变更**：保存 TS 或 SCSS 文件
2. **自动编译**：监听进程检测到变更，触发重新编译
3. **刷新扩展**：在浏览器扩展管理页面点击刷新按钮
4. **刷新页面**：刷新 V2EX 页面以加载新代码

### 需要手动重新构建的情况

以下变更不会被自动监听，需要手动操作：

| 变更类型                      | 所需操作                  |
| ----------------------------- | ------------------------- |
| 修改 `package.json` 版本号    | `pnpm run build:manifest` |
| 修改域名白名单 `V2EX_DOMAINS` | `pnpm run build:manifest` |
| 新增/删除入口文件             | 重启开发模式              |
| 修改 `tsup.config.ts`         | 重启开发模式              |

## 单独构建命令

开发过程中可能需要单独执行某些构建任务：

```bash
# 仅编译 TypeScript
pnpm run build:ext

# 仅编译样式
pnpm run build:style

# 仅生成 Chrome 清单
pnpm run build:manifest:chrome

# 仅生成 Firefox 清单
pnpm run build:manifest:firefox

# 仅构建油猴脚本
pnpm run build:userscript
```

## 监听模式

如果只需要监听文件变更而不启动浏览器：

```bash
# 同时监听 TS 和 SCSS
pnpm run watch

# 仅监听 TS
pnpm run watch:ext

# 仅监听 SCSS
pnpm run watch:style
```

## Cloudflare Worker 调试

`hot-topics/` 是一个独立的 Cloudflare Workers 子项目，使用自己的 `package.json`、`tsconfig.json` 和 `wrangler.toml`。

常用命令：

```bash
# 本地启动 Worker
pnpm worker:dev

# 类型检查
pnpm worker:check

# 部署到 Cloudflare
pnpm worker:deploy
```

当前限制：

- 扩展侧调用的是已部署的 Worker 地址，不会自动转发到本地 `wrangler dev`
- 因此 `pnpm worker:dev` 更适合单独调试 API、定时任务和 D1 逻辑
- 如果要联动扩展验证热议主题功能，需要先部署 Worker，并同步更新扩展中的接口地址

首次接入时请确认：

- `hot-topics/wrangler.toml` 中的 `database_id` 已替换为真实 D1 数据库 ID
- `hot-topics/schema.sql` 已执行到对应数据库
- 已为扩展配置正确的 Worker 访问地址

详细说明见 [hot-topics.md](./hot-topics.md)。

下一步：阅读 [build-and-release.md](./build-and-release.md) 了解构建与发布流程。
