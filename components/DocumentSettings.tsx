
import React, { useEffect, useState } from 'react';
import { Settings, Type, PanelTop, LayoutPanelTop, PanelBottom, Eraser, Anchor, Move, BookOpen } from 'lucide-react';
import { FontId, Template, ElementPosition } from '../types.ts';

interface DocumentSettingsProps {
  fontFamily: FontId;
  setFontFamily: (font: FontId) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  headerMarkdown: string;
  setHeaderMarkdown: (md: string) => void;
  footerMarkdown: string;
  setFooterMarkdown: (md: string) => void;
  setMarkdown: (md: string) => void;
  headerPos: ElementPosition;
  setHeaderPos: (pos: ElementPosition) => void;
  footerPos: ElementPosition;
  setFooterPos: (pos: ElementPosition) => void;
  onClearHeader: () => void;
  onClearFooter: () => void;
  showOutlinePanel?: boolean;
  setShowOutlinePanel?: (show: boolean) => void;
}

const DocumentSettings: React.FC<DocumentSettingsProps> = ({
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize,
  headerMarkdown,
  setHeaderMarkdown,
  footerMarkdown,
  setFooterMarkdown,
  setMarkdown,
  headerPos,
  setHeaderPos,
  footerPos,
  setFooterPos,
  onClearHeader,
  onClearFooter,
  showOutlinePanel = true,
  setShowOutlinePanel,
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('bioq');

  useEffect(() => {
    fetch('./templates.json')
      .then(res => res.json())
      .then(data => setTemplates(data))
      .catch(err => console.error("Error loading templates", err));
  }, []);

  const handleTemplateChange = (id: string) => {
    setSelectedTemplateId(id);
    const template = templates.find(t => t.id === id);
    if (template) {
      setHeaderMarkdown(template.header);
      setFooterMarkdown(template.footer);
      if (template.body !== undefined) {
        setMarkdown(template.body);
      }
    }
  };

  const PositionToggle = ({ value, onChange }: { value: ElementPosition, onChange: (v: ElementPosition) => void }) => (
    <div className="flex bg-slate-100 p-0.5 rounded-md self-end mb-1">
      <button 
        onClick={() => onChange('flow')}
        className={`px-2 py-0.5 text-[10px] rounded flex items-center gap-1 transition-all ${value === 'flow' ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-slate-400'}`}
        title="Padrão (Início/Fim)"
      >
        <Move className="w-2.5 h-2.5" /> Normal
      </button>
      <button 
        onClick={() => onChange('sticky')}
        className={`px-2 py-0.5 text-[10px] rounded flex items-center gap-1 transition-all ${value === 'sticky' ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-slate-400'}`}
        title="Fixo (Todas as Páginas)"
      >
        <Anchor className="w-2.5 h-2.5" /> Fixo
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-1 text-sm font-semibold text-gray-500 uppercase tracking-wider">
        <Settings className="w-4 h-4" />
        Configurações
      </div>

      <div className="space-y-4">
        {/* Font Selection */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
              <Type className="w-3 h-3" /> Fonte
            </label>
            <select 
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value as FontId)}
              className="w-full p-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              <option value={FontId.SANS}>Sans (Modern)</option>
              <option value={FontId.SERIF}>Serif (Reader)</option>
              <option value={FontId.MONO}>Mono (Code)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
              Tamanho
            </label>
            <input 
              type="number" 
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value) || 16)}
              className="w-full p-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Template Selector */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase">
            <LayoutPanelTop className="w-3 h-3" /> Modelos
          </label>
          <select 
            value={selectedTemplateId}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="w-full p-2 text-sm bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900 font-medium"
          >
            {templates.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="h-[1px] bg-gray-100 my-2"></div>

        {/* Outline Panel Toggle */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
            <BookOpen className="w-3 h-3" /> Sumário
          </label>
          <div className="flex bg-slate-100 p-0.5 rounded-md">
            <button
              onClick={() => setShowOutlinePanel?.(true)}
              className={`px-2 py-0.5 text-[10px] rounded transition-all ${showOutlinePanel ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-slate-400'}`}
              title="Mostrar sumário"
            >
              Mostrar
            </button>
            <button
              onClick={() => setShowOutlinePanel?.(false)}
              className={`px-2 py-0.5 text-[10px] rounded transition-all ${!showOutlinePanel ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-slate-400'}`}
              title="Ocultar sumário"
            >
              Ocultar
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
              <PanelTop className="w-3 h-3" /> Cabeçalho (Header)
            </label>
            <PositionToggle value={headerPos} onChange={setHeaderPos} />
          </div>
          <div className="relative group">
            <textarea
              value={headerMarkdown}
              onChange={(e) => setHeaderMarkdown(e.target.value)}
              placeholder="Markdown para o cabeçalho..."
              className="w-full p-2 h-16 text-[11px] font-mono bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 resize-none"
            />
            <button 
              onClick={onClearHeader}
              className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              title="Limpar cabeçalho"
            >
              <Eraser className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
              <PanelBottom className="w-3 h-3" /> Rodapé (Footer)
            </label>
            <PositionToggle value={footerPos} onChange={setFooterPos} />
          </div>
          <div className="relative group">
            <textarea
              value={footerMarkdown}
              onChange={(e) => setFooterMarkdown(e.target.value)}
              placeholder="Markdown para o rodapé..."
              className="w-full p-2 h-16 text-[11px] font-mono bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 resize-none"
            />
            <button 
              onClick={onClearFooter}
              className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              title="Limpar rodapé"
            >
              <Eraser className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentSettings;
