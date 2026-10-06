import type { AppointmentStatus } from './appointments-types';

export type CalendarState = AppointmentStatus | 'all';
export type CalendarOrder = 'latest' | 'hour-asc' | 'hour-desc';
export type AgendaFilters = { state: CalendarState; order: CalendarOrder; professionalId: string };
export type AgendaState = AgendaFilters & { selectedDate: string; page: number };
export type AgendaAction =
  | { type: 'date'; date: string }
  | { type: 'filters'; filters: AgendaFilters }
  | { type: 'clear' }
  | { type: 'page'; page: number };
