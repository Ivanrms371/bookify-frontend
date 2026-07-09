import React from 'react';
import { Heading, Text } from '@/shared/components/typography';
import { mapScheduleToDTO, useWorkingHours, WorkingHoursFields } from '@/features/tenant-working-hours';
import { BackButton, NextButton, StepNavigation } from '../components/step-navigation';
import { useOnboarding } from '../hooks/use-onboarding';
import { useSaveWorkingHours } from '../hooks/use-save-working-hours';
import { toast } from 'sonner';

export const ScheduleStep = () => {
  const { next, back } = useOnboarding();
  const scheduleState = useWorkingHours();

  const { mutateAsync: saveWorkingHours, isPending } = useSaveWorkingHours();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const workingHoursDto = mapScheduleToDTO(scheduleState.weeklySchedule);

    try {
      next(() => saveWorkingHours(workingHoursDto));
    } catch (error) {
      toast.error('Error al guardar los horarios de trabajo', {
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };

  return (
    <>
      <Heading as="h2" className="text-xl md:text-2xl mb-1 font-semibold">
        Definí tus horario de trabajo
      </Heading>
      <Text className="max-w-xl mb-4">
        Establecé las horas que tenés disponibles cada semana para mantener tu agenda organizada automáticamente.
      </Text>

      <form onSubmit={onSubmit}>
        <WorkingHoursFields useWorkingHours={scheduleState} />
        <StepNavigation>
          <BackButton onBack={back} />
          <NextButton isNextDisabled={false} type="submit" />
        </StepNavigation>
      </form>
    </>
  );
};
