export class Editor {
  private textarea: HTMLTextAreaElement;

  constructor(textarea: HTMLTextAreaElement) {
    this.textarea = textarea;
  }

  get element(): HTMLTextAreaElement {
    return this.textarea;
  }

  get value(): string {
    return this.textarea.value;
  }

  set value(content: string) {
    this.textarea.value = content;
    this.dispatchInput();
  }

  focus(): void {
    this.textarea.focus();
  }

  getSelection(): { start: number; end: number; text: string } {
    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    return {
      start,
      end,
      text: this.textarea.value.substring(start, end),
    };
  }

  setSelection(start: number, end: number): void {
    this.textarea.focus();
    this.textarea.setSelectionRange(start, end);
  }

  replaceRange(start: number, end: number, replacement: string): void {
    const text = this.textarea.value;
    this.textarea.value = text.substring(0, start) + replacement + text.substring(end);
    this.dispatchInput();
  }

  wrap(before: string, after?: string): void {
    const suffix = after ?? before;
    const { start, end, text } = this.getSelection();
    const replacement = before + text + suffix;
    this.replaceRange(start, end, replacement);
    const cursorStart = start + before.length;
    const cursorEnd = cursorStart + text.length;
    this.setSelection(cursorStart, cursorEnd);
  }

  prefixLine(prefix: string): void {
    const { start, end } = this.getSelection();
    const text = this.textarea.value;
    const lineStart = text.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = text.indexOf('\n', end);
    const actualLineEnd = lineEnd === -1 ? text.length : lineEnd;
    const selectedLines = text.substring(lineStart, actualLineEnd);
    const prefixed = selectedLines
      .split('\n')
      .map((line) => prefix + line)
      .join('\n');
    this.replaceRange(lineStart, actualLineEnd, prefixed);
    this.setSelection(lineStart, lineStart + prefixed.length);
  }

  insertBlock(template: string): void {
    const { start, end, text } = this.getSelection();
    const block = text ? template.replace('{{selection}}', text) : template.replace('{{selection}}', '');
    this.replaceRange(start, end, block);
    const cursorPos = start + block.length;
    this.setSelection(cursorPos, cursorPos);
  }

  insertAtCursor(text: string): void {
    const { start, end } = this.getSelection();
    this.replaceRange(start, end, text);
    const cursorPos = start + text.length;
    this.setSelection(cursorPos, cursorPos);
  }

  onInput(callback: () => void): void {
    this.textarea.addEventListener('input', callback);
  }

  onScroll(callback: () => void): void {
    this.textarea.addEventListener('scroll', callback, { passive: true });
  }

  private dispatchInput(): void {
    this.textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }
}
