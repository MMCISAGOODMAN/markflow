# Markflow

Word 风格的 Markdown 编辑器 Web 应用。左侧编辑 Markdown 源码，右侧实时预览，顶部 Ribbon 工具栏提供格式化与文件操作。

## 功能

- 双栏布局：源码编辑 + 实时预览
- Ribbon 工具栏：加粗、斜体、标题、列表、引用、代码、表格、链接、图片等
- 导入 `.md` 文件，导出 `.md` / `.html` 文件
- 深色 / 浅色主题切换（偏好保存在 localStorage）
- 编辑区与预览区滚动同步
- 状态栏显示行数、字符数、词数
- 常用快捷键

## 快速开始

```bash
npm install
npm run dev
```

浏览器打开 [http://localhost:5173](http://localhost:5173)

## 构建

```bash
npm run build
npm run preview
```

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| Ctrl/Cmd + B | 加粗 |
| Ctrl/Cmd + I | 斜体 |
| Ctrl/Cmd + Shift + S | 删除线 |
| Ctrl/Cmd + K | 插入链接 |
| Ctrl/Cmd + Shift + C | 代码块 |
| Ctrl/Cmd + 1 | 标题 1 |
| Ctrl/Cmd + 2 | 标题 2 |
| Ctrl/Cmd + 3 | 标题 3 |

## 技术栈

- [Vite](https://vitejs.dev/) + TypeScript
- [Marked.js](https://marked.js.org/) — Markdown 解析
- [DOMPurify](https://github.com/cure53/DOMPurify) — HTML 消毒

## 浏览器支持

现代浏览器（Chrome、Firefox、Safari、Edge 最新版本）。
