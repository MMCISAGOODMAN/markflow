import { type FormatAction } from './actions';

interface RibbonButton {
  id: string;
  label: string;
  title: string;
  action: FormatAction | (() => void);
  icon: string;
  wide?: boolean;
}

interface RibbonGroup {
  label: string;
  buttons: RibbonButton[];
}

const ICONS = {
  bold: '<path fill="currentColor" d="M7 3h6a4 4 0 0 1 0 8H7V3zm0 10h7a4 4 0 0 1 0 8H7v-8z"/>',
  italic: '<path fill="currentColor" d="M10 3h4l-4 18h-4l4-18z"/>',
  strikethrough: '<path fill="currentColor" d="M4 10h16v2H4v-2zm2 4h12a4 4 0 0 1-8 0H6z"/>',
  h1: '<path fill="currentColor" d="M5 4v16H3V4h2zm14 0v16h-2V4h2zM9 12h6v2H9v-2z"/>',
  h2: '<path fill="currentColor" d="M5 4v16H3V4h2zm14 0v16h-2V4h2zM9 14h6v2H9v-2z"/>',
  h3: '<path fill="currentColor" d="M5 4v16H3V4h2zm14 0v16h-2V4h2zM9 16h6v2H9v-2z"/>',
  quote: '<path fill="currentColor" d="M6 17h3l2-4V7H5v6h3l-2 4zm8 0h3l2-4V7h-6v6h3l-2 4z"/>',
  ul: '<path fill="currentColor" d="M4 6h2v2H4V6zm0 5h2v2H4v-2zm0 5h2v2H4v-2zM8 7h12v2H8V7zm0 5h12v2H8v-2zm0 5h12v2H8v-2z"/>',
  ol: '<path fill="currentColor" d="M4 6h1v1H4V6zm0 5h1v1H4v-1zm0 5h1v1H4v-1zM8 7h12v2H8V7zm0 5h12v2H8v-2zm0 5h12v2H8v-2z"/>',
  code: '<path fill="currentColor" d="M8.5 6L4 10.5 8.5 15 10 13.5 7 10.5 10 7.5 8.5 6zm7 0L14 7.5 17 10.5 14 13.5 15.5 15 20 10.5 15.5 6z"/>',
  codeBlock: '<path fill="currentColor" d="M4 4h16v4H4V4zm0 6h16v10H4V10zm2 2v6h12v-6H6z"/>',
  table: '<path fill="currentColor" d="M4 4h16v16H4V4zm2 2v4h12V6H6zm0 6v4h5v-4H6zm7 0v4h5v-4h-5z"/>',
  link: '<path fill="currentColor" d="M10.6 13.4l2.8-2.8a2 2 0 0 1 2.8 2.8l-2.8 2.8a2 2 0 1 1-2.8-2.8zm2.8-2.8a2 2 0 0 1-2.8-2.8l2.8-2.8a2 2 0 1 1 2.8 2.8l-2.8 2.8zM8.4 15.6l-2.8 2.8a2 2 0 1 1-2.8-2.8l2.8-2.8a2 2 0 0 1 2.8 2.8z"/>',
  image: '<path fill="currentColor" d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8l-2 3-2-2-3 4v-5H8z"/>',
  import: '<path fill="currentColor" d="M12 3v10.6l3.3-3.3 1.4 1.4L12 17.4 7.3 12.7l1.4-1.4L12 13.6V3h0zm-7 16h14v2H5v-2z"/>',
  exportMd: '<path fill="currentColor" d="M12 3v10.6l-3.3-3.3-1.4 1.4L12 17.4l4.7-4.7-1.4-1.4L12 13.6V3zm-7 16h14v2H5v-2z"/>',
  exportHtml: '<path fill="currentColor" d="M4 4h16v2H4V4zm0 4h10v2H4V8zm0 4h16v2H4v-2zm0 4h10v2H4v-2z"/>',
  theme: '<path fill="currentColor" d="M12 2a7 7 0 1 0 0 14 1 1 0 0 0 0-2 5 5 0 0 1 1.3-9.8A7 7 0 0 0 12 2z"/>',
};

