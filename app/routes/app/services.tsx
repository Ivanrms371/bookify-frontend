import { useAuthStore } from '@/core/auth/useAuthStore';
import { ServiceGrid, useServices } from '@/features/services';
import { Button } from '@/shared/components/ui';
import { Heading, Text } from '@/shared/components/typography';

const ServicesPage = () => {
  const { data: services = [], isLoading } = useServices();
  const tenant = useAuthStore((s) => s.tenant);

  if (!tenant) return null;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Heading as="h1" className="text-xl font-medium text-mist-600 lg:text-2xl xl:text-3xl">
            Servicios
          </Heading>
          <Text className="mt-1 text-base md:text-lg">Configura y gestiona el catálogo de servicios de tu negocio.</Text>
        </div>

        <Button type="button" className="button-primary shrink-0">
          Nuevo Servicio
        </Button>
      </div>

      <ServiceGrid services={services} isLoading={isLoading} className="mt-6 md:mt-8" />
    </div>
  );
};

export default ServicesPage;
