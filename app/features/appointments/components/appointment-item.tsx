import { Button, Card } from '@/shared/components/ui';
import { Text } from '@/shared/components/typography';
import { cn } from '@/shared/utils/cn';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { formatUYU } from '@/shared/utils/currency';
import type { Appointment } from '../types/appointments-types';
import { formatTime } from '../utils/date-helpers';

interface Props {
  appointment: Appointment;
}

const statusStyles = {
  CONFIRMED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  COMPLETED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
  NO_SHOW: 'bg-slate-100 text-slate-700 border-slate-200',
};

const statusLabels = {
  CONFIRMED: 'Confirmado',
  PENDING: 'Pendiente',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
  NO_SHOW: 'No asistió',
};

export const AppointmentItem = ({ appointment }: Props) => {
  const { customerName, customerPhone, serviceName, price, startsAt, endsAt, status, professionalName, notes } = appointment;

  return (
    <li className="bg-white rounded-lg p-5 shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="flex flex-col gap-1">
          <Text className="text-sm font-semibold text-gray-800">{customerName}</Text>
          <Text className="text-xs text-gray-500">{customerPhone}</Text>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <Text className={cn('text-xs px-2 py-1 font-semibold rounded-full', statusStyles[status])}>{statusLabels[status]}</Text>
          <Text className="text-xs text-gray-500">
            {formatTime(startsAt)} - {formatTime(endsAt)}
          </Text>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <Text className="text-sm font-medium text-gray-800">Profesional: {professionalName}</Text>
          <div className="flex gap-2">
            <Text className="text-sm font-medium text-gray-800">{serviceName}</Text>
            <Text className="text-sm font-medium">{formatUYU(price)}</Text>
          </div>
        </div>

        <Button variant="ghost" type="button" size="icon">
          <EllipsisHorizontalIcon className="size-5" />
        </Button>
      </div>
    </li>
  );
};
