
import React, { useState } from 'react';
import Editor from './components/Editor.tsx';
import Preview from './components/Preview.tsx';
import ThemeSelector from './components/ThemeSelector.tsx';
import DocumentSettings from './components/DocumentSettings.tsx';
import { ThemeId, FontId, ElementPosition } from './types.ts';
import { compileToHtml } from './services/compiler.ts';
import { Download, Layers, Trash2, Printer, Upload } from 'lucide-react';

const INITIAL_HEADER = `### CETEP/LNAB
**Professor:** Lucas Batista | **Turma:** 3TACM1
**Disciplina:** Bioquímica
---`;

const INITIAL_FOOTER = `---
Criado por LEDUK`;

const INITIAL_MD = `# Bioquímica Metabólica: Ciclo da Glicose

O metabolismo é o conjunto de reações químicas que ocorrem em um organismo vivo para manter a vida.

### Principais Vias
1. **Glicólise**: Quebra da glicose para ATP.
2. **Glicogenólise**: Quebra do glicogênio.

\`\`\`mermaid
graph LR
    A[Glicose] --> B{Insulina}
    B --> C[Entrada na Célula]
    C --> D[Energia]
\`\`\`
`;

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState(INITIAL_MD);
  const [headerMarkdown, setHeaderMarkdown] = useState(INITIAL_HEADER);
  const [footerMarkdown, setFooterMarkdown] = useState(INITIAL_FOOTER);
  const [headerPos, setHeaderPos] = useState<ElementPosition>('flow');
  const [footerPos, setFooterPos] = useState<ElementPosition>('flow');
  const [theme, setTheme] = useState<ThemeId>(ThemeId.MODERN);
  const [fontFamily, setFontFamily] = useState<FontId>(FontId.SANS);
  const [fontSize, setFontSize] = useState<number>(16);
  const [isCompiling, setIsCompiling] = useState(false);

  const handleDownloadHtml = () => {
    setIsCompiling(true);
    try {
      const fullHtml = compileToHtml(markdown, theme, headerMarkdown, footerMarkdown, fontFamily, fontSize, headerPos, footerPos);
      const blob = new Blob([fullHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aula-bioquimica-lucas-batista.html`;
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setMarkdown(content);
    };
    reader.readAsText(file);
  };

  const clearAll = () => {
    if (confirm("Deseja realmente apagar todo o documento? Isso resetará o conteúdo atual.")) {
      setMarkdown("");
      setHeaderMarkdown("");
      setFooterMarkdown("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <style>{`
        @media print {
          @page { margin: 0; size: auto; }
          body { background: white !important; margin: 0 !important; }
          .app-header, aside, .editor-container, .no-print, button, label { display: none !important; }
          #root, main { display: block !important; height: auto !important; overflow: visible !important; }
          .preview-container { display: block !important; width: 100% !important; height: auto !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; background: white !important; }
          #printable-document { box-shadow: none !important; border: none !important; width: 100% !important; max-width: none !important; margin: 0 !important; padding: 0 !important; min-height: auto !important; }
          .prose { max-width: none !important; width: 100% !important; }
          img { max-width: 100% !important; page-break-inside: avoid; }
        }
      `}</style>

      <header className="app-header bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-inner">
            <Layers className="text-white w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-extrabold tracking-tight leading-none">
              Static<span className="text-blue-600">MD</span>
            </h1>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Compiler v2.0</span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <label className="cursor-pointer flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-xs font-bold uppercase tracking-tighter border border-transparent hover:border-blue-100">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Upload .md</span>
            <input type="file" accept=".md,.txt" onChange={handleFileUpload} className="hidden" />
          </label>
          
          <button 
            onClick={clearAll}
            className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all text-xs font-bold uppercase tracking-tighter"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Limpar</span>
          </button>

          <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>

          <button 
            onClick={handleExportPdf}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900 transition-all text-sm shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">PDF</span>
          </button>
          
          <button 
            onClick={handleDownloadHtml}
            disabled={isCompiling}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 transition-all text-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isCompiling ? 'Gerando...' : 'Exportar HTML'}
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
            setMarkdown={setMarkdown}
            headerPos={headerPos}
            setHeaderPos={setHeaderPos}
            footerPos={footerPos}
            setFooterPos={setFooterPos}
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
              headerPos={headerPos}
              footerPos={footerPos}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
