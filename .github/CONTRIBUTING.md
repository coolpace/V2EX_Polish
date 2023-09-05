# 贡献指南

感谢您考虑为这个项目做出贡献！请先阅读以下内容，以确保贡献过程顺利。

## 开发运行

### 项目结构

```bash
├── extension # 实际运行的代码
├── src # 开发时的代码
│   ├── background # 插件后台脚本
│   ├── contents # 网页内容脚本
│   ├── pages # 浏览器扩展页面相关的页面文件
│   ├── styles # 浏览器扩展相关的样式文件
│   ├── user-scripts # 油猴脚本相关
│   ├── constants.ts # 常量
│   ├── icons.ts # svg 图标
│   ├── services # API 服务
│   ├── types.ts # TS 类型定义
│   └── utils.ts # 工具函数
├── website # 官网
└── tsup.config.ts # tsup 配置
```

### 快速开始

```bash
pnpm install # 安装依赖
pnpm dev # 启动开发服务器
```

### 生产构建

```bash
pnpm build:style # 构建浏览器扩展用到的样式
pnpm build:ext # 构建浏览器扩展
pnpm build:userscript # 构建油猴脚本
```

### 开发调试

本项目使用 [web-ext](https://github.com/mozilla/web-ext) 帮助开发，会在代码更新后自动重新加载扩展，所以不需要每次都在扩展程序页面中手动点击刷新按钮。

1. 打开 Chrome 浏览器，输入 `chrome://extensions/` 进入扩展程序页面。
2. 点击右上角的开发者模式，然后点击 `加载已解压的扩展程序`，选择 `extension` 文件夹。
3. 在 `src` 文件夹中修改代码，保存后会自动编译。
4. 在扩展程序页面中，点击刷新按钮（如上所述，如果使用了 web-ext，这一步可省略），接着再刷新页面查看效果。

### 运行官网

```bash
pnpm install && pnpm dev
```

## 提交问题和请求功能

如果您在使用该项目时遇到了问题或需要某个功能，请先查看项目是否已有相应的记录。如果没有记录，请提交新的 [issue](https://github.com/coolpace/V2EX_Polish/issues)。

## 贡献代码

直接向本仓库提交 **pull request** 即可。本项目的维护者将根据 CONTRIBUTING.md 文件和提交的代码进行评估和审查。如果您的代码被接受，您将成为该项目的贡献者之一。如果您的代码被拒绝，我们将向您提供反馈意见。

以下是一些有助于您的代码被接受的建议：

1. 请确保您的代码符合项目的风格和规范。
2. 请确保您的代码已经经过充分的测试，并且可以成功编译。
3. 请将您的代码提交到新的分支上，并且使用清晰的 commit 信息。
