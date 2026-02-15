
import React, { useState } from 'react';
import Editor from './components/Editor.tsx';
import Preview from './components/Preview.tsx';
import ThemeSelector from './components/ThemeSelector.tsx';
import DocumentSettings from './components/DocumentSettings.tsx';
import { ThemeId, FontId } from './types.ts';
import { compileToHtml } from './services/compiler.ts';
import { Download, Rocket, Layers, FileText, Image as ImageIcon } from 'lucide-react';

const INITIAL_MD = `# Projeto StaticMD 🚀

Este documento demonstra o poder da personalização total.

## Suporte a Imagens
![Exemplo de Imagem](https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=1000)

### Metas Atingidas
Os resultados deste trimestre superaram as expectativas iniciais em **15%**.

\`\`\`mermaid
graph LR
    A[MD] --> B(Compilador)
    B --> C{Formato}
    C -->|PDF| D[Documento Físico]
    C -->|HTML| E[Página Web]
\`\`\`

---
*Escrito em Markdown.*
`;

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState(INITIAL_MD);
  const [headerMarkdown, setHeaderMarkdown] = useState("");
  const [footerMarkdown, setFooterMarkdown] = useState("");
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
      a.download = `static-doc-${theme}.html`;
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
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #root, #root * { visibility: hidden !important; }
          #printable-document, #printable-document * { 
            visibility: visible !important; 
          }
          #printable-document {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
          }
          header, aside, .no-print { display: none !important; }
          img { max-width: 100% !important; page-break-inside: avoid; }
        }
      `}</style>

      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm print:hidden">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Layers className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight hidden sm:block">
            Static<span className="text-blue-600">MD</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleExportPdf}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all text-sm"
          >
            <FileText className="w-4 h-4 text-red-500" />
            Exportar PDF
          </button>
          <button 
            onClick={handleDownloadHtml}
            disabled={isCompiling}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all text-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isCompiling ? 'Gerando...' : 'Download HTML'}
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-73px)] overflow-hidden print:h-auto print:block">
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
            footerMarkdown={footerMarkdown}
            setFooterMarkdown={setFooterMarkdown}
          />
          
          <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex gap-3">
            <ImageIcon className="w-6 h-6 text-green-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-900">Renderização Ativa</p>
              <p className="text-[11px] text-green-700 leading-relaxed">
                Suporte nativo para imagens, links e diagramas Mermaid em tempo real.
              </p>
            </div>
          </div>
        </aside>

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
