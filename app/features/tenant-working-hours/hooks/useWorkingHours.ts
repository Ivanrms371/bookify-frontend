import { useState } from 'react';
import {
  DAYS_OF_WEEK,
  DEFAULT_INTERVALS,
  DEFAULT_SCHEDULE,
  type DayOfWeek,
  type DaySchedule,
  type Interval,
  type WeeklySchedule,
} from '@/shared/constants/week-days';
import { mapScheduleToDTO } from '../utils/map-schedule-to-dto';
import { useCreateWorkingHours } from './useCreateWorkingHours';
import { toast } from 'sonner';

interface Props {
  onSuccessAction?: () => void;
  tenantId: string;
  initialSchedule?: WeeklySchedule;
}

export const useWorkingHours = ({ onSuccessAction, tenantId, initialSchedule }: Props) => {
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>(initialSchedule || DEFAULT_SCHEDULE);

  const { mutateAsync: createWorkingHours } = useCreateWorkingHours(tenantId);

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

    setWeeklySchedule(updated);
  };

  const onToggleDay = (day: DayOfWeek) => {
    setWeeklySchedule((prev) => {
      const firstActiveDay = getFirstActiveDay();
      const intervals = firstActiveDay ? firstActiveDay.intervals : DEFAULT_INTERVALS;
      return {
        ...prev,
        [day]: {
          ...prev[day],
          isActive: !prev[day].isActive,
          intervals,
        },
      };
    });
  };

  const onActivateDay = (day: DayOfWeek) => {
    setWeeklySchedule((prev) => {
      const firstActiveDay = getFirstActiveDay();
      const intervals = firstActiveDay ? firstActiveDay.intervals : DEFAULT_INTERVALS;
      return {
        ...prev,
        [day]: {
          ...prev[day],
          isActive: true,
          intervals,
        },
      };
    });
  };

  const onDeactivateDay = (day: DayOfWeek) => {
    setWeeklySchedule((prev) => {
      return {
        ...prev,
        [day]: { ...prev[day], isActive: false, intervals: [] },
      };
    });
  };

  const onAddInterval = (day: DayOfWeek) => {
    setWeeklySchedule((prev) => {
      return {
        ...prev,
        [day]: {
          ...prev[day],
          intervals: [...prev[day].intervals, { opens: '', closes: '' }],
        },
      };
    });
  };

  const onRemoveInterval = (day: DayOfWeek, intervalIndex: number) => {
    setWeeklySchedule((prev) => {
      return {
        ...prev,
        [day]: {
          ...prev[day],
          intervals: prev[day].intervals.filter((_, i) => i !== intervalIndex),
        },
      };
    });
  };

  const onIntervalChange = (day: DayOfWeek, intervalIndex: number, interval: Interval) => {
    setWeeklySchedule((prev) => {
      const updated = { ...prev };
      updated[day].intervals[intervalIndex] = interval;
      return updated;
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(weeklySchedule);

    try {
      const workingHours = mapScheduleToDTO(weeklySchedule);
      onSuccessAction?.();
    } catch (error) {
      toast.error('Error al guardar los horarios de trabajo', {
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };

  return {
    weeklySchedule,
    setWeeklySchedule,
    copyToAll,
    onToggleDay,
    onActivateDay,
    onDeactivateDay,
    onAddInterval,
    onRemoveInterval,
    onIntervalChange,
    onSubmit,
  };
};
