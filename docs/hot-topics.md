# `apps/hot-topics/` Worker 子项目

返回索引：[README](./README.md)

`apps/hot-topics/` 是仓库中的 Cloudflare Workers 子项目，用于提供热议主题查询接口，并通过 Cron 定时抓取 V2EX 热门主题写入 D1。

## 目录职责

- `apps/hot-topics/src/index.ts`：Worker 入口，处理 HTTP 请求与定时任务
- `apps/hot-topics/src/query.ts`：热议主题查询逻辑与参数校验
- `apps/hot-topics/src/updater.ts`：定时抓取 V2EX 热门主题并写入 D1
- `apps/hot-topics/migrations/`：D1 数据库迁移脚本
- `apps/hot-topics/wrangler.toml`：Worker 名称、入口、Cron 与 D1 绑定配置

## Workspace 使用方式

仓库已经使用 `pnpm workspace` 管理依赖，请统一在仓库根目录执行命令：

```bash
# 安装所有 workspace 依赖
pnpm install

# 本地启动 Worker
pnpm worker:dev

# 类型检查
pnpm worker:check

# 部署 Worker
pnpm worker:deploy
```

如果你更习惯直接使用 filter，也可以执行：

```bash
pnpm --filter v2ex-hot-topics dev
pnpm --filter v2ex-hot-topics check
pnpm --filter v2ex-hot-topics deploy
```

## 首次配置

在真正部署前，至少需要完成以下配置：

1. 创建 D1 数据库。
2. 将 `apps/hot-topics/wrangler.toml` 中的 `database_id` 替换为真实值。
3. 执行数据库迁移：`pnpm --dir apps/hot-topics run db:migrate`（本地开发使用 `db:migrate:local`）。
4. 部署 Worker，并拿到实际可访问的域名。
5. 将扩展侧热议主题接口地址改为真实 Worker 地址。

## 与扩展主项目的关系

当前扩展主项目和 Worker 的关系是“HTTP 调用”，而不是源码级共享模块：

- 扩展通过 `apps/extension/src/services.ts` 中的热议主题接口地址访问 Worker
- Worker 独立抓取数据、写入 D1、对外提供 `/hot-topics` 接口
- 两者目前没有共享 package，也没有共享构建链路

这也是本仓库只采用“轻量 workspace”的原因：统一依赖管理和命令入口，但不强行把目录重构成复杂 monorepo。

## 换成自己的 Worker 实例

扩展端的接口地址声明在 `apps/extension/src/constants.ts` 的 `HOT_TOPICS_API_URL`，默认指向官方实例。

如果你想用自己部署的实例：

1. 按上文完成 Cloudflare 账号、D1 与 Cron 配置，执行 `pnpm worker:deploy`
2. 把 `HOT_TOPICS_API_URL` 替换为你自己的 Worker 域名，形如 `https://<your-subdomain>.workers.dev/hot-topics`
3. 如果你还改动了官网域名，记得同步 `apps/hot-topics/src/index.ts` 中的 `V2EX_ALLOWED_ORIGINS`，否则 CORS 会拦截来自新域名的请求

> [!NOTE]
> 保持默认值不改时，扩展会直接请求官方实例。发布版本中请避免继续使用官方实例，以免占用公共额度。

## 当前联调限制

当前扩展不会自动连接本地 `wrangler dev` 地址，因此需要注意：

- `pnpm worker:dev` 适合独立调试 Worker 接口和数据库逻辑
- 扩展端验证热议主题功能时，通常仍需要使用已部署的 Worker 地址
- 如果未来要提升联调体验，建议把扩展中的 Worker 地址改为可配置项，而不是硬编码

## 变更建议

当你要继续演进 `apps/hot-topics/` 时，优先考虑以下方向：

- 如果扩展和 Worker 开始共享接口类型或数据契约，再新增 `packages/contracts`
- 如果需要统一本地联调体验，再引入可配置的 Worker API 地址
- 如果将来出现更多独立子项目，再考虑把根扩展迁移到 `apps/*` 结构
