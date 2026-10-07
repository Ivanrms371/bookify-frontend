import type { SaveWorkingHours } from '../schemas/schedule-form-schema';
export interface BusinessHour {
  day: string;
  isActive: boolean;
  intervals: Array<{ opens: string; closes: string }>;
}
export interface TenantWorkingHoursSaveInput {
  workingHours: Array<{
    dayOfWeek: SaveWorkingHours['workingHours'][number]['dayOfWeek'];
    intervals: Array<{ opensAt: string; closesAt: string }>;
  }>;
}
