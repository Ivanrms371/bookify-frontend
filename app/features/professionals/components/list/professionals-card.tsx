import type { ProfessionalBasic } from '../../types/professional.types';
import { formatPhoneForDisplay } from '@/shared/utils/format-phone';
import { Badge } from '@/shared/components/ui/badge';
import { ProfessionalAvatar } from '../professional-avatar';
import { ProfessionalActions } from './professional-actions';

export const ProfessionalsCard = ({ professional }: { professional: ProfessionalBasic }) => (
  <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
    <ProfessionalAvatar professional={professional} />
    <div className="min-w-0 flex-1 space-y-1">
      <h3 className="truncate font-semibold text-gray-900">{professional.name}</h3>
      {professional.email && <p className="truncate text-sm text-gray-500">{professional.email}</p>}
      {professional.phoneNumber && (
        <p className="text-sm text-gray-500">{formatPhoneForDisplay(professional.phoneNumber, professional.phoneCountryCode ?? '')}</p>
      )}
      <Badge variant={professional.isActive ? 'green' : 'gray'}>{professional.isActive ? 'Activo' : 'Inactivo'}</Badge>
    </div>
    <ProfessionalActions professional={professional} />
  </div>
);
