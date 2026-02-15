
import React, { useEffect, useState } from 'react';
import { Settings, Type, PanelTop, LayoutPanelTop, PanelBottom } from 'lucide-react';
import { FontId, Template } from '../types.ts';

interface DocumentSettingsProps {
  fontFamily: FontId;
  setFontFamily: (font: FontId) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  headerMarkdown: string;
  setHeaderMarkdown: (md: string) => void;
  footerMarkdown: string;
  setFooterMarkdown: (md: string) => void;
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
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('blank');

  useEffect(() => {
    // Using relative path for the fetch
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
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-1 text-sm font-semibold text-gray-500 uppercase tracking-wider">
        <Settings className="w-4 h-4" />
        Personalização
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
              className="w-full p-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
            >
              <option value={FontId.SANS}>Sans</option>
              <option value={FontId.SERIF}>Serif</option>
              <option value={FontId.MONO}>Mono</option>
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
              className="w-full p-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
            />
          </div>
        </div>

        {/* Template Selector */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase">
            <LayoutPanelTop className="w-3 h-3" /> Modelos Predefinidos
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

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
            Customização Manual
          </label>
          
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
              <PanelTop className="w-3 h-3" /> Header (MD)
            </label>
            <textarea
              value={headerMarkdown}
              onChange={(e) => setHeaderMarkdown(e.target.value)}
              className="w-full p-2 h-16 text-[11px] font-mono bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
              <PanelBottom className="w-3 h-3" /> Footer (MD)
            </label>
            <textarea
              value={footerMarkdown}
              onChange={(e) => setFooterMarkdown(e.target.value)}
              className="w-full p-2 h-16 text-[11px] font-mono bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentSettings;
