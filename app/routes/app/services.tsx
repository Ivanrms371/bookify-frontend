import { ServiceGrid, useServices } from '@/features/services';
import { Button } from '@/shared/components/ui';
import { Heading, Text } from '@/shared/components/typography';
import { PlusIcon } from '@heroicons/react/20/solid';
import { useOverlay } from '@/shared/hooks/use-overlay';

const ServicesPage = () => {
  const { open } = useOverlay('create-service-drawer');
  const { data, isLoading } = useServices();
  const { data: services = [] } = data ?? {};

  return (
    <>
      <div className="flex flex-col gap-2 md:flex-row justify-between md:items-center pb-4 border-b border-gray-200">
        <div>
          <Heading as="h1" className="text-3xl font-semibold">
            Servicios
          </Heading>
          <Text className="text-gray-600">Gestiona las citas de hoy y visualiza el estado de cada turno de forma simple.</Text>
        </div>
        <div>
          <Button variant="primary" className="min-w-40" icon={<PlusIcon className="size-5" />} iconPosition="left" onClick={open}>
            Nuevo Servicio
          </Button>
        </div>
      </div>

      <ServiceGrid services={services} />
    </>
  );
};

export default ServicesPage;
