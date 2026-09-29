import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { workingHoursSchema, type SaveWorkingHours } from '../schemas/schedule-form-schema';
import { DEFAULT_SCHEDULE } from '@/shared/constants/week-days';
import { zodResolver } from '@hookform/resolvers/zod';
import { DayScheduleRow } from './day-schedule-row';
import type { ReactNode } from 'react';

interface Props {
  id?: string;
  defaultValues?: SaveWorkingHours | null;
  onSubmit: (data: SaveWorkingHours) => void | Promise<void>;
  children?: ReactNode;
}

export const ScheduleForm = ({ id = 'schedule-form', defaultValues, onSubmit, children }: Props) => {
  const initialValues: SaveWorkingHours = defaultValues ?? {
    workingHours: DEFAULT_SCHEDULE,
  };

  const methods = useForm<SaveWorkingHours>({
    defaultValues: initialValues,
    resolver: zodResolver(workingHoursSchema),
  });

  const { fields } = useFieldArray({
    control: methods.control,
    name: 'workingHours',
  });

  return (
    <FormProvider {...methods}>
      <form id={id} onSubmit={methods.handleSubmit(onSubmit)} className="relative">
        <div className="@container pl-0.5 pr-2 space-y-5 overflow-x-hidden custom-scrollbar">
          {fields.map((field, index) => (
            <DayScheduleRow key={field.id} dayIndex={index} />
          ))}
        </div>
        {children}
      </form>
    </FormProvider>
  );
};
