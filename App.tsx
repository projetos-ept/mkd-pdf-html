
import React, { useState } from 'react';
import Editor from './components/Editor.tsx';
import Preview from './components/Preview.tsx';
import ThemeSelector from './components/ThemeSelector.tsx';
import DocumentSettings from './components/DocumentSettings.tsx';
import { ThemeId, FontId } from './types.ts';
import { compileToHtml } from './services/compiler.ts';
import { Download, Layers, Trash2, Printer } from 'lucide-react';

const INITIAL_HEADER = `### Projeto de Inovação Digital
**Instituição:** Tech Labs | **Setor:** Pesquisa`;

const INITIAL_FOOTER = `---
*Gerado via StaticMD Compiler - 2024*
Página 1`;

const INITIAL_MD = `# Documentação de Arquitetura 🏗️

Este documento descreve o fluxo de dados da nossa nova plataforma estática.

## Visão Geral
A plataforma converte arquivos **Markdown** em páginas **HTML5** leves e independentes.

### Fluxo de Compilação
Abaixo o diagrama de como os dados são processados:

\`\`\`mermaid
graph LR
    A[Markdown Source] --> B{Processador}
    B -->|Estilos| C[Preview]
    B -->|Assets| D[HTML Estático]
    D --> E[PDF Export]
\`\`\`

---
## Referências
- Documentação Mermaid
- Markdown Guide
`;

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState(INITIAL_MD);
  const [headerMarkdown, setHeaderMarkdown] = useState(INITIAL_HEADER);
  const [footerMarkdown, setFooterMarkdown] = useState(INITIAL_FOOTER);
  const [theme, setTheme] = useState<ThemeId>(ThemeId.MODERN);
  const [fontFamily, setFontFamily] = useState<FontId>(FontId.SANS);
  const [fontSize, setFontSize] = useState<number>(16);
  const [isCompiling, setIsCompiling] = useState(false);

  const handleDownloadHtml = () => {
    setIsCompiling(true);
    try {
      const fullHtml = compileToHtml(markdown, theme, headerMarkdown, footerMarkdown, fontFamily, fontSize);
      const blob = new Blob([fullHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `documento-${theme}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("HTML Error:", err);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleExportPdf = () => {
    window.print();
  };

  const clearAll = () => {
    if (confirm("Deseja realmente apagar todo o documento?")) {
      setMarkdown("");
      setHeaderMarkdown("");
      setFooterMarkdown("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <style>{`
        @media print {
          @page {
            margin: 1cm;
            size: auto;
          }
          body { 
            background: white !important; 
            margin: 0 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .app-header, aside, .editor-container, .no-print, button { 
            display: none !important; 
          }
          #root, main {
            display: block !important;
            height: auto !important;
            overflow: visible !important;
          }
          .preview-container {
            display: block !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            background: white !important;
          }
          #printable-document {
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            min-height: auto !important;
          }
          .prose {
            max-width: none !important;
            width: 100% !important;
          }
          img {
            max-width: 100% !important;
            page-break-inside: avoid;
          }
        }
      `}</style>

      <header className="app-header bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-inner">
            <Layers className="text-white w-5 h-5" />
          </div>
          <h1 className="text-lg font-extrabold tracking-tight">
            Static<span className="text-blue-600">MD</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={clearAll}
            className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all text-xs font-bold uppercase tracking-tighter"
          >
            <Trash2 className="w-4 h-4" />
            Limpar
          </button>
          <div className="h-6 w-[1px] bg-slate-200"></div>
          <button 
            onClick={handleExportPdf}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900 transition-all text-sm shadow-md"
          >
            <Printer className="w-4 h-4" />
            Exportar PDF
          </button>
          <button 
            onClick={handleDownloadHtml}
            disabled={isCompiling}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 transition-all text-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isCompiling ? 'Gerando...' : 'HTML Estático'}
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-73px)] overflow-hidden print:h-auto print:block">
        <aside className="w-full md:w-80 p-4 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col gap-4 overflow-y-auto print:hidden bg-slate-50">
          <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
          
          <DocumentSettings 
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            fontSize={fontSize}
            setFontSize={setFontSize}
            headerMarkdown={headerMarkdown}
            setHeaderMarkdown={setHeaderMarkdown}
            footerMarkdown={footerMarkdown}
            setFooterMarkdown={setFooterMarkdown}
            onClearHeader={() => setHeaderMarkdown("")}
            onClearFooter={() => setFooterMarkdown("")}
          />
        </aside>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 overflow-hidden print:block print:p-0">
          <div className="editor-container h-[40vh] lg:h-full print:hidden">
            <Editor 
              value={markdown} 
              onChange={setMarkdown}
              onClear={() => setMarkdown("")}
            />
          </div>
          <div className="preview-container h-[60vh] lg:h-full print:h-auto print:block">
            <Preview 
              markdown={markdown} 
              headerMarkdown={headerMarkdown}
              footerMarkdown={footerMarkdown}
              themeId={theme} 
              fontFamily={fontFamily}
              fontSize={fontSize}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
