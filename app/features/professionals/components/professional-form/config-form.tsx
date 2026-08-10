import { FormField } from '@/shared/components/form/FormField';
import { Input } from '@/shared/components/form/input';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { ProfessionalFormValues } from '../../schemas/professional-form-schema';

export const ConfigForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProfessionalFormValues>();

  return (
    <div className="space-y-4 pt-2 px-1">
      <FormField label="Intervalo de Turnos (minutos)" id="slotIntervalMinutes" error={errors.slotIntervalMinutes?.message}>
        <Input type="number" id="slotIntervalMinutes" {...register('slotIntervalMinutes', { valueAsNumber: true })} />
      </FormField>
      <FormField label="Días Máximos de Anticipación" id="maxAdvancedDays" error={errors.maxAdvancedDays?.message}>
        <Input type="number" id="maxAdvancedDays" {...register('maxAdvancedDays', { valueAsNumber: true })} />
      </FormField>
      <FormField label="Minutos mínimos de anticipación" id="minAdvancedMinutes" error={errors.minAdvancedMinutes?.message}>
        <Input type="number" id="minAdvancedMinutes" {...register('minAdvancedMinutes', { valueAsNumber: true })} />
      </FormField>
    </div>
  );
};
