
import React, { useState } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import ThemeSelector from './components/ThemeSelector';
import DocumentSettings from './components/DocumentSettings';
import { ThemeId, FontId } from './types';
import { compileToHtml } from './services/compiler';
import { Download, Rocket, Layers, FileText } from 'lucide-react';

const INITIAL_MD = `# Relatório de Vendas 📈

Este documento demonstra o poder da exportação para **PDF**.

## Metas Atingidas
Os resultados deste trimestre superaram as expectativas iniciais em **15%**.

### Fluxo de Trabalho
\`\`\`mermaid
graph LR
    A[Lead] --> B(Conversão)
    B --> C{Pagamento}
    C -->|Sucesso| D[Cliente Feliz]
    C -->|Falha| E[Retry]
\`\`\`

---
*Documento gerado via StaticMD.*
`;

const INITIAL_HEADER = `**StaticMD** | Documento Oficial
---`;

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState(INITIAL_MD);
  const [headerMarkdown, setHeaderMarkdown] = useState(INITIAL_HEADER);
  const [theme, setTheme] = useState<ThemeId>(ThemeId.MODERN);
  const [fontFamily, setFontFamily] = useState<FontId>(FontId.SANS);
  const [fontSize, setFontSize] = useState<number>(16);
  const [isCompiling, setIsCompiling] = useState(false);

  const handleDownloadHtml = () => {
    setIsCompiling(true);
    try {
      const fullHtml = compileToHtml(markdown, theme);
      const blob = new Blob([fullHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `static-page-${theme}.html`;
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 overflow-x-hidden">
      {/* Print Styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-document, #printable-document * { visibility: visible; }
          #printable-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            background: white !important;
            color: black !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm print:hidden">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Layers className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight hidden sm:block">
            Static<span className="text-blue-600">MD</span> Compiler
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleExportPdf}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
          >
            <FileText className="w-4 h-4" />
            Exportar PDF
          </button>
          <button 
            onClick={handleDownloadHtml}
            disabled={isCompiling}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isCompiling ? '...' : 'Baixar HTML'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-73px)] overflow-hidden print:h-auto print:block">
        {/* Sidebar / Controls */}
        <aside className="w-full md:w-80 p-4 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col gap-4 overflow-y-auto print:hidden bg-gray-50/50">
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
          />
          
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
            <Rocket className="w-6 h-6 text-blue-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-900">Dica Pro</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                Ao exportar PDF, selecione "Salvar como PDF" no menu de impressão do navegador para melhores resultados.
              </p>
            </div>
          </div>
        </aside>

        {/* Editor & Preview Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 overflow-hidden print:block print:p-0">
          <div className="h-[40vh] lg:h-full print:hidden">
            <Editor 
              value={markdown} 
              onChange={setMarkdown} 
            />
          </div>
          <div className="h-[60vh] lg:h-full print:h-auto print:block">
            <Preview 
              markdown={markdown} 
              headerMarkdown={headerMarkdown}
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
