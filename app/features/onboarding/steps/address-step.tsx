import { useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Heading, Text } from '@/shared/components/typography';
import { LocationFields } from '@/shared/location/components/location-fields';
import { useLocationOptions } from '@/shared/location/hooks/use-location-options';
import { locationSchema } from '@/shared/location/schemas/location-schema';
import type { LocationValues } from '@/shared/location/types/location.types';
import { useOnboarding } from '../hooks/use-onboarding';
import { useSaveLocation } from '../hooks/use-save-location';
import { BackButton, NextButton, StepNavigation } from '../components/step-navigation';

export const AddressStep = () => {
  const { savedData, back, next } = useOnboarding();
  const options = useLocationOptions();
  const methods = useForm<LocationValues>({
    resolver: zodResolver(locationSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      country: savedData?.country ?? '',
      province: savedData?.province ?? '',
      city: savedData?.city ?? '',
      addressLine1: savedData?.addressLine1 ?? '',
      addressLine2: savedData?.addressLine2 ?? '',
      phoneNumber: savedData?.phoneNumber ?? '',
      currency: savedData?.currency ?? '',
      timeZone: savedData?.timeZone ?? '',
    },
  });
  const { mutateAsync: save, isPending } = useSaveLocation();
  const lock = useRef(false);
  const busy = isPending || methods.formState.isSubmitting;
  const submit = async (values: LocationValues) => {
    if (lock.current || !options.data) return;
    lock.current = true;
    try {
      await next(() => save(values));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo guardar la dirección');
    } finally {
      lock.current = false;
    }
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(submit)} noValidate>
        <Heading as="h2" className="text-xl md:text-2xl mb-1 font-semibold">
          Dirección de tu negocio
        </Heading>
        <Text size="base" className="max-w-xl mb-4">
          Indicá dónde está tu negocio para que tus clientes puedan encontrarte.
        </Text>
        <fieldset disabled={busy} className="min-w-0">
          <LocationFields idPrefix="onboarding-address" requiredAddress showPreferences={false} disabled={busy} />
        </fieldset>
        <StepNavigation>
          <BackButton onBack={back} disabled={busy} />
          <NextButton isNextDisabled={busy || !options.data} />
        </StepNavigation>
      </form>
    </FormProvider>
  );
};
