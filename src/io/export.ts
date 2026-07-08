function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportMarkdown(content: string, filename = 'document.md'): void {
  downloadFile(content, filename, 'text/markdown;charset=utf-8');
}

const PREVIEW_CSS = `
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    line-height: 1.7;
    max-width: 800px;
    margin: 40px auto;
    padding: 0 24px;
    color: #242424;
  }
  h1, h2, h3 { font-weight: 600; line-height: 1.3; }
  h1 { font-size: 2em; border-bottom: 1px solid #e5e5e5; padding-bottom: 0.3em; }
  h2 { font-size: 1.5em; border-bottom: 1px solid #e5e5e5; padding-bottom: 0.3em; }
  h3 { font-size: 1.25em; }
  p { margin: 0.75em 0; }
  blockquote {
    margin: 0.75em 0;
    padding: 0.5em 1em;
    border-left: 4px solid #185abd;
    color: #616161;
    background: #fafafa;
  }
  code {
    font-family: Consolas, Monaco, monospace;
    font-size: 0.9em;
    padding: 0.15em 0.4em;
    border-radius: 3px;
    background: #f6f8fa;
  }
  pre {
    margin: 0.75em 0;
    padding: 12px 16px;
    border-radius: 4px;
    background: #f6f8fa;
    overflow-x: auto;
  }
  pre code { padding: 0; background: none; }
  table { border-collapse: collapse; width: 100%; margin: 0.75em 0; }
  th, td { border: 1px solid #d1d1d1; padding: 8px 12px; text-align: left; }
  th { background: #fafafa; font-weight: 600; }
  img { max-width: 100%; height: auto; }
  a { color: #185abd; text-decoration: none; }
  a:hover { text-decoration: underline; }
  ul, ol { margin: 0.75em 0; padding-left: 2em; }
  hr { border: none; border-top: 1px solid #d1d1d1; margin: 1.5em 0; }
`;

export function exportHtml(htmlContent: string, filename = 'document.html'): void {
  const doc = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markflow Document</title>
  <style>${PREVIEW_CSS}</style>
</head>
<body>
${htmlContent}
</body>
</html>`;

  downloadFile(doc, filename, 'text/html;charset=utf-8');
}
