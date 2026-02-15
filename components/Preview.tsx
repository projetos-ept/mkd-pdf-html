
import React, { useEffect, useRef } from 'react';
import MarkdownIt from 'markdown-it';
import mermaid from 'mermaid';
import { ThemeId, THEMES, FontId } from '../types';
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
      startOnLoad: true,
      theme: themeId === ThemeId.CYBER ? 'dark' : 'default',
      securityLevel: 'loose',
    });
  }, [themeId]);

  useEffect(() => {
    const processMermaid = () => {
      const blocks = containerRef.current?.querySelectorAll('pre code.language-mermaid');
      blocks?.forEach((block) => {
        const pre = block.parentElement;
        if (pre) {
          const div = document.createElement('div');
          div.className = 'mermaid';
          div.textContent = block.textContent;
          pre.replaceWith(div);
        }
      });
      mermaid.contentLoaded();
    };

    const timer = setTimeout(processMermaid, 150);
    return () => clearTimeout(timer);
  }, [markdown, headerMarkdown, footerMarkdown]);

  const renderedHeaderHtml = md.render(headerMarkdown || '');
  const renderedContentHtml = md.render(markdown);
  const renderedFooterHtml = md.render(footerMarkdown || '');

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden print:shadow-none print:border-none">
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100 font-semibold text-gray-700 print:hidden">
        <Eye className="w-4 h-4" />
        Visualização em Tempo Real
      </div>
      <div className="flex-1 overflow-auto bg-gray-100 p-4 md:p-8 print:p-0 print:bg-white print:overflow-visible">
        <div 
          id="printable-document"
          style={{ 
            fontFamily: fontFamily,
            fontSize: `${fontSize}px`
          }}
          className={`
            ${theme.bgClass} ${theme.textClass} shadow-2xl rounded-lg
            min-h-full transition-all duration-300 print:shadow-none print:rounded-none
          `}
        >
          <div 
            ref={containerRef}
            className={`prose prose-slate max-w-none p-6 md:p-12 prose-headings:font-bold prose-img:rounded-xl prose-img:shadow-lg ${themeId === ThemeId.CYBER ? 'prose-invert' : ''}`}
          >
            {headerMarkdown && (
              <header className="mb-8 pb-4 border-b border-gray-200 print:border-gray-300 opacity-80" 
                      dangerouslySetInnerHTML={{ __html: renderedHeaderHtml }} />
            )}
            
            <article dangerouslySetInnerHTML={{ __html: renderedContentHtml }} />

            {footerMarkdown && (
              <footer className="mt-12 pt-4 border-t border-gray-200 print:border-gray-300 opacity-80 text-sm" 
                      dangerouslySetInnerHTML={{ __html: renderedFooterHtml }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
