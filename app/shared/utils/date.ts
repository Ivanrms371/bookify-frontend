import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDateShort = (date: Date | string | number): string => {
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

    return format(d, 'dd MMM', { locale: es });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

export const formatDateFull = (date: Date | string | number): string => {
  try {
    const d = new Date(date);
    const dateString = format(d, "eeee, dd 'de' MMMM", { locale: es });
    return dateString.charAt(0).toUpperCase() + dateString.slice(1);
  } catch {
    return '';
  }
};

export const formatRelativeTime = (date: Date | string | number): string => {
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

    return formatDistanceToNow(d, {
      addSuffix: true,
      locale: es,
    });
  } catch {
    return 'Justo ahora';
  }
};
