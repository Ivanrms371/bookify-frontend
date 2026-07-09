import { type WeeklySchedule, DAYS_OF_WEEK } from '@/shared/constants/week-days';
import type { TenantWorkingHoursSaveInput } from '../types/tenant-working-hours.types';

export interface ApiInterval {
  opensAt: string;
  closesAt: string;
}

export interface ApiDaySchedule {
  dayOfWeek: string;
  intervals: ApiInterval[];
}

export interface WorkingHoursDTO {
  workingHours: ApiDaySchedule[];
}

export const mapScheduleToDTO = (schedule: WeeklySchedule): TenantWorkingHoursSaveInput => {
  const workingHours = DAYS_OF_WEEK.filter((day) => schedule[day].isActive).map((day) => {
    const dayData = schedule[day];

    return {
      dayOfWeek: day,
      intervals: dayData.intervals.map((interval) => ({
        opensAt: interval.opens,
        closesAt: interval.closes,
      })),
    };
  });

  return { workingHours };
};
