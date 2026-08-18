import { format, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import type { ScheduleException } from '../types/schedule-exception.types';

export const formatExceptionDates = (startDate: string, endDate: string) => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  if (isSameDay(start, end)) {
    return format(start, "d 'de' MMMM, yyyy", { locale: es });
  }
  return `${format(start, "d 'de' MMMM", { locale: es })} - ${format(end, "d 'de' MMMM, yyyy", { locale: es })}`;
};

export const formatExceptionDetails = (exception: ScheduleException) => {
  if (exception.isClosed) {
    return 'Cerrado todo el día';
  }
  if (exception.blocks && exception.blocks.length > 0) {
    return exception.blocks.map((b) => `${b.opensAt} a ${b.closesAt}`).join(', ');
  }
  return 'Horario modificado';
};
