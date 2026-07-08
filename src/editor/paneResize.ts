const STORAGE_KEY = 'markflow-pane-ratio';
const MIN_RATIO = 20;
const MAX_RATIO = 80;
const DEFAULT_RATIO = 50;

function isVerticalLayout(): boolean {
  return window.matchMedia('(max-width: 768px)').matches;
}

function clampRatio(ratio: number): number {
  return Math.min(MAX_RATIO, Math.max(MIN_RATIO, ratio));
}

export function setupPaneResize(workspace: HTMLElement, divider: HTMLElement): void {
  const saved = localStorage.getItem(STORAGE_KEY);
  const initial = saved ? parseFloat(saved) : DEFAULT_RATIO;
  workspace.style.setProperty('--editor-pane-size', `${clampRatio(initial)}%`);

  let isDragging = false;

  const updateCursor = (): void => {
    document.body.style.cursor = isVerticalLayout() ? 'row-resize' : 'col-resize';
  };

  const onPointerMove = (event: PointerEvent): void => {
    if (!isDragging) return;

    const rect = workspace.getBoundingClientRect();
    const vertical = isVerticalLayout();
    const ratio = vertical
      ? ((event.clientY - rect.top) / rect.height) * 100
      : ((event.clientX - rect.left) / rect.width) * 100;

    workspace.style.setProperty('--editor-pane-size', `${clampRatio(ratio)}%`);
  };

  const onPointerUp = (): void => {
    if (!isDragging) return;

    isDragging = false;
    document.body.classList.remove('is-resizing');
    document.body.style.cursor = '';
    divider.classList.remove('pane-divider--active');

    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);

    const size = workspace.style.getPropertyValue('--editor-pane-size');
    if (size) {
      localStorage.setItem(STORAGE_KEY, size);
    }
  };

  divider.addEventListener('pointerdown', (event: PointerEvent) => {
    event.preventDefault();
    isDragging = true;
    divider.setPointerCapture(event.pointerId);
    document.body.classList.add('is-resizing');
    updateCursor();
    divider.classList.add('pane-divider--active');

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  });

  divider.addEventListener('dblclick', () => {
    workspace.style.setProperty('--editor-pane-size', `${DEFAULT_RATIO}%`);
    localStorage.setItem(STORAGE_KEY, `${DEFAULT_RATIO}%`);
  });
}
