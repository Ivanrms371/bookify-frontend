export const COLORS_KEY = ['BLUE', 'ORANGE', 'GREEN', 'PURPLE', 'RED', 'YELLOW', 'PINK'] as const;

export const COLORS = {
  BLUE: { light: '#93c5fd', dark: '#1e40af' },
  ORANGE: { light: '#fdba74', dark: '#9a3412' },
  GREEN: { light: '#86efac', dark: '#166534' },
  PURPLE: { light: '#d8b4fe', dark: '#6b21a8' },
  RED: { light: '#fca5a5', dark: '#991b1b' },
  YELLOW: { light: '#fde047', dark: '#854d0e' },
  PINK: { light: '#f9a8d4', dark: '#9d174d' },
} as const;

export type ThemeConfig = {
  id: string;
  name: string;
  accent: string;
  accentMuted: string;
  primary: string;
  bgPreview: string;
  text: string;
  border: string;
  hover: string;
  ring: string;
  recommend?: boolean;
};

export const THEMES: ThemeConfig[] = [
  {
    id: 'luxury',
    name: 'Luxury',
    accent: '#f59e0b',
    accentMuted: '#fffbeb',
    primary: 'bg-amber-500',
    bgPreview: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-300',
    hover: 'hover:border-amber-400',
    ring: 'ring-amber-500',
  },
  {
    id: 'vogue',
    name: 'Vogue',
    accent: '#ef4444',
    accentMuted: '#fef2f2',
    primary: 'bg-red-500',
    bgPreview: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-300',
    hover: 'hover:border-red-400',
    ring: 'ring-red-500',
  },
  {
    id: 'oasis',
    name: 'Oasis',
    accent: '#0d9488',
    accentMuted: '#f0fdfa',
    primary: 'bg-teal-600',
    bgPreview: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-300',
    hover: 'hover:border-teal-400',
    ring: 'ring-teal-600',
  },
  {
    id: 'organic',
    name: 'Organic',
    accent: '#059669',
    accentMuted: '#ecfdf5',
    primary: 'bg-emerald-600',
    bgPreview: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-300',
    hover: 'hover:border-emerald-400',
    ring: 'ring-emerald-600',
  },
  {
    id: 'savanna',
    name: 'Savanna',
    accent: '#65a30d',
    accentMuted: '#f7fee7',
    primary: 'bg-lime-600',
    bgPreview: 'bg-lime-50',
    text: 'text-lime-700',
    border: 'border-lime-300',
    hover: 'hover:border-lime-400',
    ring: 'ring-lime-600',
  },
  {
    id: 'glamour',
    name: 'Glamour',
    accent: '#db2777',
    accentMuted: '#fdf2f8',
    primary: 'bg-pink-600',
    bgPreview: 'bg-pink-50',
    text: 'text-pink-700',
    border: 'border-pink-300',
    hover: 'hover:border-pink-400',
    ring: 'ring-pink-600',
  },
  {
    id: 'electric',
    name: 'Electric',
    accent: '#3b82f6',
    accentMuted: '#eff6ff',
    primary: 'bg-blue-500',
    bgPreview: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-300',
    hover: 'hover:border-blue-400',
    ring: 'ring-blue-500',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    accent: '#334155',
    accentMuted: '#f8fafc',
    primary: 'bg-gray-800',
    bgPreview: 'bg-gray-50',
    text: 'text-gray-800',
    border: 'border-gray-400',
    hover: 'hover:border-gray-500',
    ring: 'ring-gray-600',
  },
  {
    id: 'bookify',
    name: 'Bookify',
    accent: '#4f46e5',
    accentMuted: '#eef2ff',
    primary: 'bg-indigo-600',
    bgPreview: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-300',
    hover: 'hover:border-indigo-400',
    ring: 'ring-indigo-600',
    recommend: true,
  },
];

export const DEFAULT_THEME_ID = 'bookify';
