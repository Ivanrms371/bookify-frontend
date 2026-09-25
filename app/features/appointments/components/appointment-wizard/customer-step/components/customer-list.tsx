import type { GetCustomersSearchResponse } from '@/features/customers';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { Text } from '@/shared/components/typography';
import { getInitials } from '@/shared/utils/string';
import { cn } from '@/shared/utils/cn';

interface Props {
  customers: GetCustomersSearchResponse;
  onSelect: (id: string) => void;
  selectedCustomer: string | null;
}

export const CustomerList = ({ customers, onSelect, selectedCustomer }: Props) => {
  return (
    <ul className="flex flex-col gap-2.5">
      {customers.map((customer) => (
        <li
          key={customer.id}
          onClick={() => onSelect(customer.id)}
          className={cn(
            'group flex justify-between items-center gap-3 border border-gray-200 p-2 rounded-lg cursor-pointer transition-all duration-300',
            selectedCustomer === customer.id ? 'border-indigo-600  ring-4 ring-indigo-100' : 'hover:bg-gray-100/50 hover:boder-gray-300',
          )}
        >
          <div className="flex gap-3 items-center min-w-0">
            <div className="size-10 rounded-full border border-gray-200 text-gray-600 font-semibold text-sm flex justify-center items-center shrink-0 tracking-wider group-hover:bg-gray-50  transition-colors">
              {getInitials(customer.name)}
            </div>

            <div>
              <Text className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors truncate">
                {customer.name}
              </Text>
              <Text className="text-xs text-gray-500 font-medium mt-0.5 truncate">
                {customer.phoneNumber} {customer.email ? `• ${customer.email}` : ''}
              </Text>
            </div>
          </div>

          <ChevronRightIcon className="size-5 text-gray-400" />
        </li>
      ))}
    </ul>
  );
};
