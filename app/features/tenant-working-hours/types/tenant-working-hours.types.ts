import type { DayOfWeek } from '@/shared/constants/week-days';

type ScheduleInterval = {
  opensAt: string;
  closesAt: string;
};

type ScheduleWorkingHour = {
  dayOfWeek: DayOfWeek;
  intervals: ScheduleInterval[];
};

export type TenantWorkingHoursSaveInput = {
  workingHours: ScheduleWorkingHour[];
};
