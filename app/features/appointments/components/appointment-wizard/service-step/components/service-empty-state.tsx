import { StatusPlaceholder } from '@/shared/components/ui';
import { ScissorsIcon } from '@heroicons/react/24/outline';

export const ServiceEmptyState = () => {
  return (
    <StatusPlaceholder
      title="No encontramos servicios"
      description="Debes agregar al menos un servicio para continuar."
      icon={<ScissorsIcon className="size-6 text-gray-600 " />}
    />
  );
};
