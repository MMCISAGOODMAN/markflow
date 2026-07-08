function findBlockStartLines(lines: string[]): number[] {
  const result: number[] = [];
  let inCodeFence = false;
  let inTable = false;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    const lineNum = i + 1;

    if (trimmed.startsWith('```')) {
      if (!inCodeFence) {
        result.push(lineNum);
      }
      inCodeFence = !inCodeFence;
      continue;
    }

    if (inCodeFence) {
      continue;
    }

    if (trimmed === '') {
      inTable = false;
      continue;
    }

    if (trimmed.startsWith('|')) {
      if (!inTable) {
        result.push(lineNum);
        inTable = true;
      }
      continue;
    }

    inTable = false;

    if (
      /^#{1,6}\s/.test(trimmed) ||
      /^>\s?/.test(trimmed) ||
      /^[-*+]\s/.test(trimmed) ||
      /^\d+\.\s/.test(trimmed) ||
      /^-{3,}$/.test(trimmed) ||
      /^!\[/.test(trimmed)
    ) {
      result.push(lineNum);
      continue;
    }

    const prevLine = i > 0 ? lines[i - 1].trim() : '';
    if (i === 0 || prevLine === '' || prevLine.startsWith('```')) {
      result.push(lineNum);
    }
  }

  return result;
}

export function attachLineAnchors(container: HTMLElement, source: string): void {
  container.querySelectorAll('[data-line]').forEach((el) => {
    el.removeAttribute('data-line');
    el.removeAttribute('id');
  });

  const blockLines = findBlockStartLines(source.split('\n'));
  const elements = Array.from(container.children) as HTMLElement[];
  const count = Math.min(blockLines.length, elements.length);

  for (let i = 0; i < count; i++) {
    elements[i].dataset.line = String(blockLines[i]);
    elements[i].id = `src-line-${blockLines[i]}`;
  }
}

export function getCaretLineRatio(editor: HTMLTextAreaElement): number {
  const value = editor.value;
  if (!value) return 0;

  const before = value.substring(0, editor.selectionStart);
  const caretLine = before.split('\n').length;
  const totalLines = value.split('\n').length;

  if (totalLines <= 1) return 0;
  return (caretLine - 1) / (totalLines - 1);
}
