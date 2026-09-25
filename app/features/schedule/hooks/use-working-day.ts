import { useFieldArray, useFormContext } from 'react-hook-form';

import type { SaveWorkingHours } from '../schemas/schedule-form-schema';

export const useWorkingDay = (dayIndex: number) => {
  const { control } = useFormContext<SaveWorkingHours>();

  return useFieldArray({
    control,
    name: `workingHours.${dayIndex}.intervals`,
  });
};
