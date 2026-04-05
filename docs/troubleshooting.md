# 常见问题与排错（Troubleshooting）

返回索引：[README](./README.md)

- 启动命令找不到 `bun`：请先安装 Bun 并确保 PATH 正确
- `pnpm worker:*` 提示找不到项目：确认已在仓库根目录执行过 `pnpm install`
- 注入未生效：检查当前页面是否匹配清单中的域名与路径；刷新扩展
- Firefox 启动报权限不支持：确认使用了 Firefox 清单（由脚本自动处理）
- 清单变更未生效：重新执行 `pnpm run build:manifest` 或直接 `pnpm build`
- `apps/hot-topics/` 本地调试正常但扩展仍拉不到数据：确认扩展配置的是已部署的 Worker 地址，而不是本地 `wrangler dev` 地址
- 浏览器配置被污染：删除 `./chrome-dist-profile` / `./firefox-dist-profile` 后重新启动
- 手动加载扩展失败：确认加载的是 `apps/extension/dist/chrome/` 或 `apps/extension/dist/firefox/manifest.json`

相关：构建与发布问题参见 [build-and-release.md](./build-and-release.md)
