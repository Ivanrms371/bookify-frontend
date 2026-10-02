import { CheckCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Input } from '@/shared/components/form/input';
import { Text } from '@/shared/components/typography';
import { Button } from '@/shared/components/ui';
import { Spinner } from '@/shared/components/ui/spinner';
import { cn } from '@/shared/utils/cn';
import type { CustomerSearchItem } from '@/features/customers/types/customer-types';

export type CustomerMode = 'with-customer' | 'walk-in';

type Props = {
  mode: CustomerMode;
  query: string;
  selectedCustomer: CustomerSearchItem | null;
  customers: CustomerSearchItem[];
  isSearching: boolean;
  onModeChange: (mode: CustomerMode) => void;
  onQueryChange: (query: string) => void;
  onSelectCustomer: (customer: CustomerSearchItem) => void;
  onClearCustomer: () => void;
  onCreateCustomer: () => void;
};

export const AppointmentDrawerCustomerSection = ({
  mode,
  query,
  selectedCustomer,
  customers,
  isSearching,
  onModeChange,
  onQueryChange,
  onSelectCustomer,
  onClearCustomer,
  onCreateCustomer,
}: Props) => {
  if (selectedCustomer) {
    return <SelectedCustomer customer={selectedCustomer} onClear={onClearCustomer} />;
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <CustomerModeOption
          title="Agregar cliente"
          description="Buscar o crear un cliente para asociar la reserva."
          isSelected={mode === 'with-customer'}
          onSelect={() => onModeChange('with-customer')}
        />
        <CustomerModeOption
          title="Continuar sin cliente"
          description="Para walk-ins o reservas rápidas sin ficha."
          isSelected={mode === 'walk-in'}
          onSelect={() => onModeChange('walk-in')}
        />
      </div>

      {mode === 'with-customer' && (
        <div className="space-y-2">
          <Input
            placeholder="Buscar por nombre, email o teléfono"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            rightIcon={<MagnifyingGlassIcon className="size-4 text-gray-400" />}
          />

          {query.length > 1 && (
            <div className="rounded-lg border border-gray-200">
              {isSearching ? (
                <div className="p-4">
                  <Spinner />
                </div>
              ) : customers.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {customers.map((customer) => (
                    <li key={customer.id}>
                      <button
                        type="button"
                        onClick={() => onSelectCustomer(customer)}
                        className="flex w-full cursor-pointer items-center justify-between gap-3 p-3 text-left transition-colors hover:bg-gray-100"
                      >
                        <div className="min-w-0">
                          <Text className="truncate text-base font-semibold text-gray-800">{customer.name}</Text>
                          <Text className="truncate text-sm font-medium text-gray-500">{customer.email}</Text>
                        </div>
                        <CheckCircleIcon className="size-5 shrink-0 text-gray-300" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <Text className="p-3 text-base text-gray-500">No encontramos clientes con esa búsqueda.</Text>
              )}
            </div>
          )}

          <Button type="button" variant="dashed" fullWidth className="hover:bg-gray-100" onClick={onCreateCustomer}>
            Agregar nuevo cliente
          </Button>
        </div>
      )}
    </div>
  );
};

const SelectedCustomer = ({ customer, onClear }: { customer: CustomerSearchItem; onClear: () => void }) => (
  <div className="flex items-center justify-between gap-3 rounded-lg border border-indigo-200 bg-indigo-50 p-3">
    <CheckCircleIcon className="size-6 shrink-0 text-indigo-500" aria-hidden="true" />
    <div className="min-w-0 flex-1">
      <Text className="truncate text-base font-semibold text-gray-800">{customer.name}</Text>
      <Text className="truncate text-sm font-medium text-gray-500">{customer.email}</Text>
    </div>
    <Button type="button" variant="secondary" size="sm" className="shrink-0 bg-white" onClick={onClear}>
      Cambiar
    </Button>
  </div>
);

const CustomerModeOption = ({
  title,
  description,
  isSelected,
  onSelect,
}: {
  title: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}) => (
  <button
    type="button"
    onClick={onSelect}
    aria-pressed={isSelected}
    className={cn(
      'cursor-pointer rounded-xl border border-gray-200 p-3 text-left transition-colors',
      !isSelected && 'hover:bg-gray-100',
      isSelected && 'border-indigo-500',
    )}
  >
    <Text className="text-base font-semibold text-gray-800">{title}</Text>
    <Text className="text-sm font-medium text-gray-500">{description}</Text>
  </button>
);
