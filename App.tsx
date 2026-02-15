
import React, { useState } from 'react';
import Editor from './components/Editor.tsx';
import Preview from './components/Preview.tsx';
import ThemeSelector from './components/ThemeSelector.tsx';
import DocumentSettings from './components/DocumentSettings.tsx';
import { ThemeId, FontId, ElementPosition } from './types.ts';
import { compileToHtml } from './services/compiler.ts';
import { Download, Layers, Trash2, Printer, Upload, CheckCircle, Loader2 } from 'lucide-react';

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
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDownloadHtml = () => {
    setIsCompiling(true);
    // Pequeno delay para feedback visual
    setTimeout(() => {
      try {
        const fullHtml = compileToHtml(markdown, theme, headerMarkdown, footerMarkdown, fontFamily, fontSize, headerPos, footerPos);
        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        const titleMatch = markdown.match(/^#\s+(.*)$/m);
        const fileName = titleMatch ? titleMatch[1].toLowerCase().replace(/\s+/g, '-') : 'documento-estatico';
        
        a.download = `${fileName}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (err) {
        console.error("HTML Error:", err);
      } finally {
        setIsCompiling(false);
      }
    }, 600);
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
    if (confirm("Deseja realmente apagar todo o conteúdo?")) {
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
          .app-header, aside, .editor-container, .no-print, button, label, .app-footer { display: none !important; }
          #root, main { display: block !important; height: auto !important; overflow: visible !important; }
          .preview-container { display: block !important; width: 100% !important; height: auto !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; background: white !important; }
          #printable-document { box-shadow: none !important; border: none !important; width: 100% !important; max-width: none !important; margin: 0 !important; padding: 0 !important; min-height: auto !important; }
          .prose { max-width: none !important; width: 100% !important; }
          img { max-width: 100% !important; page-break-inside: avoid; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <header className="app-header bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg">
            <Layers className="text-white w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-extrabold tracking-tight leading-none text-slate-800">
              Static<span className="text-blue-600">MD</span>
            </h1>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Compiler v2.1</span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <label className="cursor-pointer flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-xs font-bold uppercase tracking-tighter border border-transparent hover:border-blue-100">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Importar .md</span>
            <input type="file" accept=".md,.txt" onChange={handleFileUpload} className="hidden" />
          </label>
          
          <button 
            onClick={clearAll}
            className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all text-xs font-bold uppercase tracking-tighter"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Resetar</span>
          </button>

          <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>

          <button 
            onClick={handleExportPdf}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold hover:bg-slate-200 transition-all text-sm border border-slate-200"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Imprimir / PDF</span>
          </button>
          
          <button 
            onClick={handleDownloadHtml}
            disabled={isCompiling}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold shadow-md transition-all text-sm disabled:opacity-50 ${showSuccess ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            {isCompiling ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : showSuccess ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {showSuccess ? 'Sucesso!' : isCompiling ? 'Compilando...' : 'Baixar HTML'}
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden p-4 md:p-6 gap-6">
        {/* Painel Lateral de Controle */}
        <aside className="w-full md:w-[400px] flex flex-col gap-6 overflow-y-auto no-scrollbar pb-6 print:hidden">
          <div className="flex-1 min-h-[400px]">
            <Editor 
              value={markdown} 
              onChange={setMarkdown} 
              onClear={() => setMarkdown("")} 
            />
          </div>
          
          <ThemeSelector 
            currentTheme={theme} 
            onThemeChange={setTheme} 
          />
          
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

        {/* Área de Visualização */}
        <section className="flex-1 min-w-0 preview-container">
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
        </section>
      </main>

      <footer className="app-footer bg-white border-t border-slate-200 px-6 py-3 text-center text-[10px] text-slate-400 font-medium uppercase tracking-widest print:hidden">
        StaticMD - Documentos Otimizados para Mobile & Offline | Desenvolvido com carinho por LEDUK
      </footer>
    </div>
  );
};

export default App;
