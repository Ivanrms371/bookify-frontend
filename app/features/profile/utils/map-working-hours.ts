import { DAYS_OF_WEEK } from '@/shared/constants/week-days';
import type { SaveWorkingHours } from '@/features/schedule/schemas/schedule-form-schema';

type WorkingHoursRow = { dayOfWeek: number; opensAt: number; closesAt: number };

// DB stores 0 = Sunday, DAYS_OF_WEEK starts on Monday
const DB_DAY_INDEX = [1, 2, 3, 4, 5, 6, 0];

const minutesToTime = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

export const mapWorkingHoursToForm = (rows: WorkingHoursRow[] = []): SaveWorkingHours => ({
  workingHours: DAYS_OF_WEEK.map((dayOfWeek, index) => {
    const intervals = rows
      .filter((row) => row.dayOfWeek === DB_DAY_INDEX[index])
      .map((row) => ({ opensAt: minutesToTime(row.opensAt), closesAt: minutesToTime(row.closesAt) }));

    return { dayOfWeek, isActive: intervals.length > 0, intervals };
  }),
});
