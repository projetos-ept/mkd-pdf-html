
import React from 'react';
import { FileText, Info, Eraser } from 'lucide-react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

const Editor: React.FC<EditorProps> = ({ value, onChange, onClear }) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <FileText className="w-4 h-4" />
          Corpo do Documento
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onClear}
            className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-md transition-colors"
            title="Limpar texto"
          >
            <Eraser className="w-4 h-4" />
          </button>
          <div className="group relative">
             <Info className="w-4 h-4 text-gray-400 cursor-help" />
             <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-xl">
               Suporte a GFM, links e diagramas Mermaid. Use ```mermaid ... ``` para gráficos.
             </div>
          </div>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="# Digite seu Markdown aqui..."
        className="flex-1 p-4 w-full h-full resize-none font-mono text-sm focus:outline-none bg-slate-50 text-slate-800 leading-relaxed"
      />
    </div>
  );
};

export default Editor;
