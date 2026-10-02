import { Avatar } from '@/shared/components/ui/avatar';
import type { ProfessionalBasic } from '../types/professional.types';

const themes: Record<string, string> = {
  red: 'bg-red-50 border-red-200 text-red-700',
  orange: 'bg-orange-50 border-orange-200 text-orange-700',
  amber: 'bg-amber-50 border-amber-200 text-amber-700',
  lime: 'bg-lime-50 border-lime-200 text-lime-700',
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  teal: 'bg-teal-50 border-teal-200 text-teal-700',
  cyan: 'bg-cyan-50 border-cyan-200 text-cyan-700',
  blue: 'bg-blue-50 border-blue-200 text-blue-700',
  indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
  violet: 'bg-violet-50 border-violet-200 text-violet-700',
  purple: 'bg-purple-50 border-purple-200 text-purple-700',
  pink: 'bg-pink-50 border-pink-200 text-pink-700',
  green: 'bg-green-50 border-green-200 text-green-700',
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  gray: 'bg-gray-50 border-gray-200 text-gray-700',
};
export const ProfessionalAvatar = ({ professional }: { professional: ProfessionalBasic }) => {
  const color = professional.colorTheme?.replace(/^bg-/, '').replace(/-\d+$/, '').toLowerCase() ?? 'blue';
  return (
    <Avatar src={professional.avatarUrl} name={professional.name} size="lg" className={`shrink-0 border ${themes[color] ?? themes.blue}`} />
  );
};
