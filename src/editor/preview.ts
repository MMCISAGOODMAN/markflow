import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { attachLineAnchors } from './lineAnchors';

marked.setOptions({
  gfm: true,
  breaks: true,
});

export class Preview {
  private container: HTMLElement;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private lastSource = '';

  constructor(container: HTMLElement) {
    this.container = container;
  }

  get element(): HTMLElement {
    return this.container;
  }

  update(content: string, immediate = false): void {
    this.lastSource = content;

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    const render = () => {
      const rawHtml = marked.parse(content) as string;
      const sanitized = DOMPurify.sanitize(rawHtml, {
        ADD_ATTR: ['data-line'],
      });
      this.container.innerHTML = sanitized;
      attachLineAnchors(this.container, content);
    };

    if (immediate) {
      render();
    } else {
      this.debounceTimer = setTimeout(render, 150);
    }
  }

  getHtml(content: string): string {
    const rawHtml = marked.parse(content) as string;
    return DOMPurify.sanitize(rawHtml);
  }

  getLastSource(): string {
    return this.lastSource;
  }
}
