import { Avatar } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import type { ProfessionalBasic } from '../../types/professional.types';
import { formatPhoneForDisplay } from '@/shared/utils/format-phone';
import { ProfessionalActions } from './professional-actions';

interface Props {
  professional: ProfessionalBasic;
}

export const ProfessionalsCard = ({ professional }: Props) => {
  return (
    <div className="relative group flex flex-col items-center text-center rounded-2xl border border-gray-100 bg-white p-5">
      {/* Avatar */}
      <div className="relative">
        <Avatar src={professional.avatarUrl} name={professional.displayName} className="size-16 text-lg border-2 border-white shadow-xs" />
        {professional.colorTheme && (
          <span
            className="absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-white shadow-xs"
            style={{ backgroundColor: professional.colorTheme }}
          />
        )}
      </div>

      {/* Name */}
      <h3 className="mt-3 text-xl font-semibold text-gray-900 line-clamp-1">{professional.displayName}</h3>

      {/* Email & Phone */}
      <div className="mt-2 flex flex-col gap-1.5 w-full text-sm text-gray-700">
        {professional.email && (
          <div className="flex items-center justify-center gap-1.5 truncate">
            <EnvelopeIcon className="size-4.5 text-gray-500 shrink-0" />
            <span className="truncate">{professional.email}</span>
          </div>
        )}
        {professional.phone && (
          <div className="flex items-center justify-center gap-1.5 truncate">
            <PhoneIcon className="size-4.5 text-gray-500 shrink-0" />
            <span>{formatPhoneForDisplay(professional.phone, professional.phoneCountryCode)}</span>
          </div>
        )}
      </div>

      {/* CTA Buttons */}
      <div className="mt-5 w-full flex gap-2">
        <Button variant="primary" fullWidth size="sm" iconPosition="left">
          Nueva Cita
        </Button>
        <ProfessionalActions professional={professional} />
      </div>
    </div>
  );
};
