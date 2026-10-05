import { servicesStepSchema } from '../schemas/services-step.schema';
import { useEffect, useMemo, useRef, useState, type SubmitEvent } from 'react';
import { useMediaUpload } from '@/shared/media';
import type { UploadResult } from '@/shared/media/types';
import { toast } from 'sonner';
import { ServicesList, getDefaultServicesForTenantType } from '@/features/services';
import { Heading, Text } from '@/shared/components/typography';
import { BackButton, NextButton, StepNavigation } from '../components/step-navigation';
import { useOnboarding } from '../hooks/use-onboarding';
import { useSaveServices } from '../hooks/use-save-services';
import { mapServicesToDto } from '../utils/map-services-to-dto';

import type { OnboardingSavedData } from '../schemas/onboarding-status.schema';
import type { OnboardingServiceForm } from '../types/service-form.types';

function mapSavedServicesToForm(services: OnboardingSavedData['services']): OnboardingServiceForm[] {
  return services.map((service) => ({
    id: service.id,
    name: service.name,
    price: Number(service.price) || 0,
    durationMinutes: service.durationMinutes,
    imageUrl: service.imageUrl ?? undefined,
    imagePublicId: service.imagePublicId ?? undefined,
    professionalIds: [],
    description: null,
    discountPercentage: 0,
    discountFixed: 0,
  }));
}

export const ServicesStep = () => {
  const { savedData, back, next } = useOnboarding();
  const { mutateAsync: saveServices, isPending } = useSaveServices();
  const { mutateAsync: upload } = useMediaUpload();
  const [isSaving, setIsSaving] = useState(false);
  const uploaded = useRef(new Map<File, UploadResult>());
  const busy = isPending || isSaving;

  const suggestedServices = useMemo(() => {
    if (savedData?.services?.length) {
      return mapSavedServicesToForm(savedData.services);
    }
    return getDefaultServicesForTenantType(savedData?.type).map((service) => ({
      ...service,
      clientId: crypto.randomUUID(),
      discountPercentage: service.discountPercentage ?? 0,
      discountFixed: service.discountFixed ?? 0,
    }));
  }, [savedData?.services, savedData?.type]);

  const [services, setServices] = useState<OnboardingServiceForm[]>(suggestedServices);

  useEffect(() => {
    setServices(suggestedServices);
  }, [suggestedServices]);

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;

    if (services.length === 0) {
      toast.error('Agregá al menos un servicio para continuar');
      return;
    }

    const result = servicesStepSchema.safeParse(mapServicesToDto(services));
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    setIsSaving(true);
    try {
      const payload = result.data;
      for (const [index, service] of services.entries()) {
        if (!service.image) continue;
        let image = uploaded.current.get(service.image);
        if (!image) {
          image = await upload({ file: service.image, type: 'service' });
          uploaded.current.set(service.image, image);
        }
        payload.services[index].imageUrl = image.url;
        payload.services[index].imagePublicId = image.publicId;
      }
      await next(() => saveServices(payload));
    } catch (error) {
      toast.error('Error al guardar los servicios', {
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Heading as="h2" className="text-xl md:text-2xl mb-1 font-semibold">
        Tus servicios
      </Heading>
      <Text size="base" className="mb-4 max-w-xl">
        Revisá y personalizá los servicios sugeridos antes de continuar.
      </Text>

      <form onSubmit={onSubmit}>
        <ServicesList
          disabled={busy}
          services={services}
          onUpdate={(index, updated) =>
            setServices((prev) =>
              prev.map((service, i) =>
                i === index
                  ? {
                      ...service,
                      ...updated,
                      id: service.id,
                      discountPercentage: updated.discountPercentage ?? 0,
                      discountFixed: updated.discountFixed ?? 0,
                    }
                  : service,
              ),
            )
          }
          onRemove={(index) => setServices((prev) => prev.filter((_, i) => i !== index))}
          onAdd={() =>
            setServices((prev) => [
              ...prev,
              {
                clientId: crypto.randomUUID(),
                name: '',
                price: 0,
                durationMinutes: 30,
                professionalIds: [],
                discountPercentage: 0,
                discountFixed: 0,
              },
            ])
          }
        />

        <StepNavigation>
          <BackButton onBack={back} disabled={busy} />
          <NextButton isNextDisabled={services.length === 0 || busy} type="submit" />
        </StepNavigation>
      </form>
    </>
  );
};
