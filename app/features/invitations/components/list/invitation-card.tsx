import { cn } from '@/shared/utils/cn';
import { Avatar, Button } from '@/shared/components/ui';
import { EnvelopeIcon, PhoneIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { isPast } from 'date-fns';
import type { Invitation } from '@/features/invitations/types/invitation.types';
import { formatPhoneForDisplay } from '@/shared/utils/format-phone';
import { InvitationActions } from './invitation-actions';

const STATUS_CONFIG = {
  PENDING: { label: 'Pendiente', className: 'bg-amber-50 text-amber-700' },
  ACCEPTED: { label: 'Aceptada', className: 'bg-emerald-50 text-emerald-700' },
  EXPIRED: { label: 'Expirada', className: 'bg-gray-100 text-gray-500' },
} as const;

interface Props {
  invitation: Invitation;
  onBookAppointment?: () => void;
}

export const InvitationCard = ({ invitation }: Props) => {
  const { name, email, phone } = invitation;

  return (
    <div className="relative group flex flex-col items-center text-center rounded-2xl border border-gray-100 bg-white p-5">
      <span className="absolute left-3 top-3 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-50 text-amber-600">Invitado</span>

      <div className="relative">
        <Avatar name={name} className="size-16 text-lg border-2 border-white shadow-xs" />
      </div>
      <h3 className="mt-3 text-xl font-semibold text-gray-900 line-clamp-1">{name}</h3>

      <div className="mt-3 flex flex-col gap-1.5 w-full text-sm text-gray-700">
        {email && (
          <div className="flex items-center justify-center gap-1.5 truncate">
            <EnvelopeIcon className="size-4.5 text-gray-500 shrink-0" />
            <span className="truncate">{email}</span>
          </div>
        )}
        {phone && (
          <div className="flex items-center justify-center gap-1.5 truncate">
            <PhoneIcon className="size-4.5 text-gray-500 shrink-0" />
            <span>{formatPhoneForDisplay(phone, 'UY')}</span>
          </div>
        )}
      </div>

      <div className="mt-5 w-full flex gap-2">
        <Button variant="primary" fullWidth size="sm" iconPosition="left">
          Reenviar Invitación
        </Button>
        <InvitationActions invitation={invitation} />
      </div>
    </div>
  );
};
