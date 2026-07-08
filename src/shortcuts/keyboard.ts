import type { Editor } from '../editor/editor';
import { applyFormatAction, type FormatAction } from '../toolbar/actions';

interface Shortcut {
  key: string;
  ctrl: boolean;
  shift: boolean;
  action: FormatAction;
}

const SHORTCUTS: Shortcut[] = [
  { key: 'b', ctrl: true, shift: false, action: 'bold' },
  { key: 'i', ctrl: true, shift: false, action: 'italic' },
  { key: 's', ctrl: true, shift: true, action: 'strikethrough' },
  { key: 'k', ctrl: true, shift: false, action: 'link' },
  { key: 'c', ctrl: true, shift: true, action: 'codeBlock' },
  { key: '1', ctrl: true, shift: false, action: 'h1' },
  { key: '2', ctrl: true, shift: false, action: 'h2' },
  { key: '3', ctrl: true, shift: false, action: 'h3' },
];

export function setupKeyboardShortcuts(editor: Editor): void {
  editor.element.addEventListener('keydown', (event: KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    const ctrlOrMeta = isMac ? event.metaKey : event.ctrlKey;

    for (const shortcut of SHORTCUTS) {
      const keyMatch = event.key.toLowerCase() === shortcut.key;
      const ctrlMatch = shortcut.ctrl ? ctrlOrMeta : !ctrlOrMeta && !event.metaKey;
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;

      if (keyMatch && ctrlMatch && shiftMatch) {
        event.preventDefault();
        applyFormatAction(editor, shortcut.action);
        return;
      }
    }
  });
}
