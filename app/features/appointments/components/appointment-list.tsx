import { appointmentDisplayDate, appointmentDisplayTime } from '../utils/appointment-display';
import type { Appointment } from '../types/appointments-types';
import { StatusBadge } from './status-badge';
import { formatCurrency } from '@/shared/utils/currency';
import { formatPhoneForDisplay } from '@/shared/utils/format-phone';
import { AppointmentActions } from './ui/appointment-actions';
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';

interface Props {
  appointments: Appointment[];
}

export const AppointmentList = ({ appointments }: Props) => {
  if (appointments.length === 0) return null;

  return (
    <ul className="space-y-4">
      {appointments.map((appt) => (
        <li key={appt.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="min-w-0 break-words font-semibold text-gray-900">{appt.customerName}</h3>
                <StatusBadge status={appt.status} />
              </div>
              <div className="mt-1.5 flex flex-row flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <CalendarDaysIcon className="size-4 shrink-0 text-gray-400" /> {appointmentDisplayDate(appt.startsAt, appt.timeZone)}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <ClockIcon className="size-4 shrink-0 text-gray-400" /> {appointmentDisplayTime(appt.startsAt, appt.timeZone)} -{' '}
                  {appointmentDisplayTime(appt.endsAt, appt.timeZone)}
                </span>
              </div>
            </div>
            <div className="shrink-0">
              <AppointmentActions appointment={appt} />
            </div>
          </div>

          <div className="mt-5 space-y-2.5 text-sm">
            <div className="flex items-start justify-between gap-3">
              <span className="text-gray-500 font-medium">Servicio</span>
              <span className="min-w-0 break-words text-right font-semibold text-gray-800">{appt.serviceName}</span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="text-gray-500 font-medium">Precio</span>
              <span className="min-w-0 break-words text-right font-semibold text-gray-800">{formatCurrency(appt.price)}</span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="text-gray-500 font-medium">Teléfono</span>
              <span className="min-w-0 break-words text-right font-semibold text-gray-800">
                {appt.customerPhone
                  ? appt.customerPhoneCountryCode
                    ? formatPhoneForDisplay(appt.customerPhone, appt.customerPhoneCountryCode)
                    : appt.customerPhone
                  : '—'}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
