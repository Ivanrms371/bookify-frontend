import React from 'react';
import { useCustomers } from '../hooks/use-customers';
import { CustomersTable } from './table/customers-table';
import { Button } from '@/shared/components/ui';
import { useOverlay } from '@/shared/hooks/use-overlay';
import { Input } from '@/shared/components/form/input';
import { CustomerList } from './list/customer-list';
import { PlusIcon } from '@heroicons/react/20/solid';

export const Customers = () => {
  const { data: response, isLoading } = useCustomers();
  const customers = response?.data || [];

  const { open } = useOverlay('create-customer-modal');

  if (isLoading) {
    return <div className="mt-6 p-8 text-center text-gray-500">Cargando clientes...</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-4 items-center w-full">
          <Input type="text" className="w-full" placeholder="Buscar cliente por nombre, email, télefono..." />
          <Button variant="primary" className="shrink-0" icon={<PlusIcon className="size-5" />} iconPosition="left" onClick={open}>
            Nuevo Cliente
          </Button>
        </div>
        <div className="hidden md:block">
          <CustomersTable customers={customers} />
        </div>
        <div className="md:hidden">
          <CustomerList customers={customers} />
        </div>
      </div>
    </>
  );
};
