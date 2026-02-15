
import MarkdownIt from 'markdown-it';
import { ThemeId, THEMES } from '../types.ts';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

export const compileToHtml = (
  markdown: string, 
  themeId: ThemeId, 
  headerMd: string = '', 
  footerMd: string = '',
  fontFamily: string = 'Inter, sans-serif',
  fontSize: number = 16
): string => {
  const theme = THEMES[themeId];
  const renderedHeader = headerMd ? md.render(headerMd) : '';
  const renderedContent = md.render(markdown);
  const renderedFooter = footerMd ? md.render(footerMd) : '';

  const htmlTemplate = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StaticMD Document</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Lora:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono&display=swap" rel="stylesheet">
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            font-family: ${fontFamily};
            font-size: ${fontSize}px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        
        .markdown-body {
            line-height: 1.6;
        }
        .markdown-body h1 { font-size: 2.25em; font-weight: 700; margin-bottom: 0.5em; border-bottom: 2px solid; padding-bottom: 0.2em; }
        .markdown-body h2 { font-size: 1.875em; font-weight: 600; margin-top: 1.5em; margin-bottom: 0.5em; }
        .markdown-body h3 { font-size: 1.5em; font-weight: 600; margin-top: 1.2em; margin-bottom: 0.4em; }
        .markdown-body p { margin-bottom: 1em; }
        .markdown-body blockquote { border-left: 4px solid #cbd5e1; padding-left: 1rem; font-style: italic; margin: 1.5rem 0; color: #64748b; }
        .markdown-body code { background: rgba(0,0,0,0.05); padding: 0.2rem 0.4rem; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 0.875em; }
        .markdown-body pre { background: #1e293b; color: #f8fafc; padding: 1rem; border-radius: 8px; overflow-x: auto; margin-bottom: 1rem; }
        .markdown-body pre code { background: transparent; color: inherit; padding: 0; }
        .markdown-body img { max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin: 1.5rem 0; display: block; }
        .markdown-body table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; }
        .markdown-body th, .markdown-body td { border: 1px solid #cbd5e1; padding: 0.5rem; text-align: left; }
        
        header.doc-header { margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid #e2e8f0; opacity: 0.8; }
        footer.doc-footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; opacity: 0.8; font-size: 0.85em; }

        .theme-cyber .markdown-body code { background: #1e293b; color: #22d3ee; }
        .mermaid { margin: 2rem 0; display: flex; justify-content: center; }
        
        @media print {
            body { background: white !important; color: black !important; }
            .markdown-body img { break-inside: avoid; }
            .theme-cyber .markdown-body code { color: #0891b2; border: 1px solid #e2e8f0; }
        }
    </style>
</head>
<body class="${theme.bgClass} ${theme.textClass} theme-${theme.id} min-h-screen">
    <div class="${theme.containerClass} markdown-body">
        ${renderedHeader ? `<header class="doc-header">${renderedHeader}</header>` : ''}
        <article>
            ${renderedContent}
        </article>
        ${renderedFooter ? `<footer class="doc-footer">${renderedFooter}</footer>` : ''}
    </div>

    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <script>
        mermaid.initialize({ 
            startOnLoad: true,
            theme: '${themeId === ThemeId.CYBER ? 'dark' : 'default'}',
            securityLevel: 'loose'
        });
        document.querySelectorAll('pre code.language-mermaid').forEach((block) => {
            const pre = block.parentElement;
            const div = document.createElement('div');
            div.className = 'mermaid';
            div.textContent = block.textContent;
            pre.replaceWith(div);
        });
    </script>
</body>
</html>
  `.trim();

  return htmlTemplate;
};
