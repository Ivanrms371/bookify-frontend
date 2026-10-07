import type { SaveWorkingHours } from '../schemas/schedule-form-schema';
import type { TenantWorkingHoursSaveInput } from '../types/tenant-working-hours.types';

export const mapScheduleToDTO = (data: SaveWorkingHours): TenantWorkingHoursSaveInput => {
  const workingHours = data.workingHours
    .filter((item) => item.isActive)
    .map((item) => ({
      dayOfWeek: item.dayOfWeek,
      intervals: item.intervals.map((interval) => ({
        opensAt: interval.opensAt,
        closesAt: interval.closesAt,
      })),
    }));

  return { workingHours };
};
