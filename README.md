# V2EX Polish - 体验更现代化的 V2EX

![V2EX Polish 宣传封面图](https://cdn.jsdelivr.net/gh/Codennnn/static/preview/V2EX_Polish.jpg)

一款专为 V2EX 用户设计的轻量浏览器插件，提供了丰富的扩展功能，让原生页面焕然一新！

## 安装使用

- Chrome 和 Edge 用户请在 [Chrome 商店中安装](https://chrome.google.com/webstore/detail/v2ex-polish/onnepejgdiojhiflfoemillegpgpabdm)
- 想要体验最新功能，可以[手动安装](https://github.com/coolpace/V2EX_Polish/releases)
- [油猴脚本](https://greasyfork.org/zh-CN/scripts/459848-v2ex-polish-%E4%BD%93%E9%AA%8C%E6%9B%B4%E7%8E%B0%E4%BB%A3%E5%8C%96%E7%9A%84-v2ex)（仅支持部分功能，文档后面介绍了功能差异）

> **Note**
> 使用其他类似的脚本或插件可能会导致冲突，如果在使用过程中发现网页内容有误，建议关闭其他插件以排查问题。

_Safari 和 Firefox 浏览器正在计划支持中，敬请期待！_

## 扩展功能

### ⊙ 主要功能：

- 🪄 界面美化：UI 设计更现代化，为你带来愉悦的视觉体验。

- 📥 评论回复嵌套层级：主题下的评论回复支持层级展示，可以更轻松地跟踪和回复其他用户的评论。

- 🔥 热门回复展示：自动筛选出最受欢迎的回复，第一时间追上热评。

- 😀 表情回复支持：评论输入框可以选择表情，让回复更加生动和有趣。

- 📃 长回复优化：智能折叠长篇回复，一键展开查看完整内容。

- 📰 内置主题列表：无需打开网页，插件内即可快速获取最热、最新的主题列表和消息通知。

### ⊙ 更多功能：

- 便捷回复工具箱：文字转 Base64、上传图片。

- 点击用户头像，查看用户信息。

- 右键菜单扩展：支持解析页面中所有使用 Base64 编码的内容。

- 在主题列表中即可预览内容，无需再进入主题页面。

- 翻页后自动跳转到回复区。

- 自动领取每日签到奖励。

- 用户标签设置，快速标记各类用户。

- ...... _更多功能等你一探究竟！_

## 为什么选择 V2EX Polish？

在社区中早已存在众多用于增强 v2ex.com 的[脚本](https://greasyfork.org/zh-CN/scripts/by-site/v2ex.com)和[插件](https://chrome.google.com/webstore/search/v2ex?_category=extensions)，然而它们带来的体验良莠不齐，且大多数已经停止更新。

V2EX Polish 的目标是提供一个更加完善的插件，并且长期维护，快速响应 V2EX 用户的需求。我们希望打造最高质量的 V2EX 扩展，提供最佳的体验。

## 如何帮助我们

作为开发者，创造对他人有用的东西始终是我们的热情所在，这个项目也不例外。我们投入了大量的时间和精力，致力于为 V2EX 用户带来更好的体验。因此，如果我们的项目帮助了你，欢迎你为我们的项目：

- 点个 Star ⭐️ 或分享给他人，让更多的人知道我们的存在。
- 提供反馈，帮助我们改进。
- 改善代码（请阅读我们的[代码贡献指南](./.github/CONTRIBUTING.md)）。

## 常见问题

<details>
<summary>使用油猴脚本和浏览器扩展有什么区别？</summary>

油猴脚本不支持：

- 所有个性化设置
- 右键功能菜单
- 用户标签设置

浏览器扩展支持全部功能，并且经过了更多的测试。为了达到最佳的功能体验，我们更推荐你安装扩展。担心扩展的体积太大？请放心，本扩展的安装体积还不到 **0.1 MB**⚡！我们十分关注扩展的体积和性能，努力减少资源占用。

</details>

<details>
<summary>为什么我的页面内容有误、样式异常？</summary>

如果你使用了其他与 V2EX 相关的插件，那么很可能会引发功能冲突，从而导致页面异常，建议关闭其他插件以排查问题。

</details>

<details>
<summary>为什么有的「楼中楼」回复的楼层不正确？</summary>

由于 V2EX 的原回复并没有记录回复的楼层，本扩展只能根据被回复的用户去寻找此用户的最近一条回复，然后嵌入到这后面去，这种方法并不能保证正确识别用户真正要回复的是哪一个楼层。

</details>

<details>
<summary>为什么需要设置「个人访问令牌（PAT）」？</summary>

PAT 并不是强制的，只有当你想要使用诸如 主题内容预览、获取消息通知 等功能时才需要设置，它是用来访问 [V2EX 开放 API](https://www.v2ex.com/help/api) 的。如果你还没有，请前往[这里创建](https://www.v2ex.com/settings/tokens)。

</details>

## 问题反馈

我们需要你的建议和反馈，以持续完善 V2EX Polish。如果在使用中遇到任何问题，都可以[在这里](https://github.com/coolpace/V2EX_Polish/discussions/1)提出。你也可以加入我们的 [Telegram 群组](https://t.me/+zH9GxA2DYLtjYjhl)向我们快速反馈。

## V 站相关主题

- [V2EX 超强浏览器扩展：体验更先进的 V2EX](https://www.v2ex.com/t/930155#reply379)
- [V2EX Polish 大量功能更新，即刻体验更好用的 V2EX](https://www.v2ex.com/t/935916#reply154)

**喜欢我们的扩展吗？请在[应用商店](https://chrome.google.com/webstore/detail/v2ex-polish/onnepejgdiojhiflfoemillegpgpabdm/reviews)给我们好评！🥰**
