# 贡献指南

感谢您考虑为这个项目做出贡献！请先阅读以下内容，以确保贡献过程顺利。

## 项目概述

V2EX Polish 是一个为 V2EX 用户设计的浏览器扩展，提供了丰富的功能增强。项目同时支持 Chrome、Firefox 等浏览器扩展和油猴脚本，并配有基于 Next.js 的官方网站。

## 快速开始

```bash
# 1. 安装依赖（建议使用 pnpm 9）
pnpm install

# 2. 启动开发（默认以 Chrome 为主）
pnpm dev

# 3. 或启动 Firefox 开发
pnpm dev:firefox
```

- 开发输出目录：`extension/`（运行时代码）。请在 `src/` 中修改源码，构建后文件会输出到 `extension/`。
- 首选包管理器：仓库已声明 `packageManager: pnpm@9`，建议安装 pnpm 9 以避免兼容问题。

## 技术栈

### 核心技术

- **TypeScript** - 主要开发语言
- **tsup** - 构建工具，基于 esbuild
- **Sass** - 样式预处理器
- **pnpm** - 包管理器（推荐版本 ^8 || ^9）
- **Bun** - 运行时和构建脚本执行器
- **web-ext** - 浏览器扩展开发工具

### 前端技术

- **@floating-ui/dom** - 浮动元素定位
- **Lucide** - 图标库
- **webext-patterns** - 扩展匹配模式

### 官网技术

- **Next.js 14** - React 框架（App Router）
- **Tailwind CSS** - 样式框架
- **Contentlayer** - 内容管理
- **Radix UI** - 组件库

## 项目结构

```bash
├── extension/              # 构建输出目录（运行时代码）
│   ├── css/               # 编译后的样式文件
│   ├── images/            # 图标资源
│   ├── pages/             # 扩展页面（popup、options）
│   └── scripts/           # 编译后的 JavaScript 文件
├── src/                   # 源代码目录
│   ├── background/        # 后台脚本
│   │   ├── main.ts        # 主后台脚本
│   │   ├── daily-check-in.ts  # 自动签到功能
│   │   └── toggle-icon.ts # 图标切换逻辑
│   ├── contents/          # 内容脚本
│   │   ├── common.ts      # 通用功能
│   │   ├── home/          # 首页相关功能
│   │   ├── topic/         # 主题页面功能
│   │   ├── write/         # 写作页面功能
│   │   ├── member/        # 用户页面功能
│   │   ├── settings/      # 设置页面功能
│   │   ├── notifications/ # 通知页面功能
│   │   ├── go/            # Go 页面功能
│   │   ├── decode-base64.ts # Base64 解码功能
│   │   └── reading-list.ts # 阅读列表功能
│   ├── components/        # 可复用组件
│   │   ├── button.ts      # 按钮组件
│   │   ├── modal.ts       # 弹窗组件
│   │   ├── toast.ts       # 提示组件
│   │   ├── popup.ts       # 弹出层组件
│   │   ├── image-upload.ts # 图片上传组件
│   │   ├── icons/         # 图标组件
│   │   ├── screens/       # 屏幕组件
│   │   └── support/       # 支持组件
│   ├── pages/             # 扩展页面脚本
│   │   ├── popup.ts       # 弹出页面
│   │   ├── popup.helper.ts # 弹出页面辅助函数
│   │   ├── popup.type.ts  # 弹出页面类型定义
│   │   ├── popup.var.ts   # 弹出页面变量
│   │   ├── options.ts     # 设置页面
│   │   └── options.helper.ts # 设置页面辅助函数
│   ├── styles/            # 样式文件
│   │   ├── *.scss         # Sass 样式文件
│   │   ├── v2ex-theme-*.scss # 主题样式
│   │   └── reset.css      # 重置样式
│   ├── user-scripts/      # 油猴脚本相关
│   │   ├── index.ts       # 油猴脚本入口
│   │   └── write-style.mjs # 样式生成脚本
│   ├── constants.ts       # 常量定义
│   ├── services.ts        # API 服务
│   ├── types.ts           # TypeScript 类型定义
│   ├── utils.ts           # 工具函数
│   ├── icons.ts           # SVG 图标定义
│   ├── use-topic-preview.ts # 主题预览功能
│   └── web_accessible_resources.ts # 网页可访问资源
├── website/               # 官方网站（Next.js）
│   ├── src/
│   │   ├── app/           # App Router 页面
│   │   ├── components/    # React 组件
│   │   └── content/       # Markdown 内容
│   └── package.json       # 网站依赖配置
├── scripts/               # 构建脚本
│   ├── build.ts           # 主构建脚本
│   └── build-manifest.ts  # Manifest 生成脚本
├── build-chrome/          # Chrome 扩展构建产物
├── build-firefox/         # Firefox 扩展构建产物
├── dist/                  # 油猴脚本构建产物
└── tsup.config.ts         # tsup 配置文件
```

