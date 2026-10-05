import { Heading, Text } from '@/shared/components/typography';
import { BackButton, NextButton, StepNavigation } from '../components/step-navigation';
import { useOnboarding } from '../hooks/use-onboarding';
import { useSaveWorkingHours } from '../hooks/use-save-working-hours';
import { toast } from 'sonner';
import { ScheduleForm } from '@/features/schedule/components/schedule-form';
import type { SaveWorkingHours } from '@/features/schedule/schemas/schedule-form-schema';

export const ScheduleStep = () => {
  const { next, back, onboardingData } = useOnboarding();
  const { mutateAsync: saveWorkingHours, isPending } = useSaveWorkingHours();

  const workingHours = onboardingData?.savedData?.workingHours ?? null;

  const handleSave = async (data: SaveWorkingHours): Promise<void> => {
    try {
      await next(() => saveWorkingHours(data));
    } catch (error) {
      toast.error('Error al guardar los horarios de trabajo', {
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };

  return (
    <>
      <Heading as="h2" className="text-xl md:text-2xl mb-1 font-semibold">
        Tus horarios
      </Heading>
      <Text size="base" className="max-w-xl mb-4">
        Establecé las horas que tenés disponibles cada semana para mantener tu agenda organizada automáticamente.
      </Text>

      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <ScheduleForm id="onboarding-schedule-form" onSubmit={handleSave} defaultValues={workingHours} />
      </div>

      <StepNavigation>
        <BackButton onBack={back} disabled={isPending} />
        <NextButton form="onboarding-schedule-form" isNextDisabled={isPending} type="submit" />
      </StepNavigation>
    </>
  );
};
