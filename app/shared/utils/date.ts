import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

//
// Return the date in the format "dd 'de' MMMM". Example: "24 de julio"
//
export const formatDateShort = (date: Date | string | number): string => {
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

    return format(d, 'd MMMM', { locale: es });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

//
// Return the date in the format "Day, dd 'de' Month". Example: "Lunes, 24 de julio"
//
export const formatDateFull = (date: Date | string | number): string => {
  try {
    const d = new Date(date);
    const dateString = format(d, "eeee, dd 'de' MMMM", { locale: es });
    return dateString.charAt(0).toUpperCase() + dateString.slice(1);
  } catch {
    return '';
  }
};

//
// Return the date in the format "dd/MM/yyyy"
//
export const formatDateDMY = (date: Date | string | number): string => {
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

    return format(d, 'dd/MM/yyyy', { locale: es });
  } catch (error) {
    console.error('Error formatting date:', error);
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

export const formatWeekdayShort = (date: Date | string | number): string => {
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

    const weekday = format(d, 'EEE', { locale: es });

    return weekday.charAt(0).toUpperCase() + weekday.slice(1);
  } catch {
    return '';
  }
};
