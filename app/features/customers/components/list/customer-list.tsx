import type { CustomerBasic } from '@/features/customers/types/customer-types';
import { formatPhoneForDisplay } from '@/shared/utils/format-phone';
import { CustomerActions } from '../table/customer-actions';

export const CustomerList = ({ customers }: { customers: CustomerBasic[] }) => {
  return (
    <ul className="flex flex-col gap-4">
      {customers.map((customer) => (
        <li className="flex flex-col gap-1  p-4 border border-gray-200 bg-white rounded-lg">
          <div className="flex justify-between items-center">
            <div className="text-lg text-gray-900">{customer.name}</div>
            <div>
              <CustomerActions customer={customer} />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-500">{customer.email}</span>

            <span className="text-sm text-gray-500">{formatPhoneForDisplay(customer.phoneNumber, customer.phoneCountryCode)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};
