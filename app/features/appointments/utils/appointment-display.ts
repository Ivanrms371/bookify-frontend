import { formatInTimeZone } from 'date-fns-tz';
import { formatDateDMY } from '@/shared/utils/date';
import { formatTime } from './date-helpers';

export const appointmentDisplayDate = (date: string, timeZone?: string | null) =>
  timeZone ? formatInTimeZone(date, timeZone, 'dd/MM/yyyy') : formatDateDMY(date);
export const appointmentDisplayTime = (date: string, timeZone?: string | null) =>
  timeZone ? formatInTimeZone(date, timeZone, 'HH:mm') : formatTime(date);
