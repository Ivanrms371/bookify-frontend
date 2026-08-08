import { Text } from '@/shared/components/typography';
import { StatusPlaceholder } from '@/shared/components/ui';
import { UsersIcon } from '@heroicons/react/24/outline';
import React from 'react';

export const CustomerInitialState = () => {
  return (
    <StatusPlaceholder
      title={'Busca un cliente'}
      description={'Escribe el nombre, email o teléfono del cliente.'}
      icon={<UsersIcon className="size-6 text-gray-600 " />}
    />
  );
};
