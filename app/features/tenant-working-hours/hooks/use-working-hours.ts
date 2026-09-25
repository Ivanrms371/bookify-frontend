// use-working-hours-form.ts

import { useFormContext, useFieldArray } from 'react-hook-form';

import { DEFAULT_INTERVALS, type DayOfWeek } from '@/shared/constants/week-days';
import type {} from '../types/tenant-working-hours.types';
import type { SaveWorkingHours } from '@/features/schedule/schemas/schedule-form-schema';

export const useWorkingHoursForm = () => {
  const { control, getValues, setValue, watch } = useFormContext<SaveWorkingHours>();

  const workingHours = watch('workingHours');

  const getDayIndex = (day: DayOfWeek) => workingHours.findIndex((item) => item.day === day);

  const getIntervalsFieldArray = (day: DayOfWeek) => {
    const dayIndex = getDayIndex(day);

    return useFieldArray({
      control,
      name: `workingHours.${dayIndex}.intervals`,
    });
  };

  const onActivateDay = (day: DayOfWeek) => {
    const workingHours = getValues('workingHours');
    const dayIndex = workingHours.findIndex((item) => item.day === day);

    if (dayIndex === -1) return;

    const firstActiveDay = workingHours.find((item) => item.isActive && item.day !== day);

    setValue(
      `workingHours.${dayIndex}`,
      {
        ...workingHours[dayIndex],
        isActive: true,
        intervals: firstActiveDay
          ? firstActiveDay.intervals.map((interval) => ({
              ...interval,
            }))
          : DEFAULT_INTERVALS.map((interval) => ({
              ...interval,
            })),
      },
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  const onDeactivateDay = (day: DayOfWeek) => {
    const workingHours = getValues('workingHours');
    const dayIndex = workingHours.findIndex((item) => item.day === day);

    if (dayIndex === -1) return;

    setValue(
      `workingHours.${dayIndex}`,
      {
        ...workingHours[dayIndex],
        isActive: false,
        intervals: [],
      },
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  const onToggleDay = (day: DayOfWeek) => {
    const workingHours = getValues('workingHours');
    const daySchedule = workingHours.find((item) => item.day === day);

    if (!daySchedule) return;

    if (daySchedule.isActive) {
      onDeactivateDay(day);
    } else {
      onActivateDay(day);
    }
  };

  const copyToAll = (day: DayOfWeek) => {
    const workingHours = getValues('workingHours');

    const source = workingHours.find((item) => item.day === day);

    if (!source) return;

    workingHours.forEach((item, index) => {
      if (!item.isActive || item.day === day) return;

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
  };

  return {
    control,
    workingHours,
    getDayIndex,
    getIntervalsFieldArray,
    onToggleDay,
    onActivateDay,
    onDeactivateDay,
    copyToAll,
  };
};