### 重要约定

- 不要直接修改 `extension/` 目录下的文件（构建产物会被覆盖）。
- 源代码改动集中在 `src/`；样式在 `src/styles/`；构建逻辑在 `scripts/`。
- Manifest 文件由 `scripts/build-manifest.ts` 自动生成，可按需切换主要目标浏览器。

## 开发环境设置

### 前置要求

- **Node.js** >= 20
- **pnpm** >= 9（推荐使用 pnpm 作为包管理器）
- **Bun** >= 1.1（用于构建脚本）

### 安装依赖

```bash
pnpm install
```

## 本地开发

### 方式一：使用 web-ext（推荐）

项目使用 [web-ext](https://github.com/mozilla/web-ext) 进行开发，支持热重载，无需手动刷新扩展。

```bash
# Chrome 开发
pnpm dev

# Firefox 开发
pnpm dev:firefox
```

执行后会自动：

1. 构建 manifest.json
2. 编译源代码并监听文件变化
3. 启动浏览器并加载扩展
4. 自动打开 V2EX 网站

#### 切换 Manifest 主要目标浏览器

- 默认以 Chrome 为主：

  ```bash
  pnpm build:manifest
  ```

- 以 Chrome 为主（生成 `manifest.json` 与 `manifest-firefox.json`）：

  ```bash
  pnpm build:manifest:chrome
  ```

- 以 Firefox 为主（生成 `manifest.json` 与 `manifest-chrome.json`）：

  ```bash
  pnpm build:manifest:firefox
  ```

### 方式二：手动加载扩展

如果不使用 web-ext，可以手动加载扩展：

1. 运行构建命令：

   ```bash
   pnpm run build:all
   ```

2. 在 Chrome 中加载扩展：

   - 打开 `chrome://extensions/`
   - 开启「开发者模式」
   - 点击「加载已解压的扩展程序」
   - 选择 `extension` 文件夹

3. 开发时监听文件变化：
   ```bash
   pnpm run watch
   ```

## 生产构建

### 发布前准备

1. 更新版本号：

   ```bash
   # 编辑 scripts/build-manifest.ts 中的 version 字段
   ```

2. 执行完整构建：
   ```bash
   pnpm build
   ```

### 构建产物

构建完成后会生成以下文件：

- `build-chrome/` - Chrome 扩展构建产物
- `build-firefox/` - Firefox 扩展构建产物
- `dist/` - 油猴脚本文件
- `*.zip` 文件 - 可直接上传到扩展商店的压缩包

## 开发脚本说明

| 脚本命令                      | 功能描述                             |
| ----------------------------- | ------------------------------------ |
| `pnpm dev`                    | 启动 Chrome 开发环境（推荐）         |
| `pnpm dev:firefox`            | 启动 Firefox 开发环境                |
| `pnpm run:chrome`             | 启动带本地 Profile 的 Chromium       |
| `pnpm run:firefox`            | 启动带本地 Profile 的 Firefox        |
| `pnpm build`                  | 完整生产构建（含打包 zip）           |
| `pnpm build:all`              | Manifest、样式、扩展、油猴全量构建   |
| `pnpm build:ext`              | 构建扩展 JavaScript                  |
| `pnpm build:style`            | 构建样式文件                         |
| `pnpm build:manifest`         | 生成 manifest.json                   |
| `pnpm build:manifest:chrome`  | 以 Chrome 为主生成 Manifest          |
| `pnpm build:manifest:firefox` | 以 Firefox 为主生成 Manifest         |
| `pnpm build:userscript`       | 构建油猴脚本                         |
| `pnpm watch`                  | 监听文件变化并自动构建               |
| `pnpm watch:ext`              | 监听扩展文件变化                     |
| `pnpm watch:style`            | 监听样式文件变化                     |
| `pnpm pack:chrome`            | 生成 Chrome 扩展 zip                 |
| `pnpm pack:firefox`           | 生成 Firefox 扩展 zip                |
| `pnpm clean`                  | 清理构建产物与本地浏览器 Profile     |
| `pnpm lint`                   | 运行所有代码检查                     |
| `pnpm lint:ts`                | TypeScript 类型检查                  |
| `pnpm lint:es`                | ESLint 代码检查                      |
| `pnpm lint:style`             | Stylelint 样式检查                   |
| `pnpm lint:prettier`          | Prettier 格式化检查（Markdown/JSON） |
| `pnpm deps`                   | 交互式更新依赖                       |

## 官网开发

官网基于 Next.js 14 构建，使用 App Router 和 Tailwind CSS。

```bash
cd website/
pnpm install
pnpm dev
```

官网开发脚本：

| 脚本命令     | 功能描述         |
| ------------ | ---------------- |
| `pnpm dev`   | 启动开发服务器   |
| `pnpm build` | 构建生产版本     |
| `pnpm start` | 启动生产服务器   |
| `pnpm lint`  | 运行所有代码检查 |

## 代码规范

### TypeScript

- 使用严格的 TypeScript 配置
- 优先使用类型推断，必要时添加显式类型注解
- 遵循项目的 ESLint 配置

### 样式

- 使用 Sass 进行样式开发
- 遵循 BEM 命名规范
- 官网使用 Tailwind CSS
- 使用 CSS 变量实现主题切换

### 提交规范

- 使用清晰的 commit 信息
- 一个 commit 只做一件事
- 提交前运行 `pnpm lint` 确保代码质量

## 提交问题和功能请求

在提交新的 [issue](https://github.com/coolpace/V2EX_Polish/issues) 前，请：

1. 搜索现有 issue，避免重复
2. 使用合适的 issue 模板
3. 提供详细的重现步骤（如果是 bug）
4. 说明期望的行为和实际行为

## 贡献代码

### Pull Request 流程

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m 'Add some feature'`
4. 推送分支：`git push origin feature/your-feature`
5. 创建 Pull Request

### 代码审查要求

为了确保代码质量，请确保：

1. **代码风格**：符合项目的 ESLint 和 Prettier 配置
2. **类型安全**：通过 TypeScript 类型检查
3. **功能测试**：在 Chrome 和 Firefox 中测试功能
4. **构建成功**：确保 `pnpm build` 能够成功执行
5. **文档更新**：如有必要，更新相关文档

### 提交规范（推荐）

- 推荐采用 Conventional Commits（如：`feat: xxx`、`fix: xxx`、`chore: xxx`）。
- 一个 commit 只做一件事；信息清晰，能表达改动意图与影响范围。

### Pull Request 检查清单

- [ ] 已在 Chrome 与 Firefox 上本地验证主要功能
- [ ] `pnpm build`、`pnpm lint` 全部通过
- [ ] 未改动 `extension/` 目录的构建产物
- [ ] 必要时更新了文档（如 README、CONTRIBUTING）

### 开发建议

1. **功能开发**：优先在 `src/contents/` 目录下开发页面特定功能
2. **组件复用**：将可复用的 UI 组件放在 `src/components/` 目录
3. **样式管理**：使用 CSS 变量实现主题切换
4. **性能考虑**：避免不必要的 DOM 操作，合理使用事件委托
5. **兼容性**：确保功能在不同浏览器中正常工作

## 调试技巧

### 扩展调试

- 使用 Chrome DevTools 调试内容脚本
- 在 `chrome://extensions/` 中查看扩展详情和错误日志
- 使用 `console.log` 进行调试输出

常见本地环境问题：

- 如果启动浏览器失败，请检查本机浏览器是否可用，以及本仓库中的本地 Profile 目录是否存在：`chrome-profile/`、`firefox-dev-profile/`。
- 若 `web-ext` 无法找到浏览器，可尝试升级本机浏览器或在命令中显式指定路径（参考 `web-ext` 文档）。

### 样式调试

- 使用浏览器开发者工具检查样式
- 注意 CSS 变量的作用域和继承
- 测试不同主题下的样式表现

## 常见问题

### 构建问题

- 确保 Node.js 版本 >= 18
- 使用 pnpm 而不是 npm 或 yarn
- 清理 node_modules 重新安装依赖
  ```bash
  rimraf node_modules && pnpm install
  ```

### 开发问题

- 确保扩展在浏览器中正确加载
- 检查控制台错误信息
- 验证 manifest.json 配置
  - 如切换主要目标浏览器，请运行对应的 Manifest 生成命令（见上文）。

## 社区支持

如有疑问，可以通过以下方式获取帮助：

- 提交 [GitHub Issue](https://github.com/coolpace/V2EX_Polish/issues)
- 查看[项目文档](https://v2p.leoku.dev)
- 参与 [GitHub Discussions](https://github.com/coolpace/V2EX_Polish/discussions)
- 加入 [Telegram 群组](https://t.me/+zH9GxA2DYLtjYjhl)

感谢您的贡献！🎉
