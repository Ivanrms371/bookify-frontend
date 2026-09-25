import type { DayOfWeek } from '@/shared/constants/week-days';

export type ScheduleInterval = {
  opens: string;
  closes: string;
};

export type ScheduleWorkingHour = {
  day: DayOfWeek;
  isActive: boolean;
  intervals: ScheduleInterval[];
};
