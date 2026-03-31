# `hot-topics/` Worker 子项目

返回索引：[README](./README.md)

`hot-topics/` 是仓库中的 Cloudflare Workers 子项目，用于提供热议主题查询接口，并通过 Cron 定时抓取 V2EX 热门主题写入 D1。

## 目录职责

- `hot-topics/src/index.ts`：Worker 入口，处理 HTTP 请求与定时任务
- `hot-topics/src/query.ts`：热议主题查询逻辑与参数校验
- `hot-topics/src/updater.ts`：定时抓取 V2EX 热门主题并写入 D1
- `hot-topics/schema.sql`：D1 建表脚本
- `hot-topics/wrangler.toml`：Worker 名称、入口、Cron 与 D1 绑定配置

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
2. 将 `hot-topics/wrangler.toml` 中的 `database_id` 替换为真实值。
3. 将 `hot-topics/schema.sql` 执行到目标 D1 数据库。
4. 部署 Worker，并拿到实际可访问的域名。
5. 将扩展侧热议主题接口地址改为真实 Worker 地址。

## 与扩展主项目的关系

当前扩展主项目和 Worker 的关系是“HTTP 调用”，而不是源码级共享模块：

- 扩展通过 `src/services.ts` 中的热议主题接口地址访问 Worker
- Worker 独立抓取数据、写入 D1、对外提供 `/hot-topics` 接口
- 两者目前没有共享 package，也没有共享构建链路

这也是本仓库只采用“轻量 workspace”的原因：统一依赖管理和命令入口，但不强行把目录重构成复杂 monorepo。

## 当前联调限制

当前扩展不会自动连接本地 `wrangler dev` 地址，因此需要注意：

- `pnpm worker:dev` 适合独立调试 Worker 接口和数据库逻辑
- 扩展端验证热议主题功能时，通常仍需要使用已部署的 Worker 地址
- 如果未来要提升联调体验，建议把扩展中的 Worker 地址改为可配置项，而不是硬编码

## 变更建议

当你要继续演进 `hot-topics/` 时，优先考虑以下方向：

- 如果扩展和 Worker 开始共享接口类型或数据契约，再新增 `packages/contracts`
- 如果需要统一本地联调体验，再引入可配置的 Worker API 地址
- 如果将来出现更多独立子项目，再考虑把根扩展迁移到 `apps/*` 结构
