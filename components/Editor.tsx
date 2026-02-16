
import React, { useRef } from 'react';
import { FileText, Info, Eraser, Bold, Italic, Link as LinkIcon, List, Table, Activity } from 'lucide-react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

const Editor: React.FC<EditorProps> = ({ value, onChange, onClear }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = '') => {
    if (!textareaRef.current) return;
    const { selectionStart, selectionEnd } = textareaRef.current;
    const selectedText = value.substring(selectionStart, selectionEnd);
    const newValue = value.substring(0, selectionStart) + before + selectedText + after + value.substring(selectionEnd);
    onChange(newValue);
    
    // Devolve o foco e ajusta seleção
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          selectionStart + before.length,
          selectionEnd + before.length
        );
      }
    }, 10);
  };

  const toolbarButtons = [
    { icon: <Bold className="w-3.5 h-3.5" />, title: 'Negrito', action: () => insertText('**', '**') },
    { icon: <Italic className="w-3.5 h-3.5" />, title: 'Itálico', action: () => insertText('_', '_') },
    { icon: <LinkIcon className="w-3.5 h-3.5" />, title: 'Link', action: () => insertText('[', '](url)') },
    { icon: <List className="w-3.5 h-3.5" />, title: 'Lista', action: () => insertText('\n- ') },
    { icon: <Table className="w-3.5 h-3.5" />, title: 'Tabela', action: () => insertText('\n| Col 1 | Col 2 |\n| :--- | :--- |\n| Val 1 | Val 2 |\n') },
    { icon: <Activity className="w-3.5 h-3.5" />, title: 'Mermaid', action: () => insertText('\n```mermaid\ngraph TD\n  A[Início] --> B(Processo)\n```\n') },
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">Conteúdo</span>
        </div>
        
        {/* Toolbar */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
          {toolbarButtons.map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.action}
              className="p-1.5 hover:bg-blue-50 text-gray-500 hover:text-blue-600 rounded-md transition-colors"
              title={btn.title}
            >
              {btn.icon}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onClear}
            className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-md transition-colors"
            title="Limpar texto"
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="# Comece a escrever seu material educativo..."
        className="flex-1 p-4 w-full h-full resize-none font-mono text-sm focus:outline-none bg-white text-slate-800 leading-relaxed placeholder:text-slate-300 scrollbar-thin"
      />
    </div>
  );
};

export default Editor;
