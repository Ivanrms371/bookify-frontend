import { appointmentDisplayDate, appointmentDisplayTime } from '../utils/appointment-display';
import { formatCurrency } from '@/shared/utils/currency';
import { Table, Tbody, Td, Th, Thead, Tr } from '@/shared/components/ui/table';
import { StatusBadge } from './status-badge';
import { AppointmentActions } from './ui/appointment-actions';
import type { Appointment } from '../types/appointments-types';

interface Props {
  appointments: Appointment[];
}

export const AppointmentTable = ({ appointments }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <Table>
        <Thead>
          <tr>
            <Th>Fecha</Th>
            <Th>Hora</Th>
            <Th>Cliente</Th>
            <Th>Servicio</Th>
            <Th>Estado</Th>
            <Th>Precio</Th>
            <Th className="text-right">Acciones</Th>
          </tr>
        </Thead>
        <Tbody>
          {appointments.map((appt) => (
            <Tr key={appt.id}>
              <Td>
                <div className="text-gray-800">{appointmentDisplayDate(appt.startsAt, appt.timeZone)}</div>
              </Td>
              <Td>
                <div className="text-gray-800">
                  {appointmentDisplayTime(appt.startsAt, appt.timeZone)} - {appointmentDisplayTime(appt.endsAt, appt.timeZone)}
                </div>
              </Td>
              <Td>
                <div className={appt.customerId ? 'text-gray-800' : 'text-gray-400 italic'}>
                  {appt.customerId ? appt.customerName : 'Sin cliente asociado'}
                </div>
                {appt.customerId && (appt.customerEmail || appt.customerPhone) && (
                  <div className="mt-1 text-xs text-gray-500">{[appt.customerEmail, appt.customerPhone].filter(Boolean).join(' · ')}</div>
                )}
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
