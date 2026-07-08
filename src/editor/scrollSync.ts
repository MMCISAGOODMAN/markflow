import { getCaretLineRatio } from './lineAnchors';

const NAV_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'PageUp',
  'PageDown',
  'Home',
  'End',
]);

function getScrollRatio(scrollEl: HTMLElement): number {
  const max = scrollEl.scrollHeight - scrollEl.clientHeight;
  if (max <= 0) return 0;
  return scrollEl.scrollTop / max;
}

function setScrollRatio(scrollEl: HTMLElement, ratio: number): void {
  const max = scrollEl.scrollHeight - scrollEl.clientHeight;
  scrollEl.scrollTop = Math.max(0, Math.min(max, ratio * max));
}

function getCaretLine(editor: HTMLTextAreaElement): number {
  const before = editor.value.substring(0, editor.selectionStart);
  return before.split('\n').length;
}

function scrollToLine(
  line: number,
  editor: HTMLTextAreaElement,
  previewContent: HTMLElement,
  previewScroll: HTMLElement,
): void {
  const blocks = previewContent.querySelectorAll<HTMLElement>('[data-line]');

  if (blocks.length > 0) {
    let target: HTMLElement = blocks[0];
    for (const block of blocks) {
      const blockLine = Number(block.dataset.line);
      if (blockLine <= line) {
        target = block;
      } else {
        break;
      }
    }

    const anchorRect = target.getBoundingClientRect();
    const scrollRect = previewScroll.getBoundingClientRect();
    const relativeTop = anchorRect.top - scrollRect.top + previewScroll.scrollTop;
    const offset = previewScroll.clientHeight * 0.2;
    previewScroll.scrollTop = Math.max(0, relativeTop - offset);
    return;
  }

  setScrollRatio(previewScroll, getCaretLineRatio(editor));
}

export function setupScrollSync(
  editor: HTMLTextAreaElement,
  previewScroll: HTMLElement,
  previewContent: HTMLElement,
): void {
  let syncSource: 'scroll' | 'caret' | null = null;

  const syncByScroll = (): void => {
    if (syncSource === 'caret') return;
    syncSource = 'scroll';
    setScrollRatio(previewScroll, getScrollRatio(editor));
    requestAnimationFrame(() => {
      syncSource = null;
    });
  };

  const syncByCaret = (): void => {
    syncSource = 'caret';
    scrollToLine(getCaretLine(editor), editor, previewContent, previewScroll);
    requestAnimationFrame(() => {
      syncSource = null;
    });
  };

  editor.addEventListener('scroll', syncByScroll, { passive: true });

  editor.addEventListener('click', () => {
    requestAnimationFrame(syncByCaret);
  });

  editor.addEventListener('keyup', (event: KeyboardEvent) => {
    if (NAV_KEYS.has(event.key) || event.ctrlKey || event.metaKey) {
      syncByCaret();
    }
  });
}
