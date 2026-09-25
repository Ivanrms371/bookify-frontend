import { Table, Tbody, Td, Th, Thead, Tr } from '@/shared/components/ui/table';
import type { Customer, CustomerBasic } from '../../types/customer-types';
import { CustomerActions } from './customer-actions';
import { formatPhoneForDisplay } from '@/shared/utils/format-phone';
import { formatDateDMY } from '@/shared/utils/date';
import { formatCurrency } from '@/shared/utils/currency';
import { Badge } from '@/shared/components/ui/badge';

interface Props {
  customers: CustomerBasic[];
}

export const CustomersTable = ({ customers }: Props) => {
  return (
    <Table className="min-w-[900px]">
      <Thead>
        <Tr>
          <Th>Nombre</Th>
          <Th>Email</Th>
          <Th>Teléfono</Th>
          <Th>Primera Cita</Th>
          <Th>Última Cita</Th>
          <Th>Total Gastado</Th>
          <Th className="text-right">Acciones</Th>
        </Tr>
      </Thead>
      <Tbody>
        {customers.map((customer) => (
          <Tr key={customer.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
            <Td>
              <div className="flex items-center gap-2">
                <div className="text-gray-900 font-medium">{customer.name}</div>
                {customer.blockedAt && <Badge variant="red">Bloqueado</Badge>}
              </div>
            </Td>
            <Td>
              <div className="text-gray-800">{customer.email}</div>
            </Td>
            <Td>
              <div className="text-gray-800">{formatPhoneForDisplay(customer.phoneNumber, customer.phoneCountryCode)}</div>
            </Td>
            <Td>
              <div className="text-gray-800">
                {customer.firstAppointmentAt ? (
                  formatDateDMY(customer.firstAppointmentAt)
                ) : (
                  <span className="text-gray-400">Todavía no ha tenido su primera cita</span>
                )}
              </div>
            </Td>
            <Td>
              <div className="text-gray-800">
                {customer.lastAppointmentAt ? (
                  formatDateDMY(customer.lastAppointmentAt)
                ) : (
                  <span className="text-gray-400">Sin última cita</span>
                )}
              </div>
            </Td>
            <Td>
              <div className="text-gray-900 font-medium">
                {customer.totalSpent ? formatCurrency(customer.totalSpent) : formatCurrency(0)}
              </div>
            </Td>
            <Td>
              <div className="flex justify-end w-full relative">
                <CustomerActions customer={customer} />
              </div>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
