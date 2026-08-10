import { useFormContext } from 'react-hook-form';
import {
  DAYS_OF_WEEK,
  DEFAULT_INTERVALS,
  type DayOfWeek,
  type DaySchedule,
  type Interval,
  type WeeklySchedule,
} from '@/shared/constants/week-days';

export const useWorkingHoursForm = () => {
  const { watch, setValue } = useFormContext();

  // The form state holds the format expected by the backend
  const workingHours = watch('schedule.workingHours') || [];

  // Reconstruct WeeklySchedule object for the UI components
  const weeklySchedule: WeeklySchedule = DAYS_OF_WEEK.reduce((acc, day) => {
    const dayData = workingHours.find((w: any) => w.dayOfWeek === day);
    if (dayData) {
      acc[day] = {
        isActive: true,
        intervals: dayData.intervals.map((i: any) => ({
          opens: i.opensAt,
          closes: i.closesAt,
        })),
      };
    } else {
      acc[day] = { isActive: false, intervals: [] };
    }
    return acc;
  }, {} as WeeklySchedule);

  const syncToForm = (newSchedule: WeeklySchedule) => {
    const newWorkingHours = Object.entries(newSchedule)
      .filter(([_, dayData]) => dayData.isActive)
      .map(([dayOfWeek, dayData]) => ({
        dayOfWeek,
        intervals: dayData.intervals.map((i) => ({
          opensAt: i.opens,
          closesAt: i.closes,
        })),
      }));
    setValue('schedule.workingHours', newWorkingHours, { shouldValidate: true, shouldDirty: true });
  };

  const getFirstActiveDay = (): DaySchedule | null => {
    for (const day of DAYS_OF_WEEK) {
      const daySchedule = weeklySchedule[day];
      if (daySchedule.isActive) {
        return daySchedule;
      }
    }
    return null;
  };

  const copyToAll = (day: DayOfWeek) => {
    const current = weeklySchedule[day];

    const updated = Object.fromEntries(
      DAYS_OF_WEEK.map((d) => {
        const daySchedule = weeklySchedule[d];

        if (!daySchedule.isActive) {
          return [d, daySchedule];
        }

        return [
          d,
          {
            isActive: current.isActive,
            intervals: current.intervals.map((i) => ({ ...i })),
          },
        ];
      }),
    ) as WeeklySchedule;

    syncToForm(updated);
  };

  const onToggleDay = (day: DayOfWeek) => {
    const firstActiveDay = getFirstActiveDay();
    const intervals = firstActiveDay ? firstActiveDay.intervals : DEFAULT_INTERVALS;
    syncToForm({
      ...weeklySchedule,
      [day]: {
        ...weeklySchedule[day],
        isActive: !weeklySchedule[day].isActive,
        intervals,
      },
    });
  };

  const onActivateDay = (day: DayOfWeek) => {
    const firstActiveDay = getFirstActiveDay();
    const intervals = firstActiveDay ? firstActiveDay.intervals : DEFAULT_INTERVALS;
    syncToForm({
      ...weeklySchedule,
      [day]: {
        ...weeklySchedule[day],
        isActive: true,
        intervals,
      },
    });
  };

  const onDeactivateDay = (day: DayOfWeek) => {
    syncToForm({
      ...weeklySchedule,
      [day]: { ...weeklySchedule[day], isActive: false, intervals: [] },
    });
  };

  const onAddInterval = (day: DayOfWeek) => {
    syncToForm({
      ...weeklySchedule,
      [day]: {
        ...weeklySchedule[day],
        intervals: [...weeklySchedule[day].intervals, { opens: '', closes: '' }],
      },
    });
  };

  const onRemoveInterval = (day: DayOfWeek, intervalIndex: number) => {
    syncToForm({
      ...weeklySchedule,
      [day]: {
        ...weeklySchedule[day],
        intervals: weeklySchedule[day].intervals.filter((_, i) => i !== intervalIndex),
      },
    });
  };

  const onIntervalChange = (day: DayOfWeek, intervalIndex: number, interval: Interval) => {
    const updated = { ...weeklySchedule };
    // Create a new intervals array to avoid mutating the existing one directly
    const updatedIntervals = [...updated[day].intervals];
    updatedIntervals[intervalIndex] = interval;
    updated[day] = { ...updated[day], intervals: updatedIntervals };
    syncToForm(updated);
  };

  return {
    weeklySchedule,
    copyToAll,
    onToggleDay,
    onActivateDay,
    onDeactivateDay,
    onAddInterval,
    onRemoveInterval,
    onIntervalChange,
  };
};
