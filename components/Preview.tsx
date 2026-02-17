
import React, { useEffect, useRef, useMemo, useState } from 'react';
import MarkdownIt from 'markdown-it';
import mermaid from 'mermaid';
import { ThemeId, THEMES, FontId, ElementPosition } from '../types.ts';
import { Eye, Clock, AlignLeft, ListTree, ChevronRight } from 'lucide-react';

// Sanitize Mermaid text by removing markdown bold/italic syntax
const sanitizeMermaidText = (text: string): string => {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')  // Remove **bold**
    .replace(/__(.+?)__/g, '$1')      // Remove __bold__
    .replace(/\*(.+?)\*/g, '$1')      // Remove *italic*
    .replace(/_(.+?)_/g, '$1');       // Remove _italic_
};

interface PreviewProps {
  markdown: string;
  headerMarkdown: string;
  footerMarkdown: string;
  themeId: ThemeId;
  fontFamily: FontId;
  fontSize: number;
  headerPos: ElementPosition;
  footerPos: ElementPosition;
  showOutlinePanel: boolean;
}

interface HeadingItem {
  id: string;
  text: string;
  level: number;
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
  footerPos,
  showOutlinePanel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const theme = THEMES[themeId];

  const stats = useMemo(() => {
    const text = (markdown || '') + ' ' + (headerMarkdown || '') + ' ' + (footerMarkdown || '');
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { words, readingTime };
  }, [markdown, headerMarkdown, footerMarkdown]);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: fontFamily.split(',')[0].replace(/['"]/g, ''), 
      flowchart: { useMaxWidth: true, htmlLabels: true }
    });
  }, [themeId, fontFamily]);

  useEffect(() => {
    let isMounted = true;
    const renderContent = async () => {
      if (!containerRef.current || !isMounted) return;

      const blocks = containerRef.current.querySelectorAll('pre code.language-mermaid');
      for (const block of Array.from(blocks) as HTMLElement[]) {
        const pre = block.parentElement;
        if (!pre || !isMounted) continue;
        const content = sanitizeMermaidText(block.textContent || '');
        const id = `mermaid-svg-${Math.random().toString(36).substr(2, 9)}`;
        try {
          const { svg } = await mermaid.render(id, content);
          if (!isMounted) return;
          const div = document.createElement('div');
          div.className = 'mermaid-rendered my-6 flex justify-center w-full overflow-hidden';
          div.innerHTML = svg;
          pre.replaceWith(div);
        } catch (err) {
          pre.classList.add('border-red-200', 'border', 'bg-red-50', 'p-2', 'rounded');
        }
      }

      // Only extract headings if outline panel is enabled
      if (showOutlinePanel) {
        const headingElements = containerRef.current.querySelectorAll('h1, h2, h3');
        const newHeadings: HeadingItem[] = [];
        headingElements.forEach((el, index) => {
          const id = `heading-${index}`;
          el.id = id;
          newHeadings.push({
            id,
            text: el.textContent || '',
            level: parseInt(el.tagName.replace('H', ''))
          });
        });
        setHeadings(newHeadings);
      } else {
        setHeadings([]);
      }
    };

    const timer = setTimeout(renderContent, 300);
    return () => { isMounted = false; clearTimeout(timer); };
  }, [markdown, themeId, fontFamily, fontSize, headerMarkdown, footerMarkdown, showOutlinePanel]); 

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el && scrollContainerRef.current) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsOutlineOpen(false);
    }
  };

  const renderedHeaderHtml = headerMarkdown ? md.render(headerMarkdown) : null;
  const renderedContentHtml = md.render(markdown || '');
  const renderedFooterHtml = footerMarkdown ? md.render(footerMarkdown) : null;

  const isNotebook = themeId === ThemeId.NOTEBOOK;

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative print:bg-white print:border-none print:shadow-none">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100 font-semibold text-gray-700 print:hidden z-20">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          <span>Live Preview</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider text-slate-400">
           <span className="flex items-center gap-1"><AlignLeft className="w-3 h-3" /> {stats.words} palavras</span>
           <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {stats.readingTime} min</span>
           {showOutlinePanel && (
             <button
               onClick={() => setIsOutlineOpen(!isOutlineOpen)}
               className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${isOutlineOpen ? 'bg-blue-600 text-white' : 'hover:bg-slate-200 text-slate-500'}`}
             >
               <ListTree className="w-3.5 h-3.5" /> Sumário
             </button>
           )}
        </div>
      </div>

      {isOutlineOpen && showOutlinePanel && (
        <div className="absolute top-[49px] right-0 bottom-0 w-64 bg-white/95 backdrop-blur-md shadow-xl border-l border-slate-200 z-30 p-4 overflow-y-auto animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Estrutura do Doc</h4>
            <button onClick={() => setIsOutlineOpen(false)} className="text-slate-400 hover:text-slate-600">×</button>
          </div>
          <nav className="space-y-1">
            {headings.length === 0 && <p className="text-[10px] text-slate-400 italic">Nenhum título encontrado...</p>}
            {headings.map((h, i) => (
              <button
                key={i}
                onClick={() => scrollToHeading(h.id)}
                className={`w-full text-left text-xs p-2 rounded hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-start gap-2 ${h.level === 1 ? 'font-bold' : h.level === 2 ? 'pl-4 opacity-80' : 'pl-8 opacity-60'}`}
              >
                <ChevronRight className={`w-3 h-3 mt-0.5 shrink-0 ${h.level > 1 ? 'hidden' : ''}`} />
                {h.text}
              </button>
            ))}
          </nav>
        </div>
      )}

      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-auto bg-slate-200 p-4 md:p-6 print:p-0 print:bg-white print:overflow-visible relative scrollbar-thin"
      >
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
            ${isNotebook ? 'notebook-layout' : ''}
          `}
        >
          <style>{`
            .notebook-layout {
              background-image:
                linear-gradient(90deg, transparent 48px, #ffccd5 48px, #ffccd5 50px, transparent 50px),
                linear-gradient(90deg, transparent calc(100% - 50px), #ffccd5 calc(100% - 50px), #ffccd5 calc(100% - 48px), transparent calc(100% - 48px)),
                linear-gradient(#e5e7eb .1em, transparent .1em);
              background-size: 100% 100%, 100% 100%, 100% 1.5rem;
              background-position: 0 0, 0 0, 0 2px;
              background-repeat: no-repeat, no-repeat, repeat;
              line-height: 1.5rem !important;
            }
            .notebook-layout .prose article > *, .notebook-layout .prose header, .notebook-layout .prose footer {
              margin-top: 0 !important;
              margin-bottom: 1.5rem !important;
              line-height: 1.5rem !important;
            }
            .notebook-layout .prose p, .notebook-layout .prose li {
              min-height: 1.5rem;
              line-height: 1.5rem !important;
              margin-top: 0 !important;
              margin-bottom: 1.5rem !important;
            }
            .notebook-layout .prose h1 {
              background: #fdfdf7;
              display: inline-block;
              padding-right: 15px;
              line-height: 3rem !important;
              margin-top: 1.5rem !important;
              margin-bottom: 1.5rem !important;
            }
            .notebook-layout .prose h2 {
              background: #fdfdf7;
              display: inline-block;
              padding-right: 15px;
              line-height: 3rem !important;
              margin-top: 1.5rem !important;
              margin-bottom: 1.5rem !important;
            }
            .notebook-layout .prose h3 {
              background: #fdfdf7;
              display: inline-block;
              padding-right: 15px;
              line-height: 1.5rem !important;
              margin-top: 1.5rem !important;
              margin-bottom: 1.5rem !important;
            }
            .notebook-layout .mermaid-rendered, .notebook-layout .prose img, .notebook-layout .prose table, .notebook-layout .prose pre, .notebook-layout .prose blockquote {
              background: #fdfdf7;
              padding: 1.5rem;
              border-radius: 4px;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
              margin-bottom: 1.5rem !important;
              border: 1px solid rgba(0,0,0,0.05);
              position: relative;
              z-index: 10;
            }
          `}</style>

          {renderedHeaderHtml && headerPos === 'sticky' && (
            <header className="sticky top-0 z-20 bg-inherit border-b border-gray-200 px-[50px] py-4 opacity-95 backdrop-blur-sm print:fixed print:top-0 print:left-0 print:right-0 print:w-full"
                    dangerouslySetInnerHTML={{ __html: renderedHeaderHtml }} />
          )}

          <div 
            ref={containerRef}
            className={`prose prose-slate max-w-none p-[50px] prose-headings:font-bold prose-img:rounded-xl prose-img:shadow-lg break-words`}
          >
            {renderedHeaderHtml && headerPos === 'flow' && (
              <header className="mb-4 pb-2 border-b border-gray-200 print:border-gray-300 opacity-80"
                      dangerouslySetInnerHTML={{ __html: renderedHeaderHtml }} />
            )}
            
            <article className="markdown-content w-full" dangerouslySetInnerHTML={{ __html: renderedContentHtml }} />

            {renderedFooterHtml && footerPos === 'flow' && (
              <footer className="mt-8 pt-4 border-t border-gray-200 print:border-gray-300 opacity-80 text-sm"
                      dangerouslySetInnerHTML={{ __html: renderedFooterHtml }} />
            )}
          </div>

          {renderedFooterHtml && footerPos === 'sticky' && (
            <footer className="sticky bottom-0 z-20 bg-inherit border-t border-gray-200 px-[50px] py-4 opacity-95 backdrop-blur-sm print:fixed print:bottom-0 print:left-0 print:right-0 print:w-full text-sm"
                    dangerouslySetInnerHTML={{ __html: renderedFooterHtml }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;
