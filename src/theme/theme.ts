const STORAGE_KEY = 'markflow-theme';

export type Theme = 'light' | 'dark';

export class ThemeManager {
  private statEl: HTMLElement | null;
  private current: Theme;

  constructor(statEl?: HTMLElement) {
    this.statEl = statEl ?? null;
    this.current = this.loadTheme();
    this.apply(this.current);
  }

  get theme(): Theme {
    return this.current;
  }

  toggle(): Theme {
    this.current = this.current === 'light' ? 'dark' : 'light';
    this.apply(this.current);
    localStorage.setItem(STORAGE_KEY, this.current);
    return this.current;
  }

  private loadTheme(): Theme {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private apply(theme: Theme): void {
    document.documentElement.dataset.theme = theme;
    if (this.statEl) {
      this.statEl.textContent = theme === 'light' ? '浅色主题' : '深色主题';
    }
  }
}
