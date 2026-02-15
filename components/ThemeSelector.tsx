
import React from 'react';
import { ThemeId, THEMES } from '../types';
import { Palette, Check } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="flex flex-col gap-2 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
        <Palette className="w-4 h-4" />
        Escolha o Tema
      </div>
      <div className="grid grid-cols-1 gap-2">
        {Object.values(THEMES).map((theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeChange(theme.id)}
            className={`
              flex items-center justify-between p-3 rounded-lg border-2 transition-all text-left
              ${currentTheme === theme.id 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-transparent bg-gray-50 text-gray-700 hover:bg-gray-100'}
            `}
          >
            <div className="flex flex-col">
              <span className="font-medium">{theme.name}</span>
              <span className="text-xs opacity-70">Otimizado para mobile</span>
            </div>
            {currentTheme === theme.id && <Check className="w-5 h-5 text-blue-500" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
