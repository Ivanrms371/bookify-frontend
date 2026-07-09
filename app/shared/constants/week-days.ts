const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export type Interval = {
  opens: string;
  closes: string;
};

export type DaySchedule = {
  isActive: boolean;
  intervals: Interval[];
};

export type WeeklySchedule = Record<DayOfWeek, DaySchedule>;

const DEFAULT_INTERVALS: Interval[] = [
  {
    opens: '09:00',
    closes: '12:00',
  },
  {
    opens: '14:00',
    closes: '18:00',
  },
];

const DEFAULT_SCHEDULE: WeeklySchedule = {
  monday: {
    isActive: true,
    intervals: DEFAULT_INTERVALS,
  },
  tuesday: {
    isActive: true,
    intervals: DEFAULT_INTERVALS,
  },
  wednesday: {
    isActive: true,
    intervals: DEFAULT_INTERVALS,
  },
  thursday: {
    isActive: true,
    intervals: DEFAULT_INTERVALS,
  },
  friday: {
    isActive: true,
    intervals: DEFAULT_INTERVALS,
  },
  saturday: { isActive: false, intervals: [] },
  sunday: { isActive: false, intervals: [] },
};

const DAY_LABELS: Record<DayOfWeek, { full: string; short: string }> = {
  monday: { full: 'Lunes', short: 'Lun' },
  tuesday: { full: 'Martes', short: 'Mar' },
  wednesday: { full: 'Miércoles', short: 'Mié' },
  thursday: { full: 'Jueves', short: 'Jue' },
  friday: { full: 'Viernes', short: 'Vie' },
  saturday: { full: 'Sábado', short: 'Sáb' },
  sunday: { full: 'Domingo', short: 'Dom' },
};

export { DAYS_OF_WEEK, DEFAULT_SCHEDULE, DAY_LABELS, DEFAULT_INTERVALS };
