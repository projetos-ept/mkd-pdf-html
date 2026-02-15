
import React from 'react';
import { Settings, Type, PanelTop } from 'lucide-react';
import { FontId } from '../types';

interface DocumentSettingsProps {
  fontFamily: FontId;
  setFontFamily: (font: FontId) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  headerMarkdown: string;
  setHeaderMarkdown: (md: string) => void;
}

const DocumentSettings: React.FC<DocumentSettingsProps> = ({
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize,
  headerMarkdown,
  setHeaderMarkdown,
}) => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-1 text-sm font-semibold text-gray-500 uppercase tracking-wider">
        <Settings className="w-4 h-4" />
        Configurações do Documento
      </div>

      <div className="space-y-4">
        {/* Font Family */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
            <Type className="w-3 h-3" /> Família da Fonte
          </label>
          <select 
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value as FontId)}
            className="w-full p-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={FontId.SANS}>Sans Serif (Inter)</option>
            <option value={FontId.SERIF}>Serif (Lora)</option>
            <option value={FontId.MONO}>Monospace (JetBrains)</option>
          </select>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <label className="flex items-center justify-between text-xs font-medium text-gray-600">
            <span className="flex items-center gap-2"><Type className="w-3 h-3" /> Tamanho</span>
            <span className="text-blue-600 font-bold">{fontSize}px</span>
          </label>
          <input 
            type="range" 
            min="12" 
            max="28" 
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Custom Header */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
            <PanelTop className="w-3 h-3" /> Cabeçalho (Markdown)
          </label>
          <textarea
            value={headerMarkdown}
            onChange={(e) => setHeaderMarkdown(e.target.value)}
            placeholder="Ex: # Relatório Mensal\n**Data:** 01/2024"
            className="w-full p-2 h-24 text-xs font-mono bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentSettings;
