# 贡献指南

感谢您考虑为这个项目做出贡献！请先阅读以下内容，以确保贡献过程顺利。

## 项目结构

```bash
├── extension # 运行时的代码
├── src # 开发时的代码
│   ├── background # 插件后台脚本
│   ├── contents # 网页内容脚本
│   ├── pages # 浏览器扩展页面相关的页面文件
│   ├── styles # 浏览器扩展相关的样式文件
│   ├── user-scripts # 油猴脚本相关
│   ├── constants.ts # 常量
│   ├── icons.ts # SVG 图标
│   ├── services # API 服务
│   ├── types.ts # TS 类型定义
│   └── utils.ts # 工具函数
├── website # 官网（基于 Next.js）
├── scripts # 与项目构建相关的脚本
└── tsup.config.ts # tsup 配置
```

## 开发运行

### 本地开发

本项目使用 [web-ext](https://github.com/mozilla/web-ext) 帮助开发，会在代码改动后自动重新加载扩展，所以不需要每次都在扩展程序页面中手动刷新。

以下是具体的开发流程：

1. `pnpm install` 安装依赖。
1. `pnpm dev` 启动本地开发服务器。
1. 打开 Chrome 浏览器，输入 `chrome://extensions/` 进入扩展程序页面。
1. 点击右上角的开发者模式，然后点击 `加载已解压的扩展程序`，选择 `extension` 文件夹。
1. 编辑 `src` 目录中的代码，保存文件后会自动编译。
1. 在扩展程序页面中，点击刷新按钮，接着再刷新目标页面查看效果（如果使用了 web-ext，这一步可省略）。

### 生产构建

简言之：执行 `pnpm build`，这可以分别构建出浏览器（Chrome/Firefox）扩展和油猴脚本。

`pnpm build` 其实包含了多条命令的执行，包括编译输出 JS 脚本、样式、打包产物。执行完这条命令之后，会在根目录下生成 `build-chrome` 和 `build-firefox` 目录，这两个目录下的 `v2ex_polish-[版本号].zip` 就是可以上传到扩展平台的最终产物。

<details>
  <summary>项目脚本解释：</summary>

| 脚本名称            | 描述                     |
| ------------------- | ------------------------ |
| `build:style`       | 构建浏览器扩展用到的样式 |
| `build:ext`         | 构建浏览器扩展           |
| `build:userscript`  | 构建油猴脚本             |
| `pack:chrome`       | 打包最终产物             |
| `output:userscript` | 生成油猴脚本             |
| `output:css`        | 生成油猴脚本样式         |

</details>

### 运行官网

```bash
cd website/ # 进入官网项目目录
pnpm install && pnpm dev # 安装依赖、启动本地开发服务器
```

## 提交问题和请求功能

如果您在使用该项目时遇到了问题或需要某个功能，请先查看项目是否已有相应的记录。如果没有记录，请提交新的 [issue](https://github.com/coolpace/V2EX_Polish/issues)。

## 贡献代码

直接向本仓库提交 **pull request** 即可。本项目的维护者将根据 CONTRIBUTING.md 文件和提交的代码进行评估和审查。如果您的代码被接受，您将成为该项目的贡献者之一。如果您的代码被拒绝，我们将向您提供反馈意见。

以下是一些有助于您的代码被接受的建议：

1. 请确保您的代码符合项目的风格和规范。
2. 请确保您的代码已经经过充分的测试，并且可以成功编译。
3. 请将您的代码提交到新的分支上，并且使用清晰的 commit 信息。
