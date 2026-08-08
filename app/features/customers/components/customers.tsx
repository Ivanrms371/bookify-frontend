import React from 'react';
import { useCustomers } from '../hooks/use-customers';
import { CustomersTable } from './table/customers-table';
import { CustomerGrid } from '@/features/customers/components/list/customer-grid';

export const Customers = () => {
  const { data: response, isLoading } = useCustomers();
  const customers = response?.data || [];

  if (isLoading) {
    return <div className="mt-6 p-8 text-center text-gray-500">Cargando clientes...</div>;
  }

  return (
    <>
      <CustomersTable customers={customers} />
    </>
  );
};