function createButton(btn: RibbonButton, onClick: () => void): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `ribbon__btn${btn.wide ? ' ribbon__btn--wide' : ''}${btn.id.startsWith('file-') ? ' ribbon__btn--file' : ''}`;
  button.title = btn.title;
  button.setAttribute('aria-label', btn.label);
  button.innerHTML = `
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">${btn.icon}</svg>
    <span class="ribbon__btn-label">${btn.label}</span>
  `;
  button.addEventListener('click', onClick);
  return button;
}

export interface RibbonHandlers {
  onFormat: (action: FormatAction) => void;
  onImport: () => void;
  onExportMd: () => void;
  onExportHtml: () => void;
  onToggleTheme: () => void;
}

export function buildRibbon(container: HTMLElement, handlers: RibbonHandlers): void {
  const groups: RibbonGroup[] = [
    {
      label: '文件',
      buttons: [
        { id: 'file-import', label: '导入', title: '导入 Markdown 文件', action: handlers.onImport, icon: ICONS.import },
        { id: 'file-export-md', label: '导出 MD', title: '导出为 .md 文件', action: handlers.onExportMd, icon: ICONS.exportMd },
        { id: 'file-export-html', label: '导出 HTML', title: '导出为 .html 文件', action: handlers.onExportHtml, icon: ICONS.exportHtml, wide: true },
      ],
    },
    {
      label: '字体',
      buttons: [
        { id: 'fmt-bold', label: '加粗', title: '加粗 (Ctrl+B)', action: 'bold', icon: ICONS.bold },
        { id: 'fmt-italic', label: '斜体', title: '斜体 (Ctrl+I)', action: 'italic', icon: ICONS.italic },
        { id: 'fmt-strike', label: '删除线', title: '删除线 (Ctrl+Shift+S)', action: 'strikethrough', icon: ICONS.strikethrough },
      ],
    },
    {
      label: '段落',
      buttons: [
        { id: 'fmt-h1', label: '标题1', title: '标题 1 (Ctrl+1)', action: 'h1', icon: ICONS.h1 },
        { id: 'fmt-h2', label: '标题2', title: '标题 2 (Ctrl+2)', action: 'h2', icon: ICONS.h2 },
        { id: 'fmt-h3', label: '标题3', title: '标题 3 (Ctrl+3)', action: 'h3', icon: ICONS.h3 },
        { id: 'fmt-quote', label: '引用', title: '引用块', action: 'quote', icon: ICONS.quote },
        { id: 'fmt-ul', label: '无序列表', title: '无序列表', action: 'ul', icon: ICONS.ul, wide: true },
        { id: 'fmt-ol', label: '有序列表', title: '有序列表', action: 'ol', icon: ICONS.ol, wide: true },
      ],
    },
    {
      label: '插入',
      buttons: [
        { id: 'fmt-code', label: '行内代码', title: '行内代码', action: 'code', icon: ICONS.code, wide: true },
        { id: 'fmt-codeblock', label: '代码块', title: '代码块 (Ctrl+Shift+C)', action: 'codeBlock', icon: ICONS.codeBlock, wide: true },
        { id: 'fmt-table', label: '表格', title: '插入表格', action: 'table', icon: ICONS.table },
        { id: 'fmt-link', label: '链接', title: '插入链接 (Ctrl+K)', action: 'link', icon: ICONS.link },
        { id: 'fmt-image', label: '图片', title: '插入图片', action: 'image', icon: ICONS.image },
      ],
    },
    {
      label: '视图',
      buttons: [
        { id: 'view-theme', label: '主题', title: '切换深色/浅色主题', action: handlers.onToggleTheme, icon: ICONS.theme },
      ],
    },
  ];

  for (const group of groups) {
    const groupEl = document.createElement('div');
    groupEl.className = 'ribbon__group';

    const buttonsEl = document.createElement('div');
    buttonsEl.className = 'ribbon__buttons';

    for (const btn of group.buttons) {
      const onClick =
        typeof btn.action === 'function'
          ? btn.action
          : () => handlers.onFormat(btn.action as FormatAction);
      buttonsEl.appendChild(createButton(btn, onClick));
    }

    const labelEl = document.createElement('span');
    labelEl.className = 'ribbon__group-label';
    labelEl.textContent = group.label;

    groupEl.appendChild(buttonsEl);
    groupEl.appendChild(labelEl);
    container.appendChild(groupEl);
  }
}
