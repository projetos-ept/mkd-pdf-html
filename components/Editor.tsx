
import React from 'react';
import { FileText, Info } from 'lucide-react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <FileText className="w-4 h-4" />
          Markdown Input
        </div>
        <div className="group relative">
           <Info className="w-4 h-4 text-gray-400 cursor-help" />
           <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
             Suporte a GFM, links e diagramas Mermaid. Use ```mermaid ... ``` para gráficos.
           </div>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="# Digite seu Markdown aqui..."
        className="flex-1 p-4 w-full h-full resize-none font-mono text-sm focus:outline-none bg-slate-50 text-slate-800"
      />
    </div>
  );
};

export default Editor;
