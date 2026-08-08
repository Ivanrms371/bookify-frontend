import { Input } from '@/shared/components/form/input';
import { Heading, Text } from '@/shared/components/typography';
import { Button } from '@/shared/components/ui';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAppointmentWizard } from '../appointment-wizard-context';
import { useState } from 'react';
import { useCustomerSearch } from '@/features/customers/hooks/use-customer-search';
import { CustomerInitialState } from './components/customer-initial-state';
import { Spinner } from '@/shared/components/ui/spinner';
import { CustomerEmptyState } from './components/customer-empty-state';
import { CustomerList } from './components/customer-list';

export const CustomerStep = () => {
  const { state, updateData, nextStep } = useAppointmentWizard();

  const [query, setQuery] = useState<string>('');
  const { data, isLoading } = useCustomerSearch(query);

  const renderContent = () => {
    if (query.length < 3) return <CustomerInitialState />;
    if (isLoading) return <Spinner />;
    if (!data) return <CustomerEmptyState />;
    return <CustomerList customers={data} onSelect={handleSelectCustomer} selectedCustomer={state.data.customerId} />;
  };

  const handleSelectCustomer = (id: string) => {
    updateData({ customerId: id });
    nextStep();
  };

  return (
    <>
      <div>
        <Text className="font-bold text-gray-700 text-lg ">Selecciona un Cliente</Text>
        <Text className="mb-2 text-gray-500 text-sm">Busca por nombre, email o teléfono. También puedes crear uno nuevo.</Text>
        <Input
          placeholder="Buscar por nombre, email o teléfono..."
          onInput={(e) => setQuery(e.currentTarget.value)}
          rightIcon={<MagnifyingGlassIcon className="size-4 text-gray-400" />}
        />
      </div>

      {renderContent()}

      <Button type="button" variant="dashed" fullWidth>
        + Agregar nuevo cliente
      </Button>
    </>
  );
};
