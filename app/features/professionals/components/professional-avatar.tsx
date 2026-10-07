import { Avatar } from '@/shared/components/ui/avatar';
import type { ProfessionalBasic } from '../types/professional.types';

export const ProfessionalAvatar = ({ professional }: { professional: ProfessionalBasic }) => {
  return (
    <Avatar
      src={professional.avatarUrl}
      name={professional.name}
      size="lg"
      className="shrink-0 border border-gray-300 bg-gray-50 text-gray-800 font-display text-base leading-0"
    />
  );
};
