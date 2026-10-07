import { DAYS_OF_WEEK } from '@/shared/constants/week-days';
import type { SaveWorkingHours } from '../schemas/schedule-form-schema';
import type { BusinessHour } from '../types/tenant-working-hours.types';
export function workingHoursToForm(hours: BusinessHour[]): SaveWorkingHours {
  if (!Array.isArray(hours)) throw new Error('Respuesta de horarios inválida');
  return {
    workingHours: DAYS_OF_WEEK.map((dayOfWeek) => {
      const day = hours.find((row) => row.day.toLowerCase() === dayOfWeek);
      return {
        dayOfWeek,
        isActive: day?.isActive ?? false,
        intervals: (day?.intervals ?? []).map((interval) => ({ opensAt: interval.opens, closesAt: interval.closes })),
      };
    }),
  };
}
