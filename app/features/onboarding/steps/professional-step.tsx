import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon } from '@heroicons/react/16/solid';
import { cn } from '@/shared/utils/cn';
import { toast } from 'sonner';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { Heading, Text } from '@/shared/components/typography';
import { Input } from '@/shared/components/form/input';
import { BackButton, NextButton, StepNavigation } from '../components/step-navigation';
import { useOnboarding } from '../hooks/use-onboarding';
import { useSaveProfessional } from '../hooks/use-save-professional';
import { professionalStepSchema, type ProfessionalStepPayload } from '../schemas/professional-step.schema';

export const ProfessionalStep = () => {
  const { savedData, back, next } = useOnboarding();
  const session = useAuthStore((state) => state.session);
  const { mutateAsync: save, isPending } = useSaveProfessional();
  const { register, control, watch, reset, handleSubmit, getFieldState, formState } = useForm<ProfessionalStepPayload>({
    resolver: zodResolver(professionalStepSchema),
    defaultValues: { serviceIds: [] },
  });
  const attends = watch('attendsClients');
  const serviceIds = watch('serviceIds') ?? [];
  const fieldError = (field: Parameters<typeof getFieldState>[0]) => getFieldState(field, formState).error?.message;

  useEffect(() => {
    const draft = savedData?.professional;
    const profile = draft?.attendsClients ? draft : null;
    const availableIds = savedData?.services.map((service) => service.id) ?? [];
    reset({
      attendsClients: draft?.attendsClients,
      name: profile?.name ?? session?.name ?? '',
      email: profile?.email ?? session?.email ?? '',
      phoneCountryCode: profile?.phoneCountryCode ?? session?.phoneCountryCode ?? '',
      phoneNumber: profile?.phoneNumber ?? session?.phoneNumber ?? '',
      profession: profile?.profession ?? '',
      serviceIds: profile ? profile.serviceIds.filter((id) => availableIds.includes(id)) : availableIds,
    });
  }, [savedData, session?.id, reset]);

  const onSubmit = async (data: ProfessionalStepPayload) => {
    try {
      await next(() => save(data));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo guardar tu perfil');
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div>
        <Heading as="h2" className="text-xl md:text-2xl mb-1 font-semibold">
          ¿Vas a atender clientes?
        </Heading>
      </div>
      <fieldset disabled={isPending} className="grid gap-3 sm:grid-cols-2">
        <legend className="sr-only">¿Vas a atender clientes?</legend>
        <Controller
          name="attendsClients"
          control={control}
          render={({ field }) => (
            <>
              {([true, false] as const).map((value) => (
                <label
                  key={String(value)}
                  className={cn(
                    'flex items-start gap-3 rounded-lg border bg-white p-4 cursor-pointer transition-colors',
                    attends === value ? 'border-indigo-500' : 'border-gray-200 hover:border-gray-300',
                  )}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    name={field.name}
                    ref={field.ref}
                    checked={field.value === value}
                    onBlur={field.onBlur}
                    onChange={() => field.onChange(value)}
                  />
                  <span
                    className={cn(
                      'mt-0.5 size-5 shrink-0 border rounded-md border-gray-200 flex justify-center items-center',
                      attends === value && 'bg-indigo-600 border-transparent text-white',
                    )}
                    aria-hidden="true"
                  >
                    {attends === value && <CheckIcon className="size-4" />}
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-800">
                      {value ? 'Sí, atenderé clientes' : 'Solo administraré el negocio'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {value ? 'Creá tu perfil para recibir reservas.' : 'Gestioná tu negocio sin atender clientes.'}
                    </span>
                  </span>
                </label>
              ))}
            </>
          )}
        />
      </fieldset>
      {attends && (
        <fieldset disabled={isPending} className="space-y-4 rounded-lg border border-gray-200 bg-white p-5">
          <Input id="professional-name" label="Nombre a mostrar" {...register('name')} error={fieldError('name')} />
          <Input id="professional-email" label="Correo de contacto" type="email" {...register('email')} error={fieldError('email')} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              id="professional-code"
              label="Código de país"
              placeholder="+598"
              {...register('phoneCountryCode')}
              error={fieldError('phoneCountryCode')}
            />
            <div className="sm:col-span-2">
              <Input id="professional-phone" label="Teléfono" type="tel" {...register('phoneNumber')} error={fieldError('phoneNumber')} />
            </div>
          </div>
          <Input id="professional-profession" label="Profesión (opcional)" {...register('profession')} error={fieldError('profession')} />
          <fieldset className="space-y-2">
            <legend className="mb-2 font-medium">Servicios que ofrecerás</legend>
            {savedData?.services.map((service) => {
              const isChecked = serviceIds.includes(service.id);
              return (
                <label
                  key={service.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    value={service.id}
                    {...register('serviceIds')}
                    aria-describedby={fieldError('serviceIds') ? 'professional-services-error' : undefined}
                  />
                  <span
                    className={cn(
                      'size-5 shrink-0 border rounded-md border-gray-200 flex justify-center items-center',
                      isChecked && 'bg-indigo-600 border-transparent text-white',
                    )}
                  >
                    {isChecked && <CheckIcon className="size-4" />}
                  </span>
                  <span className="text-sm text-gray-800">{service.name}</span>
                </label>
              );
            })}
            {fieldError('serviceIds') && (
              <p id="professional-services-error" className="error-text" role="alert">
                {fieldError('serviceIds')}
              </p>
            )}
          </fieldset>
          <Text className="text-sm text-gray-500">
            Usarás los horarios del negocio. Podrás configurar horarios propios desde tu perfil.
          </Text>
        </fieldset>
      )}
      <StepNavigation>
        <BackButton onBack={back} disabled={isPending} />
        <NextButton isNextDisabled={typeof attends !== 'boolean' || isPending} />
      </StepNavigation>
    </form>
  );
};
