import { useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Heading, Text } from '@/shared/components/typography';
import { Input } from '@/shared/components/form/input';
import { FormField } from '@/shared/components/form/form-field';
import { cn } from '@/shared/utils/cn';
import { TENANT_TYPES_OPTIONS } from '@/shared/constants/tenant-type';
import { NextButton, StepNavigation } from '../components/step-navigation';
import { useOnboarding } from '../hooks/use-onboarding';
import { useBusinessStep } from '../hooks/use-business-step';
import { businessStepSchema, type BusinessStepPayload } from '../schemas/business-step.schema';

export const BusinessStep = () => {
  const { next, savedData } = useOnboarding();
  const methods = useForm<BusinessStepPayload>({
    resolver: zodResolver(businessStepSchema),
    defaultValues: {
      name: savedData?.name ?? '',
      type: savedData?.type ?? undefined,
    },
  });
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = methods;
  const type = watch('type');
  const { mutateAsync: updateBusiness, isPending } = useBusinessStep();
  const lock = useRef(false);
  const onSubmit = async ({ name, type }: BusinessStepPayload) => {
    if (lock.current) return;
    lock.current = true;
    try {
      await next(() => updateBusiness({ name: name.trim(), type }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo guardar el negocio');
    } finally {
      lock.current = false;
    }
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-6">
        <fieldset disabled={isPending || isSubmitting} className="min-w-0 space-y-8">
          <div>
            <Heading as="h2" className="text-xl md:text-2xl mb-1 font-semibold">
              Tu negocio
            </Heading>
            <Text size="base" className="max-w-xl mb-4">
              Este nombre será el que verán tus clientes al agendar un turno y se usará para generar tu enlace personalizado.
            </Text>
            <FormField id="business-name" label="Nombre del negocio" error={errors.name?.message}>
              <Input id="business-name" placeholder="Nombre del negocio" {...register('name')} />
            </FormField>
          </div>
          <div>
            <Heading as="h2" className="text-xl md:text-2xl mb-1 font-semibold">
              ¿De qué trata?
            </Heading>
            <Text size="base" className="max-w-xl mb-4">
              Elige la opción que mejor describa los servicios que ofreces.
            </Text>
            <div className="grid md:grid-cols-4 grid-cols-2 gap-2">
              {TENANT_TYPES_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={type === option.value}
                  className={cn(
                    'flex flex-col items-center justify-center bg-white border hover:bg-gray-100 transition-colors cursor-pointer border-gray-200 p-4 rounded-lg text-sm text-center h-24',
                    type === option.value && 'border-indigo-500 hover:bg-white',
                  )}
                  onClick={() => setValue('type', option.value, { shouldDirty: true, shouldValidate: true })}
                >
                  <option.icon className={cn('size-6 text-gray-400 mb-2', type === option.value && 'text-indigo-400')} />
                  <span className={cn('text-gray-600 text-xs sm:text-sm', type === option.value && 'text-indigo-500 font-semibold')}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
            {errors.type && (
              <p role="alert" className="mt-2 text-sm text-red-600">
                {errors.type.message}
              </p>
            )}
          </div>
        </fieldset>
        <StepNavigation>
          <div />
          <NextButton isNextDisabled={isPending || isSubmitting || !watch('name')?.trim() || !type} type="submit" />
        </StepNavigation>
      </form>
    </FormProvider>
  );
};
