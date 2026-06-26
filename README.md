# Kukuo 工具站繁转简 (Kukuo Simplified)

[![Greasy Fork](https://img.shields.io/badge/Greasy%20Fork-Kukuo_Simplified-blue)](https://greasyfork.org/)
[![License](https://img.shields.io/badge/License-GPLv3-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.1.2-orange)](https://github.com/Chuc-Jie/kukuo-simplified)

> 一个 Tampermonkey / Violentmonkey 用户脚本，将 [kukuo.tw](https://kukuo.tw)（Minecraft 工具站）的繁体中文界面自动转换为简体中文。
>
> A Tampermonkey/Violentmonkey userscript that converts the Traditional Chinese UI of [kukuo.tw](https://kukuo.tw), a Minecraft tools website, to Simplified Chinese.

## 📦 安装 / Installation

1. 确保已安装 [Tampermonkey](https://www.tampermonkey.net/) 或 [Violentmonkey](https://violentmonkey.github.io/) 浏览器扩展
2. 打开 `Kukuo_Simplified.user.js` 的 [raw 链接](https://raw.githubusercontent.com/Chuc-Jie/kukuo-simplified/master/Kukuo_Simplified.user.js)
3. 脚本管理器会自动弹出安装提示，点击安装即可

## ✨ 功能特点 / Features

- **精确匹配翻译** — 基于词典的逐词精确匹配，避免混合翻译（不会重复翻译已转换的内容）
- **全面覆盖** — 涵盖导航栏、物品/药水/生物/刷怪笼/商店/头颅指令生成器、附魔、属性、药水效果等
- **高性能引擎** — 使用 `TreeWalker`（C++ 层遍历）替代递归 DOM 遍历，性能提升 3-5x
- **动态内容支持** — `MutationObserver` 监听 DOM 变化，自动翻译动态加载的内容
- **SPA 适配** — 劫持 `pushState`/`replaceState`，监听 `popstate`/`hashchange`，适配单页应用路由
- **安全属性翻译** — 翻译 `placeholder`、`aria-label`、`title` 等属性，不影响用户输入
- **忽略保护** — 跳过代码块、输入框、编辑器等不应翻译的区域
- **500 字符截断** — 跳过超长文本，避免误翻代码块和 minified JS

## 🖥️ 支持页面 / Supported Pages

| 页面 | URL |
|------|-----|
| 工具分类页 | `/java-tools` |
| 物品指令生成器 | `/java-tools/item_maker/*` |
| 药水指令生成器 | `/java-tools/potion_maker/*` |
| 生物指令生成器 | `/java-tools/mob_maker/*` |
| 刷怪笼指令生成器 | `/java-tools/spawner_maker/*` |
| 商店指令生成器 | `/java-tools/shop_maker/*` |
| 头颅指令生成器 | `/java-tools/skull_maker/*` |
| 指令教学 | `/java-educations/*` |
| 地图 | `/java-maps/*` |
| 数据包 | `/java-datapacks/*` |

## 🏗️ 项目结构 / Project Structure

```
kukuo-simplified/
├── Kukuo_Simplified.user.js   # 主脚本（引擎 + 词典）
├── README.md                   # 本文件
├── .gitignore                  # Git 忽略规则
└── LICENSE                     # GPL-3.0
```

> 采用 **单文件架构**（引擎 + 词典合一），无需构建步骤，开箱即用。

## 🧠 技术实现 / Technical Highlights

### 核心引擎架构

```
Observer (MutationObserver + SPA 路由)
    ↓ 感知变化
Walker (TreeWalker: C++ 层遍历)
    ↓ 提取文本节点
Matcher (精确查找: Map.has())
    ↓ 命中词典
Writer (写回 DOM, 保留前后空白)
```

### 技术要点

- **TreeWalker 遍历** — 使用 `document.createTreeWalker()` 替代递归 `childNodes` 遍历，利用浏览器原生 C++ 遍历能力
- **WeakSet 缓存** — 增量翻译时缓存已处理的子树，避免重复遍历
- **精确匹配策略** — 仅翻译与词典条目完全匹配的文本，杜绝误翻
- **前后空白保留** — 翻译时剥离首尾空白，翻完后拼回，不影响 CSS 排版

## 📜 更新日志 / Changelog

### v1.1.x — 核心引擎优化
- TreeWalker 替代递归节点遍历，性能提升 3-5x
- WeakSet 缓存已处理节点，避免重复翻译
- 500 字符截断保护，跳过超长文本
- `closest()` 替代手动 `parentNode` 遍历
- 修复 `processedNodes` 导致 `fullTranslate()` 失效的 bug
- 修复 TreeWalker 过滤器缺少 `shouldIgnoreNode` 检查的 bug
- 修复 input/textarea 的 placeholder 被忽略名单阻挡的问题
- 增加 `document.title` 翻译功能
- 补充大量词典条目，覆盖物品/药水/生物/刷怪笼/商店/头颅 6 个工具页面

### v1.0.0 — 初始版本
- 基础繁体→简体词典
- 精确匹配翻译引擎
- MutationObserver 动态监听
- SPA 路由适配

## 📄 许可 / License

[GPL-3.0](LICENSE) © 友野YouyEr
