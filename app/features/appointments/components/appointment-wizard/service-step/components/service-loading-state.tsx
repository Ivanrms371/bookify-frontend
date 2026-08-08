import { StatusPlaceholder } from '@/shared/components/ui';
import { ScissorsIcon } from '@heroicons/react/24/outline';

export const ServiceLoadingState = () => {
  return (
    <StatusPlaceholder
      title="Buscando servicios"
      description="Estamos buscando los servicios solicitados..."
      icon={<ScissorsIcon className="size-6 text-gray-600 " />}
      containerClassName="animate-pulse"
    />
  );
};
