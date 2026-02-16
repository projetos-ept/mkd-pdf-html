
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

  const isNotebook = themeId === ThemeId.NOTEBOOK;
  const bgColor = isNotebook ? '#fdfdf7' : (themeId === ThemeId.SEPIA ? '#f4ecd8' : '#ffffff');
  const textColor = themeId === ThemeId.SEPIA ? '#433422' : '#111827';
  const accentColor = isNotebook ? '#f43f5e' : (themeId === ThemeId.SEPIA ? '#8b5e3c' : '#2563eb');

  const notebookStyles = isNotebook ? `
    .markdown-body {
        background-color: ${bgColor};
        background-image: 
            linear-gradient(90deg, transparent 79px, #ffccd5 79px, #ffccd5 81px, transparent 81px),
            linear-gradient(#e5e7eb .1em, transparent .1em);
        background-size: 100% 1.5rem;
        line-height: 1.5rem !important;
        position: relative;
        padding-top: 3rem !important;
    }
    .markdown-body article > * {
        margin-top: 0 !important;
        margin-bottom: 1.5rem !important;
    }
    .markdown-body p, .markdown-body li {
        min-height: 1.5rem;
        margin-bottom: 1.5rem !important;
    }
    .markdown-body h1, .markdown-body h2, .markdown-body h3 {
        background: ${bgColor};
        display: inline-block;
        padding-right: 15px;
        line-height: 1.2;
        margin-top: 1.5rem !important;
        margin-bottom: 1.5rem !important;
    }
    .mermaid-rendered, .markdown-body img, .markdown-body table, .markdown-body pre, .markdown-body blockquote {
        background: ${bgColor};
        padding: 1.5rem;
        border-radius: 4px;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        margin-bottom: 1.5rem !important;
        border: 1px solid rgba(0,0,0,0.05);
        position: relative;
        z-index: 10;
    }
    .markdown-body ul, .markdown-body ol {
        margin-left: 2rem;
    }
  ` : '';

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documento Exportado - StaticMD</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Lora:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono&display=swap" rel="stylesheet">
    <style>
        :root { --accent: ${accentColor}; }
        body { 
            margin: 0; padding: 0; 
            font-family: ${fontFamily}; 
            font-size: ${fontSize}px;
            background-color: ${isNotebook ? '#f3f4f6' : bgColor}; 
            color: ${textColor};
            line-height: 1.6;
            scroll-behavior: smooth;
        }
        .markdown-body {
            max-width: 100%;
            padding: 2rem 1.5rem;
            margin: 0 auto;
            min-height: 100vh;
            background-color: ${bgColor};
        }
        @media (min-width: 768px) {
            .markdown-body { padding: 4rem; max-width: 21cm; box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25); }
        }
        
        ${notebookStyles}

        /* Typography Defaults */
        .markdown-body h1 { font-size: 2.5em; font-weight: 800; border-bottom: 3px solid var(--accent); }
        .markdown-body h2 { font-size: 1.8em; font-weight: 700; }
        .markdown-body h3 { font-size: 1.4em; font-weight: 700; }
        
        #toc-container {
            background: rgba(128,128,128,0.05);
            border: 1px solid rgba(128,128,128,0.1);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 3rem;
        }
        #toc-container h2 { margin-top: 0; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent); border: none; background: transparent; }
        #toc-list { list-style: none; padding: 0; margin: 0; }
        #toc-list li { margin: 0.5rem 0; }
        #toc-list a { text-decoration: none; color: inherit; opacity: 0.7; font-size: 0.9em; transition: opacity 0.2s; }
        #toc-list a:hover { opacity: 1; color: var(--accent); }
        .toc-h2 { margin-left: 0.5rem; }
        .toc-h3 { margin-left: 1.5rem; font-size: 0.85em !important; }

        .markdown-body table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; display: block; overflow-x: auto; }
        .markdown-body th, .markdown-body td { border: 1px solid rgba(128,128,128,0.2); padding: 0.75rem; text-align: left; }
        .markdown-body img { max-width: 100%; height: auto; border-radius: 8px; margin: 2rem auto; display: block; }
        
        header.doc-header { margin-bottom: 3rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(128,128,128,0.1); }
        footer.doc-footer { margin-top: 4rem; padding-top: 2rem; border-top: 1px solid rgba(128,128,128,0.1); font-size: 0.9em; opacity: 0.7; }

        @media print {
            body { background: white !important; color: black !important; }
            #toc-container { display: none; }
            .markdown-body { padding: 0; max-width: none; box-shadow: none !important; }
            ${headerPos === 'sticky' ? `header.doc-header { position: fixed; top: 0; left: 0; right: 0; background: white; padding: 1cm; border-bottom: 1px solid #eee; z-index: 100; }` : ''}
            ${footerPos === 'sticky' ? `footer.doc-footer { position: fixed; bottom: 0; left: 0; right: 0; background: white; padding: 0.5cm; border-top: 1px solid #eee; z-index: 100; }` : ''}
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
        mermaid.initialize({ 
            startOnLoad: false, 
            theme: 'default',
            fontFamily: '${fontFamily.split(',')[0]}'
        });

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
                    div.className = 'mermaid-rendered flex justify-center my-8';
                    div.innerHTML = svg;
                    pre.replaceWith(div);
                } catch (err) {
                    console.error("Mermaid error:", err);
                }
            }
        });
    </script>
</body>
</html>
  `.trim();
};
