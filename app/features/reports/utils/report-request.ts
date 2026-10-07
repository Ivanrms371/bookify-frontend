import { differenceInCalendarDays, isMatch, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import type { ReportsFilters, ReportsRequest } from '../types/reports.types';

export function normalizeReportRequest(filters: ReportsFilters): ReportsRequest {
  return {
    period: filters.period,
    ...(filters.period === 'custom' ? { startDate: filters.startDate, endDate: filters.endDate } : {}),
    ...(filters.professionalId !== 'all' ? { professionalId: filters.professionalId } : {}),
    ...(filters.serviceId !== 'all' ? { serviceId: filters.serviceId } : {}),
  };
}

export function validateReportDates(filters: ReportsFilters, timeZone?: string): string | undefined {
  if (filters.period !== 'custom') return undefined;
  if (!filters.startDate || !filters.endDate) return 'Selecciona las fechas Desde y Hasta.';
  const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && isMatch(value, 'yyyy-MM-dd');
  if (!validDate(filters.startDate) || !validDate(filters.endDate)) return 'Selecciona fechas válidas.';
  const days = differenceInCalendarDays(parseISO(filters.endDate), parseISO(filters.startDate)) + 1;
  if (days < 1) return 'Hasta debe ser igual o posterior a Desde.';
  if (days > 366) return 'El período no puede superar los 366 días.';
  if (timeZone && filters.endDate > formatInTimeZone(new Date(), timeZone, 'yyyy-MM-dd')) return 'Hasta no puede ser posterior a hoy.';
  return undefined;
}
