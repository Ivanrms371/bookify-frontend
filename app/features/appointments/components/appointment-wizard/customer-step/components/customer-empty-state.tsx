import { StatusPlaceholder } from '@/shared/components/ui';
import { UsersIcon } from '@heroicons/react/24/outline';

export const CustomerEmptyState = () => {
  return (
    <StatusPlaceholder
      title="No hemos encontrado coincidencias"
      description="Puedes intentar con otros datos o crear un nuevo cliente."
      icon={<UsersIcon className="size-6 text-gray-600 " />}
    />
  );
};
