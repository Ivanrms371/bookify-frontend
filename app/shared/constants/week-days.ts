import type { ScheduleWorkingHour } from '@/features/schedule/schemas/schedule-form-schema';

export const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export type ScheduleInterval = {
  opensAt: string;
  closesAt: string;
};

export const DEFAULT_INTERVALS: ScheduleInterval[] = [
  { opensAt: '09:00', closesAt: '12:00' },
  { opensAt: '14:00', closesAt: '18:00' },
];

const WEEKEND_DAYS: DayOfWeek[] = ['saturday', 'sunday'];

export const DEFAULT_SCHEDULE: ScheduleWorkingHour[] = DAYS_OF_WEEK.map((dayOfWeek) => {
  const isActive = !WEEKEND_DAYS.includes(dayOfWeek);

  return {
    dayOfWeek,
    isActive,
    intervals: isActive ? DEFAULT_INTERVALS.map((interval) => ({ ...interval })) : [],
  };
});

export const DAY_LABELS: Record<DayOfWeek, { full: string; short: string }> = {
  monday: { full: 'Lunes', short: 'Lun' },
  tuesday: { full: 'Martes', short: 'Mar' },
  wednesday: { full: 'Miércoles', short: 'Mié' },
  thursday: { full: 'Jueves', short: 'Jue' },
  friday: { full: 'Viernes', short: 'Vie' },
  saturday: { full: 'Sábado', short: 'Sáb' },
  sunday: { full: 'Domingo', short: 'Dom' },
};
