import { Editor } from './editor/editor';
import { setupPaneResize } from './editor/paneResize';
import { Preview } from './editor/preview';
import { setupScrollSync } from './editor/scrollSync';
import { StatsDisplay } from './editor/stats';
import { exportHtml, exportMarkdown } from './io/export';
import { setupImport } from './io/import';
import { setupKeyboardShortcuts } from './shortcuts/keyboard';
import { ThemeManager } from './theme/theme';
import { applyFormatAction } from './toolbar/actions';
import { buildRibbon } from './toolbar/ribbon';

const DEFAULT_CONTENT = `# 欢迎使用 Markflow

Markflow 是一个 **Word 风格** 的 Markdown 编辑器。

## 功能特性

- 双栏实时预览
- Ribbon 工具栏格式化
- 导入 / 导出 Markdown 和 HTML
- 深色 / 浅色主题
- 滚动同步
- 快捷键支持

## 示例语法

> 这是一段引用文字

### 列表示例

1. 有序列表项
2. 第二项

- 无序列表项
- 另一项

### 代码

行内 \`code\` 示例：

\`\`\`javascript
function hello() {
  console.log('Hello, Markflow!');
}
\`\`\`

### 表格

| 名称 | 描述 |
| --- | --- |
| Markflow | Markdown 编辑器 |
| Marked.js | 解析引擎 |

### 其他

~~删除线~~、*斜体*、**粗体**

[链接示例](https://example.com)

![图片占位](https://via.placeholder.com/400x200?text=Markflow)
`;

function init(): void {
  const editorEl = document.getElementById('editor') as HTMLTextAreaElement;
  const previewEl = document.getElementById('preview') as HTMLElement;
  const previewScrollEl = document.querySelector('.preview-wrapper') as HTMLElement;
  const workspaceEl = document.getElementById('workspace') as HTMLElement;
  const dividerEl = document.getElementById('pane-divider') as HTMLElement;
  const ribbonEl = document.getElementById('ribbon') as HTMLElement;
  const fileInput = document.getElementById('file-import') as HTMLInputElement;
  const statLines = document.getElementById('stat-lines') as HTMLElement;
  const statChars = document.getElementById('stat-chars') as HTMLElement;
  const statWords = document.getElementById('stat-words') as HTMLElement;
  const statTheme = document.getElementById('stat-theme') as HTMLElement;

  const editor = new Editor(editorEl);
  const preview = new Preview(previewEl);
  const stats = new StatsDisplay(statLines, statChars, statWords);
  const themeManager = new ThemeManager(statTheme);

  editor.value = DEFAULT_CONTENT;

  const refresh = () => {
    preview.update(editor.value);
    stats.update(editor.value);
  };

  editor.onInput(refresh);
  setupScrollSync(editorEl, previewScrollEl, previewEl);
  setupPaneResize(workspaceEl, dividerEl);
  setupKeyboardShortcuts(editor);

  const triggerImport = setupImport(fileInput, (content) => {
    editor.value = content;
    refresh();
  });

  buildRibbon(ribbonEl, {
    onFormat: (action) => applyFormatAction(editor, action),
    onImport: triggerImport,
    onExportMd: () => exportMarkdown(editor.value),
    onExportHtml: () => exportHtml(preview.getHtml(editor.value)),
    onToggleTheme: () => themeManager.toggle(),
  });

  refresh();
}

init();
