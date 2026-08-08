import React, { useEffect, useState } from 'react';
import type { CustomerBasic } from '@/features/customers/types/customer-types';
import { CustomerCard } from '@/features/customers/components/list/customer-card';

/**
 * Responsive grid for displaying customers.
 * - 1 column on very small screens
 * - 2 columns on small screens (sm)
 * - 3 columns on medium and larger screens (md, lg, xl)
 */
export const CustomerGrid = ({ customers }: { customers: CustomerBasic[] }) => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {customers.map((customer) => (
        <CustomerCard key={customer.id} customer={customer} />
      ))}
    </div>
  );
};
