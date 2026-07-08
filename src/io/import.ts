export function setupImport(
  fileInput: HTMLInputElement,
  onImport: (content: string, filename: string) => void,
): () => void {
  const handler = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      onImport(reader.result as string, file.name);
      input.value = '';
    };
    reader.readAsText(file);
  };

  fileInput.addEventListener('change', handler);

  return () => fileInput.click();
}
