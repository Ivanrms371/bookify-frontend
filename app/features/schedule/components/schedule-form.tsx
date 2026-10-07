import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { workingHoursSchema, type SaveWorkingHours } from '../schemas/schedule-form-schema';
import { DEFAULT_SCHEDULE } from '@/shared/constants/week-days';
import { zodResolver } from '@hookform/resolvers/zod';
import { DayScheduleRow } from './day-schedule-row';
import { useEffect, useRef, type ReactNode } from 'react';
import { FloatingSaveBar } from '@/shared/components/form/floating-save-bar';
import { useSettingsDraft } from '@/features/settings/hooks/use-settings-draft';

interface Props {
  id?: string;
  defaultValues?: SaveWorkingHours | null;
  onSubmit: (data: SaveWorkingHours) => void | Promise<void>;
  children?: ReactNode;
  showSaveBar?: boolean;
  readOnly?: boolean;
}

export const ScheduleForm = ({ id = 'schedule-form', defaultValues, onSubmit, children, showSaveBar = false, readOnly = false }: Props) => {
  const initialValues: SaveWorkingHours = defaultValues ?? {
    workingHours: DEFAULT_SCHEDULE,
  };

  const methods = useForm<SaveWorkingHours>({
    defaultValues: initialValues,
    resolver: zodResolver(workingHoursSchema),
  });
  const { isDirty, isSubmitting } = methods.formState;
  const { reset } = methods;
  const dirtyRef = useRef(isDirty);
  dirtyRef.current = isDirty;
  useSettingsDraft(id, isDirty, isSubmitting);
  useEffect(() => {
    if (defaultValues && !dirtyRef.current) reset(defaultValues);
  }, [defaultValues, reset]);
  const submit = async (values: SaveWorkingHours) => {
    try {
      await onSubmit(values);
      reset(values);
    } catch {
      // The owner of the save action renders its failure; retain edits for retry.
    }
  };

  const { fields } = useFieldArray({
    control: methods.control,
    name: 'workingHours',
  });

  return (
    <FormProvider {...methods}>
      <form id={id} onSubmit={methods.handleSubmit(submit)} className="relative">
        <fieldset disabled={readOnly || isSubmitting} className="@container min-w-0 space-y-3">
          {fields.map((field, index) => (
            <DayScheduleRow key={field.id} dayIndex={index} />
          ))}
        </fieldset>
        {children}
        {showSaveBar && !readOnly && (
          <FloatingSaveBar isDirty={isDirty} isSubmitting={isSubmitting} onReset={() => reset(defaultValues ?? initialValues)} />
        )}
      </form>
    </FormProvider>
  );
};
