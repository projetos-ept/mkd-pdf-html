
import MarkdownIt from 'markdown-it';
import { ThemeId, THEMES } from '../types';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

export const compileToHtml = (markdown: string, themeId: ThemeId): string => {
  const theme = THEMES[themeId];
  const renderedContent = md.render(markdown);

  // We wrap the rendered content in a mermaid div detector if it contains mermaid blocks
  // Note: For the exported file, we need to include Mermaid CDN and init script.
  
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Lora:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono&display=swap');
        
        body { margin: 0; padding: 0; }
        
        .markdown-body {
            line-height: 1.6;
        }
        .markdown-body h1 { font-size: 2.25rem; font-weight: 700; margin-bottom: 1.5rem; border-bottom: 2px solid; padding-bottom: 0.5rem; }
        .markdown-body h2 { font-size: 1.875rem; font-weight: 600; margin-top: 2rem; margin-bottom: 1rem; }
        .markdown-body h3 { font-size: 1.5rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; }
        .markdown-body p { margin-bottom: 1rem; }
        .markdown-body ul, .markdown-body ol { margin-bottom: 1rem; padding-left: 1.5rem; }
        .markdown-body li { margin-bottom: 0.25rem; }
        .markdown-body blockquote { border-left: 4px solid #cbd5e1; padding-left: 1rem; font-style: italic; margin: 1.5rem 0; color: #64748b; }
        .markdown-body code { background: #e2e8f0; padding: 0.2rem 0.4rem; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 0.875em; }
        .markdown-body pre { background: #1e293b; color: #f8fafc; padding: 1rem; border-radius: 8px; overflow-x: auto; margin-bottom: 1rem; }
        .markdown-body pre code { background: transparent; color: inherit; padding: 0; }
        .markdown-body a { color: #3b82f6; text-decoration: underline; }
        .markdown-body img { max-width: 100%; height: auto; border-radius: 8px; }
        .markdown-body table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; }
        .markdown-body th, .markdown-body td { border: 1px solid #cbd5e1; padding: 0.5rem; text-align: left; }
        
        /* Theme Specific Adjustments */
        .theme-sepia .markdown-body a { color: #8b5e3c; }
        .theme-sepia .markdown-body code { background: #e8dfc5; }
        .theme-cyber .markdown-body h1 { border-color: #22d3ee; }
        .theme-cyber .markdown-body a { color: #22d3ee; }
        .theme-cyber .markdown-body code { background: #1e293b; color: #22d3ee; }
        .theme-cyber .markdown-body blockquote { border-color: #22d3ee; color: #94a3b8; }

        .mermaid { margin: 2rem 0; display: flex; justify-content: center; }
    </style>
</head>
<body class="${theme.bgClass} ${theme.textClass} theme-${theme.id} min-h-screen">
    <div class="${theme.containerClass} markdown-body">
        ${renderedContent}
    </div>

    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <script>
        mermaid.initialize({ 
            startOnLoad: true,
            theme: '${themeId === ThemeId.CYBER ? 'dark' : 'default'}',
            securityLevel: 'loose'
        });
        
        // Convert pre code blocks with mermaid class to div.mermaid
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
