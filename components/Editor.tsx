
import React, { useRef, useState } from 'react';
import { FileText, Eraser, Bold, Italic, Link as LinkIcon, List, Table, Activity, Image as ImageIcon, Loader2 } from 'lucide-react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

const Editor: React.FC<EditorProps> = ({ value, onChange, onClear }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

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

  const processImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Redução agressiva para maximizar espaço no localStorage
          const MAX_SIZE = 900; 
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
          }

          // Qualidade 0.6 equilibra peso e legibilidade
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
          resolve(compressedBase64);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageInsertion = async (file: File) => {
    setIsProcessingImage(true);
    try {
      const base64 = await processImage(file);
      const imgId = `img_${Math.random().toString(36).substr(2, 9)}`;
      // Inserção como HTML para permitir o redimensionador no preview
      const imageHtml = `\n<img src="${base64}" data-id="${imgId}" width="100%" style="border-radius: 8px; display: block; margin: 1rem auto;" />\n`;
      
      if (textareaRef.current) {
        const { selectionStart, selectionEnd } = textareaRef.current;
        const newValue = value.substring(0, selectionStart) + imageHtml + value.substring(selectionEnd);
        onChange(newValue);
      }
    } catch (err) {
      console.error("Erro ao processar imagem:", err);
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault(); 
        const file = items[i].getAsFile();
        if (file) {
          await handleImageInsertion(file);
        }
      }
    }
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
          <label className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors cursor-pointer" title="Colar Imagem (ou Upload)">
             <ImageIcon className="w-4 h-4" />
             <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
               const file = e.target.files?.[0];
               if (file) await handleImageInsertion(file);
             }} />
          </label>
        </div>
        <button onClick={onClear} className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition-colors" title="Limpar tudo"><Eraser className="w-4 h-4" /></button>
      </div>

      <div className="flex-1 relative flex flex-col">
        {isProcessingImage && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Otimizando Imagem...</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50/50 text-[10px] font-bold text-blue-400 uppercase tracking-tighter shrink-0">
          <FileText className="w-3 h-3" />
          <span>Editor Markdown (Dica: Use Ctrl+V para colar imagens)</span>
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={handlePaste}
          placeholder="# Comece a escrever seu documento..."
          className="flex-1 w-full p-4 md:p-6 focus:outline-none resize-none font-mono text-sm leading-relaxed text-slate-700 placeholder-slate-300 scrollbar-thin"
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default Editor;
