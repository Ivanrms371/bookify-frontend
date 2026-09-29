import { Text } from '@/shared/components/typography';
import { Button, StatusPlaceholder } from '@/shared/components/ui';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { useAppointmentWizard } from '../appointment-wizard-context';
import { ScheduleDayPicker } from './components/schedule-day-picker';
import { ScheduleTimeGrid } from './components/schedule-time-grid';
import { StepNavigation } from '../step-navigation';
import { useAvailabilityProfessional } from '@/features/availability/hooks/use-availability-professional';
import { useState } from 'react';
import { formatDisplayDate } from '@/features/appointments/utils/date-helpers';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { useCreateAppointment } from '@/features/appointments/hooks/use-create-appointment';
import { createAppointmentSchema } from '@/features/appointments/schemas/create-appointment-schema';

export const ScheduleSelectionStep = () => {
  const { state, updateData, prevStep } = useAppointmentWizard();
  const { professionalId, serviceId, date } = state.data;

  const { data: availabilityData, isLoading } = useAvailabilityProfessional(professionalId, { serviceId, date });

  const { mutate: createAppointment } = useCreateAppointment();

  const handleSelectDate = (date: string) => {
    updateData({ date });
  };

  const handleSelectSlot = (slot: string) => {
    updateData({ time: slot });
  };

  const handleCreateAppointment = () => {
    const { customerId, serviceId, professionalId, date, time } = state.data;
    if (!serviceId || !professionalId || !time || !date) return;

    const parsed = createAppointmentSchema.parse({
      serviceId,
      professionalId,
      startsAt: new Date(`${date}T${time}:00`).toISOString(),
      ...(customerId ? { customerId } : {}),
    });

    createAppointment(parsed);
  };

  return (
    <>
      <ScheduleDayPicker onSelectDate={handleSelectDate} />

      <ScheduleTimeGrid
        isLoading={isLoading}
        onSelectSlot={handleSelectSlot}
        slots={availabilityData?.slots || []}
        nextAvailableDate={availabilityData?.nextAvailableDate || null}
        date={availabilityData?.date ?? ''}
        onSelectDate={handleSelectDate}
      />

      <StepNavigation nextLabel="Crear turno" onPrev={prevStep} onNext={handleCreateAppointment} />
    </>
  );
};
