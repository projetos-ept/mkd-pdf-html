
import React, { useEffect, useRef } from 'react';
import MarkdownIt from 'markdown-it';
import mermaid from 'mermaid';
import { ThemeId, THEMES, FontId, ElementPosition } from '../types.ts';
import { Eye } from 'lucide-react';

interface PreviewProps {
  markdown: string;
  headerMarkdown: string;
  footerMarkdown: string;
  themeId: ThemeId;
  fontFamily: FontId;
  fontSize: number;
  headerPos: ElementPosition;
  footerPos: ElementPosition;
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const Preview: React.FC<PreviewProps> = ({ 
  markdown, 
  headerMarkdown, 
  footerMarkdown, 
  themeId, 
  fontFamily, 
  fontSize,
  headerPos,
  footerPos
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = THEMES[themeId];

  // Configura o Mermaid sempre que o tema ou fonte mudar
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: themeId === ThemeId.CYBER ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: fontFamily.split(',')[0].replace(/['"]/g, ''), 
      flowchart: { useMaxWidth: true, htmlLabels: true }
    });
  }, [themeId, fontFamily]);

  // Renderiza diagramas Mermaid quando o conteúdo ou estilo mudar
  useEffect(() => {
    let isMounted = true;
    
    const renderMermaid = async () => {
      if (!containerRef.current || !isMounted) return;
      
      const blocks = containerRef.current.querySelectorAll('pre code.language-mermaid');
      
      for (const block of Array.from(blocks) as HTMLElement[]) {
        const pre = block.parentElement;
        if (!pre || !isMounted) continue;
        
        const content = block.textContent || '';
        const id = `mermaid-svg-${Math.random().toString(36).substr(2, 9)}`;
        
        try {
          // Renderiza o SVG
          const { svg } = await mermaid.render(id, content);
          
          if (!isMounted) return;

          const div = document.createElement('div');
          div.className = 'mermaid-rendered my-6 flex justify-center w-full overflow-hidden';
          div.innerHTML = svg;
          
          // Garante que o SVG seja responsivo
          const svgEl = div.querySelector('svg');
          if (svgEl) {
            svgEl.style.maxWidth = '100%';
            svgEl.style.height = 'auto';
            svgEl.style.display = 'block';
          }
          
          pre.replaceWith(div);
        } catch (err) {
          console.error("Erro no Mermaid:", err);
          pre.classList.add('border-red-200', 'border', 'bg-red-50', 'p-2', 'rounded');
        }
      }
    };

    // Pequeno atraso para garantir que o DOM gerado pelo dangerouslySetInnerHTML esteja pronto
    const timer = setTimeout(renderMermaid, 200);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [markdown, themeId, fontFamily, fontSize, headerMarkdown, footerMarkdown]); 

  const renderedHeaderHtml = md.render(headerMarkdown || '');
  const renderedContentHtml = md.render(markdown);
  const renderedFooterHtml = md.render(footerMarkdown || '');

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden print:bg-white print:border-none print:shadow-none">
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100 font-semibold text-gray-700 print:hidden">
        <Eye className="w-4 h-4" />
        Visualização (Live)
      </div>
      <div className="flex-1 overflow-auto bg-gray-200 p-4 md:p-8 print:p-0 print:bg-white print:overflow-visible relative">
        <div 
          id="printable-document"
          style={{ 
            fontFamily: fontFamily,
            fontSize: `${fontSize}px`,
            minHeight: '29.7cm' 
          }}
          className={`
            ${theme.bgClass} ${theme.textClass} shadow-2xl mx-auto relative
            max-w-[21cm] transition-all duration-300 print:shadow-none print:max-w-none print:w-full
            break-words overflow-wrap-anywhere
          `}
        >
          {headerMarkdown && headerPos === 'sticky' && (
            <header className="sticky top-0 z-30 bg-inherit border-b border-gray-200 p-8 pb-4 opacity-95 backdrop-blur-sm print:fixed print:top-0 print:left-0 print:right-0 print:w-full" 
                    dangerouslySetInnerHTML={{ __html: renderedHeaderHtml }} />
          )}

          <div 
            ref={containerRef}
            className={`prose prose-slate max-w-none p-8 md:p-16 prose-headings:font-bold prose-img:rounded-xl prose-img:shadow-lg ${themeId === ThemeId.CYBER ? 'prose-invert' : ''} break-words`}
          >
            {headerMarkdown && headerPos === 'flow' && (
              <header className="mb-10 pb-4 border-b border-gray-200 print:border-gray-300 opacity-80" 
                      dangerouslySetInnerHTML={{ __html: renderedHeaderHtml }} />
            )}
            
            <article className="markdown-content w-full overflow-hidden" dangerouslySetInnerHTML={{ __html: renderedContentHtml }} />

            {footerMarkdown && footerPos === 'flow' && (
              <footer className="mt-16 pt-6 border-t border-gray-200 print:border-gray-300 opacity-80 text-sm" 
                      dangerouslySetInnerHTML={{ __html: renderedFooterHtml }} />
            )}
          </div>

          {footerMarkdown && footerPos === 'sticky' && (
            <footer className="sticky bottom-0 z-30 bg-inherit border-t border-gray-200 p-8 pt-4 opacity-95 backdrop-blur-sm print:fixed print:bottom-0 print:left-0 print:right-0 print:w-full text-sm" 
                    dangerouslySetInnerHTML={{ __html: renderedFooterHtml }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;
