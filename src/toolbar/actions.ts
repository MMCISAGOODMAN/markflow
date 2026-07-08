import type { Editor } from '../editor/editor';

const TABLE_TEMPLATE = `| 列1 | 列2 | 列3 |
| --- | --- | --- |
| 内容 | 内容 | 内容 |
| 内容 | 内容 | 内容 |
`;

const CODE_BLOCK_TEMPLATE = '```\n{{selection}}\n```';

export type FormatAction =
  | 'bold'
  | 'italic'
  | 'strikethrough'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'quote'
  | 'ul'
  | 'ol'
  | 'code'
  | 'codeBlock'
  | 'table'
  | 'link'
  | 'image';

export function applyFormatAction(editor: Editor, action: FormatAction): void {
  switch (action) {
    case 'bold':
      editor.wrap('**');
      break;
    case 'italic':
      editor.wrap('*');
      break;
    case 'strikethrough':
      editor.wrap('~~');
      break;
    case 'h1':
      editor.prefixLine('# ');
      break;
    case 'h2':
      editor.prefixLine('## ');
      break;
    case 'h3':
      editor.prefixLine('### ');
      break;
    case 'quote':
      editor.prefixLine('> ');
      break;
    case 'ul':
      editor.prefixLine('- ');
      break;
    case 'ol':
      editor.prefixLine('1. ');
      break;
    case 'code':
      editor.wrap('`');
      break;
    case 'codeBlock':
      editor.insertBlock(CODE_BLOCK_TEMPLATE);
      break;
    case 'table':
      editor.insertAtCursor(TABLE_TEMPLATE);
      break;
    case 'link':
      insertLink(editor);
      break;
    case 'image':
      insertImage(editor);
      break;
  }
}

function insertLink(editor: Editor): void {
  const { text } = editor.getSelection();
  const label = text || '链接文本';
  editor.insertAtCursor(`[${label}](url)`);
}

function insertImage(editor: Editor): void {
  editor.insertAtCursor('![图片描述](url)');
}
