import { type WeeklySchedule, type DayOfWeek } from '@/shared/constants/week-days';
import type { TenantSettingsResponse } from '../../settings/types/settings.types';

export const INT_TO_DAY_OF_WEEK = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
} as const;

export function mapDbToSchedule(tenantWorkingHours: TenantSettingsResponse['tenantWorkingHours']): WeeklySchedule {
  const schedule: WeeklySchedule = {
    monday: { isActive: false, intervals: [] },
    tuesday: { isActive: false, intervals: [] },
    wednesday: { isActive: false, intervals: [] },
    thursday: { isActive: false, intervals: [] },
    friday: { isActive: false, intervals: [] },
    saturday: { isActive: false, intervals: [] },
    sunday: { isActive: false, intervals: [] },
  };

  if (!tenantWorkingHours || tenantWorkingHours.length === 0) {
    return schedule;
  }

  // Sort by opensAt first to ensure intervals are in order
  const sorted = [...tenantWorkingHours].sort((a, b) => a.opensAt - b.opensAt);

  sorted.forEach((dbRow) => {
    const day = INT_TO_DAY_OF_WEEK[dbRow.dayOfWeek as keyof typeof INT_TO_DAY_OF_WEEK];
    if (day) {
      schedule[day].isActive = true;
      schedule[day].intervals.push({
        opens: minutesToTimeStr(dbRow.opensAt),
        closes: minutesToTimeStr(dbRow.closesAt),
      });
    }
  });

  return schedule;
}

export function minutesToTimeStr(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}
