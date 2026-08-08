import { ScheduleHeader } from './schedule-header';
import { AppointmentItem } from './appointment-item';
import type { Appointment } from '../types/appointments-types';
import { Button } from '@/shared/components/ui';
import { StatusBadge } from './status-badge';
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';
import { formatDateDMY } from '@/shared/utils/date';
import { formatTime } from '../utils/date-helpers';
import { formatCurrency } from '@/shared/utils/currency';
import { AppointmentActions } from './ui/appointment-actions';

interface Props {
  appointments: Appointment[];
  selectedDate: Date;
  onNext: () => void;
  onPrevious: () => void;
  onToday: () => void;
}

export const AppointmentList = ({ appointments, selectedDate, onNext, onPrevious, onToday }: Props) => {
  if (appointments.length === 0) return null;

  return (
    <ul className="space-y-4">
      {appointments.map((appt) => (
        <li key={appt.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{appt.customerName}</h3>

              <div className="mt-1.5 text-sm text-gray-500 flex flex-col gap-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <CalendarDaysIcon className="size-4 text-gray-400" /> {formatDateDMY(appt.startsAt)}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <ClockIcon className="size-4 text-gray-400" /> {formatTime(appt.startsAt)} - {formatTime(appt.endsAt)}
                </span>
              </div>
            </div>

            <StatusBadge status={appt.status} />
          </div>

          <div className="mt-5 space-y-2.5 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Servicio</span>
              <span className="font-semibold text-gray-800">{appt.serviceName}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Precio</span>
              <span className="font-semibold text-gray-800">{formatCurrency(appt.price)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Teléfono</span>
              <span className="font-semibold text-gray-800">{appt.customerPhone}</span>
            </div>
          </div>

          <div className="mt-5 flex justify-end relative">
            <AppointmentActions appointment={appt} />
          </div>
        </li>
      ))}
    </ul>
  );
};
