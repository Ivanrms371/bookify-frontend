import { useFormContext } from 'react-hook-form';

import type { DayOfWeek } from '@/shared/constants/week-days';
import { intervalSchema, type SaveWorkingHours } from '../schemas/schedule-form-schema';

export const useWorkingHoursForm = () => {
  const { getValues, setValue, watch } = useFormContext<SaveWorkingHours>();

  const workingHours = watch('workingHours');

  const getDayIndex = (day: DayOfWeek) => {
    return workingHours.findIndex((item) => item.dayOfWeek === day);
  };

  const onToggleDay = (day: DayOfWeek) => {
    const currentWorkingHours = getValues('workingHours');

    const dayIndex = currentWorkingHours.findIndex((item) => item.dayOfWeek === day);

    if (dayIndex === -1) return;

    const currentDay = currentWorkingHours[dayIndex];

    setValue(`workingHours.${dayIndex}.isActive`, !currentDay.isActive, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const copyToAll = (day: DayOfWeek) => {
    const currentWorkingHours = getValues('workingHours');

    const source = currentWorkingHours.find((item) => item.dayOfWeek === day);

    if (
      !source ||
      !source.isActive ||
      source.intervals.length === 0 ||
      !source.intervals.every((interval) => intervalSchema.safeParse(interval).success)
    )
      return false;

    currentWorkingHours.forEach((item, index) => {
      if (!item.isActive || item.dayOfWeek === source.dayOfWeek) return;

      setValue(
        `workingHours.${index}.intervals`,
        source.intervals.map((interval) => ({
          ...interval,
        })),
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      );
    });
    return true;
  };

  return {
    workingHours,
    getDayIndex,
    onToggleDay,
    copyToAll,
  };
};
