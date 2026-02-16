
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
    <title>Documento Estático - StaticMD</title>
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
            line-height: 1.6;
            background-color: ${theme.bgClass === 'bg-white' ? '#ffffff' : (theme.bgClass === 'bg-[#f4ecd8]' ? '#f4ecd8' : '#020617')};
            color: ${theme.textClass === 'text-gray-900' ? '#111827' : (theme.textClass === 'text-[#433422]' ? '#433422' : '#e2e8f0')};
        }
        
        .markdown-body {
            max-width: 100%;
            padding: 2rem;
            margin: 0 auto;
        }
        @media (min-width: 768px) {
            .markdown-body { padding: 4rem; max-width: 21cm; }
        }

        .markdown-body h1 { font-size: 2.25em; font-weight: 700; margin-bottom: 0.5em; border-bottom: 2px solid var(--accent-color); padding-bottom: 0.2em; }
        .markdown-body h2 { font-size: 1.875em; font-weight: 600; margin-top: 1.5em; margin-bottom: 0.5em; }
        .markdown-body h3 { font-size: 1.5em; font-weight: 600; margin-top: 1.2em; margin-bottom: 0.4em; }
        .markdown-body p { margin-bottom: 1em; text-align: justify; }
        .markdown-body blockquote { border-left: 4px solid #cbd5e1; padding-left: 1rem; font-style: italic; margin: 1.5rem 0; color: #64748b; }
        .markdown-body code { background: rgba(0,0,0,0.05); padding: 0.2rem 0.4rem; border-radius: 4px; font-family: 'JetBrains Mono', monospace; }
        .markdown-body pre { background: #1e293b; color: #f8fafc; padding: 1rem; border-radius: 8px; overflow-x: auto; margin-bottom: 1rem; }
        .markdown-body table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; display: block; overflow-x: auto; }
        .markdown-body th, .markdown-body td { border: 1px solid #cbd5e1; padding: 0.5rem; text-align: left; min-width: 120px; }
        
        #toc-container {
            background: rgba(0,0,0,0.03);
            border: 1px solid rgba(0,0,0,0.1);
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 3rem;
        }
        #toc-container h2 { margin-top: 0; font-size: 1.2rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent-color); }
        #toc-list { list-style: none; padding: 0; margin: 0; }
        #toc-list li { margin: 0.5rem 0; }
        #toc-list a { text-decoration: none; color: inherit; opacity: 0.8; transition: opacity 0.2s; }
        #toc-list a:hover { opacity: 1; color: var(--accent-color); }
        .toc-h2 { margin-left: 1rem !important; font-size: 0.9em; }
        .toc-h3 { margin-left: 2rem !important; font-size: 0.85em; }

        header.doc-header { margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(0,0,0,0.1); }
        footer.doc-footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid rgba(0,0,0,0.1); font-size: 0.85em; opacity: 0.8; }

        .mermaid { margin: 2rem 0; display: flex; justify-content: center; width: 100%; }
        
        @media print {
            body { background: white !important; color: black !important; }
            #toc-container { display: none; }
            .markdown-body { padding: 0; max-width: none; }
            ${headerPos === 'sticky' ? `header.doc-header { position: fixed; top: 0; left: 0; right: 0; background: white; padding: 1cm; border-bottom: 1px solid #ddd; z-index: 1000; }` : ''}
            ${footerPos === 'sticky' ? `footer.doc-footer { position: fixed; bottom: 0; left: 0; right: 0; background: white; padding: 0.5cm; border-top: 1px solid #ddd; z-index: 1000; }` : ''}
        }
    </style>
</head>
<body>
    <div class="markdown-body">
        ${renderedHeader ? `<header class="doc-header">${renderedHeader}</header>` : ''}
        
        <nav id="toc-container">
            <h2>Sumário</h2>
            <ul id="toc-list"></ul>
        </nav>

        <article id="main-content">
            ${renderedContent}
        </article>
        
        ${renderedFooter ? `<footer class="doc-footer">${renderedFooter}</footer>` : ''}
    </div>

    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <script>
        // Mermaid Init
        mermaid.initialize({ 
            startOnLoad: false,
            theme: '${themeId === ThemeId.CYBER ? 'dark' : 'default'}',
            securityLevel: 'loose'
        });
        
        // TOC and Mermaid Render
        window.addEventListener('DOMContentLoaded', async () => {
            const content = document.getElementById('main-content');
            const tocList = document.getElementById('toc-list');
            const headings = content.querySelectorAll('h1, h2, h3');
            
            if (headings.length < 2) {
                document.getElementById('toc-container').style.display = 'none';
            }

            headings.forEach((h, i) => {
                const id = 'section-' + i;
                h.id = id;
                const li = document.createElement('li');
                li.className = 'toc-' + h.tagName.toLowerCase();
                const a = document.createElement('a');
                a.href = '#' + id;
                a.textContent = h.textContent;
                li.appendChild(a);
                tocList.appendChild(li);
            });

            const mermaidBlocks = document.querySelectorAll('pre code.language-mermaid');
            for (const block of mermaidBlocks) {
                const pre = block.parentElement;
                const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
                try {
                    const { svg } = await mermaid.render(id, block.textContent);
                    const div = document.createElement('div');
                    div.className = 'mermaid';
                    div.innerHTML = svg;
                    pre.replaceWith(div);
                } catch (err) {}
            }
        });
    </script>
</body>
</html>
  `.trim();

  return htmlTemplate;
};
