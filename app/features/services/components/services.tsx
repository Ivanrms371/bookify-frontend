import { useOverlay } from '@/shared/hooks/use-overlay';
import { useServices } from '../hooks/use-services';
import { ServiceGrid } from './grid/service-grid';
import { Button } from '@/shared/components/ui';
import { PlusIcon } from '@heroicons/react/20/solid';
import { Input } from '@/shared/components/form/input';

export const Services = () => {
  const { open } = useOverlay('create-service-drawer');
  const { data: services, isLoading } = useServices();

  if (!services) return null;
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center w-full gap-4">
          <Input type="text" className="w-full" placeholder="Buscar servicio por nombre..." />

          <Button variant="primary" className="shrink-0" onClick={open} iconPosition="left" icon={<PlusIcon className="size-5" />}>
            Nuevo Servicio
          </Button>
        </div>
        <div className="hidden md:block">
          <ServiceGrid services={services.data} />
        </div>
        <div className="md:hidden">
          <ServiceGrid services={services.data} />
        </div>
      </div>
    </>
  );
};
