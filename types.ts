
export enum ThemeId {
  MODERN = 'modern',
  SEPIA = 'sepia',
  CYBER = 'cyber'
}

export enum FontId {
  SANS = 'Inter, sans-serif',
  SERIF = 'Lora, serif',
  MONO = 'JetBrains Mono, monospace'
}

export type ElementPosition = 'flow' | 'sticky';

export interface Template {
  id: string;
  name: string;
  header: string;
  footer: string;
  body?: string;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  bgClass: string;
  textClass: string;
  accentClass: string;
  fontFamily: string;
  containerClass: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  [ThemeId.MODERN]: {
    id: ThemeId.MODERN,
    name: 'Modern Clean',
    bgClass: 'bg-white',
    textClass: 'text-gray-900',
    accentClass: 'text-blue-600 border-blue-600',
    fontFamily: 'font-sans',
    containerClass: 'max-w-screen-md mx-auto p-6 md:p-12'
  },
  [ThemeId.SEPIA]: {
    id: ThemeId.SEPIA,
    name: 'Reader Sepia',
    bgClass: 'bg-[#f4ecd8]',
    textClass: 'text-[#433422]',
    accentClass: 'text-[#8b5e3c] border-[#8b5e3c]',
    fontFamily: 'font-serif',
    containerClass: 'max-w-screen-md mx-auto p-6 md:p-12 font-lora'
  },
  [ThemeId.CYBER]: {
    id: ThemeId.CYBER,
    name: 'Cyber Dark',
    bgClass: 'bg-slate-950',
    textClass: 'text-slate-200',
    accentClass: 'text-cyan-400 border-cyan-400',
    fontFamily: 'font-mono',
    containerClass: 'max-w-screen-md mx-auto p-6 md:p-12 font-mono'
  }
};
