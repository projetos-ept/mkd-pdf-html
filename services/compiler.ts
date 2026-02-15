
import MarkdownIt from 'markdown-it';
import { ThemeId, THEMES, ElementPosition } from '../types.ts';

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
  fontSize: number = 16,
  headerPos: ElementPosition = 'flow',
  footerPos: ElementPosition = 'flow'
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
    <title>Documento Estático - LEDUK</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Lora:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono&display=swap" rel="stylesheet">
    <style>
        :root {
            --accent-color: ${theme.id === ThemeId.CYBER ? '#22d3ee' : '#2563eb'};
        }
        body { 
            margin: 0; 
            padding: 0; 
            font-family: ${fontFamily};
            font-size: ${fontSize}px;
            word-wrap: break-word;
            overflow-wrap: anywhere;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            line-height: 1.6;
            background-color: ${theme.bgClass === 'bg-white' ? '#ffffff' : (theme.bgClass === 'bg-[#f4ecd8]' ? '#f4ecd8' : '#020617')};
            color: ${theme.textClass === 'text-gray-900' ? '#111827' : (theme.textClass === 'text-[#433422]' ? '#433422' : '#e2e8f0')};
        }
        
        .markdown-body {
            max-width: 100%;
            overflow-wrap: anywhere;
            padding: 2rem;
        }
        @media (min-width: 768px) {
            .markdown-body { padding: 4rem; max-width: 21cm; margin: 0 auto; }
        }

        .markdown-body h1 { font-size: 2.25em; font-weight: 700; margin-bottom: 0.5em; border-bottom: 2px solid; padding-bottom: 0.2em; border-color: var(--accent-color); }
        .markdown-body h2 { font-size: 1.875em; font-weight: 600; margin-top: 1.5em; margin-bottom: 0.5em; }
        .markdown-body h3 { font-size: 1.5em; font-weight: 600; margin-top: 1.2em; margin-bottom: 0.4em; }
        .markdown-body p { margin-bottom: 1em; text-align: justify; }
        .markdown-body blockquote { border-left: 4px solid #cbd5e1; padding-left: 1rem; font-style: italic; margin: 1.5rem 0; color: #64748b; }
        .markdown-body code { background: rgba(0,0,0,0.05); padding: 0.2rem 0.4rem; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 0.875em; }
        .markdown-body pre { background: #1e293b; color: #f8fafc; padding: 1rem; border-radius: 8px; overflow-x: auto; margin-bottom: 1rem; max-width: 100%; }
        .markdown-body table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; display: block; overflow-x: auto; }
        .markdown-body th { background: rgba(0,0,0,0.02); }
        .markdown-body th, .markdown-body td { border: 1px solid #cbd5e1; padding: 0.5rem; text-align: left; min-width: 120px; }
        
        header.doc-header { margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid #e2e8f0; }
        footer.doc-footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.85em; opacity: 0.8; }

        .mermaid { margin: 2rem 0; display: flex; justify-content: center; width: 100%; overflow: hidden; }
        .mermaid svg { max-width: 100% !important; height: auto !important; }

        @media print {
            body { background: white !important; color: black !important; }
            .markdown-body { padding: 0; max-width: none; }
            ${headerPos === 'sticky' ? `
              @page { margin-top: 3cm; }
              header.doc-header {
                  position: fixed;
                  top: 0;
                  left: 0;
                  right: 0;
                  background: white;
                  padding: 1cm 0;
                  margin-bottom: 0;
                  border-bottom: 1px solid #ddd;
                  z-index: 1000;
              }
            ` : ''}
            ${footerPos === 'sticky' ? `
              @page { margin-bottom: 2cm; }
              footer.doc-footer {
                  position: fixed;
                  bottom: 0;
                  left: 0;
                  right: 0;
                  background: white;
                  padding: 0.5cm 0;
                  margin-top: 0;
                  border-top: 1px solid #ddd;
                  z-index: 1000;
              }
            ` : ''}
        }
    </style>
</head>
<body class="min-h-screen">
    <div class="markdown-body">
        ${renderedHeader ? `<header class="doc-header">${renderedHeader}</header>` : ''}
        <article>
            ${renderedContent}
        </article>
        ${renderedFooter ? `<footer class="doc-footer">${renderedFooter}</footer>` : ''}
    </div>

    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <script>
        mermaid.initialize({ 
            startOnLoad: false,
            theme: '${themeId === ThemeId.CYBER ? 'dark' : 'default'}',
            securityLevel: 'loose',
            fontFamily: '${fontFamily.split(',')[0].replace(/['"]/g, '')}'
        });
        
        const renderDiagrams = async () => {
            const blocks = document.querySelectorAll('pre code.language-mermaid');
            for (const block of blocks) {
                const pre = block.parentElement;
                const content = block.textContent;
                const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
                try {
                    const { svg } = await mermaid.render(id, content);
                    const div = document.createElement('div');
                    div.className = 'mermaid';
                    div.innerHTML = svg;
                    pre.replaceWith(div);
                } catch (err) {
                    console.error('Mermaid error:', err);
                }
            }
        };
        renderDiagrams();
    </script>
</body>
</html>
  `.trim();

  return htmlTemplate;
};
