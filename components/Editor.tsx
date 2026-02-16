
import React, { useRef } from 'react';
import { FileText, Eraser, Bold, Italic, Link as LinkIcon, List, Table, Activity, Image as ImageIcon } from 'lucide-react';

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

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative group">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1">
          <button onClick={() => insertText('**', '**')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors" title="Negrito"><Bold className="w-4 h-4" /></button>
          <button onClick={() => insertText('_', '_')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors" title="Itálico"><Italic className="w-4 h-4" /></button>
          <button onClick={() => insertText('[', '](https://)')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors" title="Link"><LinkIcon className="w-4 h-4" /></button>
          <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
          <button onClick={() => insertText('\n- ')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors" title="Lista"><List className="w-4 h-4" /></button>
          <button onClick={() => insertText('\n| Col 1 | Col 2 |\n| :--- | :--- |\n| Item | Valor |\n')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors" title="Tabela"><Table className="w-4 h-4" /></button>
          <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
          <button onClick={() => insertText('\n```mermaid\ngraph TD\n  A --> B\n```\n')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors" title="Diagrama Mermaid"><Activity className="w-4 h-4" /></button>
          <button onClick={() => insertText('![descrição](', ')')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors" title="Inserir Link de Imagem"><ImageIcon className="w-4 h-4" /></button>
        </div>
        <button onClick={onClear} className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition-colors" title="Limpar tudo"><Eraser className="w-4 h-4" /></button>
      </div>

      <div className="flex-1 relative flex flex-col">
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50/50 text-[10px] font-bold text-blue-400 uppercase tracking-tighter shrink-0">
          <FileText className="w-3 h-3" />
          <span>Editor Markdown</span>
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="# Comece a escrever seu documento..."
          className="flex-1 w-full p-4 md:p-6 focus:outline-none resize-none font-mono text-sm leading-relaxed text-slate-700 placeholder-slate-300 scrollbar-thin"
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default Editor;
