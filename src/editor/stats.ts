export interface Stats {
  lines: number;
  chars: number;
  words: number;
}

export function computeStats(content: string): Stats {
  const lines = content.length === 0 ? 1 : content.split('\n').length;
  const chars = content.length;
  const words = content.trim() === '' ? 0 : content.trim().split(/\s+/).length;

  return { lines, chars, words };
}

export class StatsDisplay {
  private linesEl: HTMLElement;
  private charsEl: HTMLElement;
  private wordsEl: HTMLElement;

  constructor(linesEl: HTMLElement, charsEl: HTMLElement, wordsEl: HTMLElement) {
    this.linesEl = linesEl;
    this.charsEl = charsEl;
    this.wordsEl = wordsEl;
  }

  update(content: string): void {
    const stats = computeStats(content);
    this.linesEl.textContent = `行数: ${stats.lines}`;
    this.charsEl.textContent = `字符: ${stats.chars}`;
    this.wordsEl.textContent = `词数: ${stats.words}`;
  }
}
