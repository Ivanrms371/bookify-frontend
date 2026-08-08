import { formatCurrency } from '@/shared/utils/currency';
import { Table, Tbody, Td, Th, Thead, Tr } from '@/shared/components/ui/table';
import { ScheduleHeader } from './schedule-header';
import { formatTime } from '../utils/date-helpers';
import { formatDateDMY } from '@/shared/utils/date';
import { StatusBadge } from './status-badge';
import { AppointmentActions } from './ui/appointment-actions';
import type { Appointment } from '../types/appointments-types';

interface Props {
  appointments: Appointment[];
  selectedDate: Date;
  onNext: () => void;
  onPrevious: () => void;
  onToday: () => void;
}

export const AppointmentTable = ({ appointments, selectedDate, onNext, onPrevious, onToday }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <ScheduleHeader selectedDate={selectedDate} onNext={onNext} onPrevious={onPrevious} onToday={onToday} />
      <Table>
        <Thead>
          <tr>
            <Th>Fecha</Th>
            <Th>Hora</Th>
            <Th>Cliente</Th>
            <Th>Servicio</Th>
            <Th>Estado</Th>
            <Th>Precio</Th>
            <Th>Teléfono</Th>
            <Th className="text-right">Acciones</Th>
          </tr>
        </Thead>
        <Tbody>
          {appointments.map((appt) => (
            <Tr key={appt.id}>
              <Td>
                <div className="text-gray-800">{formatDateDMY(appt.startsAt)}</div>
              </Td>
              <Td>
                <div className="text-gray-800">
                  {formatTime(appt.startsAt)} - {formatTime(appt.endsAt)}
                </div>
              </Td>
              <Td>
                <div className="text-gray-800">{appt.customerName}</div>
              </Td>
              <Td>
                <div className="text-gray-800">{appt.serviceName}</div>
              </Td>
              <Td>
                <StatusBadge status={appt.status} />
              </Td>
              <Td>
                <div className="text-gray-800">{formatCurrency(appt.price)}</div>
              </Td>
              <Td>
                <div className="text-gray-800">{appt.customerPhone}</div>
              </Td>

              <Td>
                <div className="flex justify-end w-full relative">
                  <AppointmentActions appointment={appt} />
                </div>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
};
