# minimal-ts-blog

极简个人静态博客：本地写 Markdown，用 TypeScript 生成 HTML，GitHub Pages 直接从仓库根目录发布。

## 目录

```text
.
├─ content/        # 文章源文件（.md）
├─ src/build.ts    # 构建脚本
├─ posts/          # 构建产物：文章页
├─ index.html      # 构建产物：首页
├─ style.css       # 构建产物：样式
├─ package.json
└─ tsconfig.json
```

## 使用

1. 安装依赖

```bash
npm install
```

2. 写文章
- 在 `content/` 下新增 `.md` 文件，文件名就是文章 slug。
- 可选 front matter：

```md
---
title: 文章标题
date: 2026-02-15
summary: 一句话简介
---

# 正文
```

3. 构建

```bash
npm run build
```

构建输出：
- `index.html`
- `style.css`
- `posts/*.html`

## GitHub Pages 发布

在仓库设置中配置：
- `Settings -> Pages`
- `Source`: `Deploy from a branch`
- `Branch`: `main`
- `Folder`: `/ (root)`

之后 push 到 `main` 即可发布。
