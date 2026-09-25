import { useEffect, useMemo, useState, type SubmitEvent } from 'react';
import { toast } from 'sonner';
import { ServicesList, getDefaultServicesForTenantType } from '@/features/services';
import { Heading, Text } from '@/shared/components/typography';
import { BackButton, NextButton, StepNavigation } from '../components/step-navigation';
import { useOnboarding } from '../hooks/use-onboarding';
import { useSaveServices } from '../hooks/use-save-services';
import { mapServicesToDto } from '../utils/map-services-to-dto';

import type { OnboardingSavedData } from '../schemas/onboarding-status.schema';
import type { CreateServicePayload } from '@/features/services/types/services.types';

function mapSavedServicesToForm(services: OnboardingSavedData['services']): CreateServicePayload[] {
  return services.map((service) => ({
    name: service.name,
    price: Number(service.price) || 0,
    durationMinutes: service.durationMinutes,
    image: null,
    description: null,
    discountPercentage: 0,
    discountFixed: 0,
  }));
}

export const ServicesStep = () => {
  const { savedData, back, next } = useOnboarding();
  const { mutateAsync: saveServices, isPending } = useSaveServices();

  const suggestedServices = useMemo(() => {
    if (savedData?.services?.length) {
      return mapSavedServicesToForm(savedData.services);
    }
    return getDefaultServicesForTenantType(savedData?.type);
  }, [savedData?.services, savedData?.type]);

  const [services, setServices] = useState<CreateServicePayload[]>(suggestedServices);

  useEffect(() => {
    setServices(suggestedServices);
  }, [suggestedServices]);

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (services.length === 0) {
      toast.error('Agregá al menos un servicio para continuar');
      return;
    }

    const payload = mapServicesToDto(services);

    try {
      await next(() => saveServices(payload));
    } catch (error) {
      toast.error('Error al guardar los servicios', {
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };

  return (
    <>
      <Heading as="h2" className="text-xl md:text-2xl mb-1 font-semibold">
        ¿Qué servicios ofrecés?
      </Heading>
      <Text className="mb-4 max-w-xl">Revisá y personalizá los servicios sugeridos antes de continuar.</Text>

      <form onSubmit={onSubmit}>
        <ServicesList
          title="Personalizá tus servicios"
          services={services}
          onUpdate={(index, updated) => setServices((prev) => prev.map((service, i) => (i === index ? updated : service)))}
          onRemove={(index) => setServices((prev) => prev.filter((_, i) => i !== index))}
        />

        <StepNavigation>
          <BackButton onBack={back} />
          <NextButton isNextDisabled={services.length === 0 || isPending} type="submit" />
        </StepNavigation>
      </form>
    </>
  );
};
