import { useEffect, useState } from 'react';
import { Heading, Text } from '@/shared/components/typography';
import { Input } from '@/shared/components/form/input';
import { cn } from '@/shared/utils/cn';
import { TENANT_TYPES_OPTIONS } from '@/shared/constants/tenant-type';
import { BackButton, NextButton, StepNavigation } from '../components/step-navigation';
import { useOnboarding } from '../hooks/use-onboarding';
import { useBusinessStep } from '../hooks/use-business-step';
import type { BusinessStepPayload } from '../schemas/business-step.schema';

type FormState = Omit<BusinessStepPayload, 'type'> & {
  type: BusinessStepPayload['type'] | undefined;
};

export const BusinessStep = () => {
  const { back, next, savedData } = useOnboarding();

  const [formData, setFormData] = useState<FormState>({
    name: savedData?.name ?? '',
    type: savedData?.type ?? undefined,
  });

  useEffect(() => {
    if (!savedData) return;
    setFormData({
      name: savedData.name ?? '',
      type: savedData.type ?? undefined,
    });
  }, [savedData?.name, savedData?.type]);

  const { mutateAsync: updateBusiness, isPending, isError, error } = useBusinessStep();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!formData.type) return;
      const payload = { name: formData.name, type: formData.type };
      next(() => updateBusiness(payload));
    } catch (error) {
      console.error('Error creating business', error);
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col mb-10">
          <label htmlFor="business-name" className="flex flex-col">
            <Heading as="h2" className="text-xl md:text-2xl mb-1 font-semibold">
              ¿Cómo se llama tu negocio?
            </Heading>
            <Text className="max-w-xl mb-4">
              Este nombre será el que verán tus clientes al agendar un turno y se usará para generar tu enlace personalizado.
            </Text>
          </label>
          <Input
            id="business-name"
            placeholder="Nombre del negocio"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <Heading as="h2" className="text-xl md:text-2xl mb-1 font-semibold">
            ¿De que trata?
          </Heading>
          <Text className="max-w-xl mb-4">
            Elige la opción que mejor describa los servicios que ofreces, nos servirá para adaptar tu configuración.
          </Text>
          <div className="grid md:grid-cols-4 grid-cols-2 gap-2">
            {TENANT_TYPES_OPTIONS.map((option) => (
              <div
                key={option.value}
                className={cn(
                  'flex flex-col items-center justify-center bg-white border hover:bg-gray-100 transition-colors duration-300 cursor-pointer border-gray-200 p-4 rounded-lg text-sm text-center h-24',
                  formData.type === option.value && ' border-indigo-500 hover:bg-white cursor-default',
                )}
                onClick={() => setFormData({ ...formData, type: option.value })}
              >
                <option.icon className={cn('size-6 text-gray-400 mb-2', formData.type === option.value && 'text-indigo-400')} />
                <span
                  className={cn(
                    'text-gray-600 transition-all duration-150 text-xs sm:text-sm',
                    formData.type === option.value && 'text-indigo-500 font-semibold',
                  )}
                >
                  {option.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <StepNavigation>
          <BackButton onBack={back} />
          <NextButton isNextDisabled={false} type="submit" />
        </StepNavigation>
      </form>
    </>
  );
};
