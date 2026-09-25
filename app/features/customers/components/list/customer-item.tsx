import { formatPhoneForDisplay } from '@/shared/utils/format-phone';
import { formatDateDMY } from '@/shared/utils/date';
import { formatCurrency } from '@/shared/utils/currency';
import { Badge } from '@/shared/components/ui/badge';
import { CustomerActions } from '@/features/customers/components/table/customer-actions';
import type { CustomerBasic } from '@/features/customers/types/customer-types';

interface Props {
  customer: CustomerBasic;
}

export const CustomerCard = ({ customer }: Props) => {
  return (
    <div className="flex flex-col rounded-lg border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium text-gray-900">{customer.name}</h3>
        {customer.blockedAt && <Badge variant="red">Bloqueado</Badge>}
      </div>
      <p className="text-sm text-gray-600 mb-1">{customer.email}</p>
      <p className="text-sm text-gray-600 mb-1">{formatPhoneForDisplay(customer.phoneNumber, customer.phoneCountryCode)}</p>
      <p className="text-sm text-gray-600 mb-1">
        {customer.firstAppointmentAt ? `Primera cita: ${formatDateDMY(customer.firstAppointmentAt)}` : 'Sin primera cita'}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        {customer.lastAppointmentAt ? `Última cita: ${formatDateDMY(customer.lastAppointmentAt)}` : 'Sin última cita'}
      </p>
      <p className="text-sm font-medium text-gray-900 mb-3">
        Total gastado: {customer.totalSpent ? formatCurrency(customer.totalSpent) : formatCurrency(0)}
      </p>
      <div className="mt-auto self-end">
        <CustomerActions customer={customer} />
      </div>
    </div>
  );
};
