
import React, { useEffect, useRef } from 'react';
import MarkdownIt from 'markdown-it';
import mermaid from 'mermaid';
import { ThemeId, THEMES, FontId } from '../types.ts';
import { Eye } from 'lucide-react';

interface PreviewProps {
  markdown: string;
  headerMarkdown: string;
  footerMarkdown: string;
  themeId: ThemeId;
  fontFamily: FontId;
  fontSize: number;
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const Preview: React.FC<PreviewProps> = ({ markdown, headerMarkdown, footerMarkdown, themeId, fontFamily, fontSize }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = THEMES[themeId];

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: themeId === ThemeId.CYBER ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, sans-serif'
    });
  }, [themeId]);

  useEffect(() => {
    const renderMermaid = async () => {
      if (!containerRef.current) return;
      
      const blocks = containerRef.current.querySelectorAll('pre code.language-mermaid');
      // Fix: Cast the results of Array.from(blocks) to HTMLElement[] to resolve 'unknown' type errors
      for (const block of Array.from(blocks) as HTMLElement[]) {
        const pre = block.parentElement;
        if (pre) {
          const content = block.textContent || '';
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          try {
            const { svg } = await mermaid.render(id, content);
            const div = document.createElement('div');
            div.className = 'mermaid-rendered my-6 flex justify-center';
            div.innerHTML = svg;
            pre.replaceWith(div);
          } catch (err) {
            console.error("Mermaid error:", err);
            // Fallback: mantém o código se der erro
          }
        }
      }
    };

    const timer = setTimeout(renderMermaid, 200);
    return () => clearTimeout(timer);
  }, [markdown]);

  const renderedHeaderHtml = md.render(headerMarkdown || '');
  const renderedContentHtml = md.render(markdown);
  const renderedFooterHtml = md.render(footerMarkdown || '');

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden print:bg-white print:border-none print:shadow-none">
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100 font-semibold text-gray-700 print:hidden">
        <Eye className="w-4 h-4" />
        Visualização (WYSIWYG)
      </div>
      <div className="flex-1 overflow-auto bg-gray-200 p-4 md:p-8 print:p-0 print:bg-white print:overflow-visible">
        <div 
          id="printable-document"
          style={{ 
            fontFamily: fontFamily,
            fontSize: `${fontSize}px`,
            minHeight: '29.7cm' // Altura mínima A4
          }}
          className={`
            ${theme.bgClass} ${theme.textClass} shadow-2xl mx-auto
            max-w-[21cm] transition-all duration-300 print:shadow-none print:max-w-none print:w-full
          `}
        >
          <div 
            ref={containerRef}
            className={`prose prose-slate max-w-none p-8 md:p-16 prose-headings:font-bold prose-img:rounded-xl prose-img:shadow-lg ${themeId === ThemeId.CYBER ? 'prose-invert' : ''}`}
          >
            {headerMarkdown && (
              <header className="mb-10 pb-4 border-b border-gray-200 print:border-gray-300 opacity-80" 
                      dangerouslySetInnerHTML={{ __html: renderedHeaderHtml }} />
            )}
            
            <article className="markdown-content" dangerouslySetInnerHTML={{ __html: renderedContentHtml }} />

            {footerMarkdown && (
              <footer className="mt-16 pt-6 border-t border-gray-200 print:border-gray-300 opacity-80 text-sm" 
                      dangerouslySetInnerHTML={{ __html: renderedFooterHtml }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
