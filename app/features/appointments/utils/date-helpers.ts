import { addDays, format, eachDayOfInterval, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface GeneratedDate {
  date: string;
  dayNumber: string;
  label: string;
}

export function getUpcomingDays(daysCount: number = 30): GeneratedDate[] {
  const today = new Date();

  const daysArray = eachDayOfInterval({
    start: today,
    end: addDays(today, daysCount - 1),
  });

  return daysArray.map((date) => {
    const rawShortDay = format(date, 'EEE', { locale: es });
    const cleanShortDay = rawShortDay.replace('.', '');

    return {
      date: date.toISOString().split('T')[0],
      dayNumber: format(date, 'd'),
      label: cleanShortDay,
    };
  });
}

export const formatDisplayDate = (date: string) => format(parseISO(date), "EEEE, d 'de' MMMM", { locale: es });

export const formatTime = (date: string) => format(parseISO(date), 'HH:mm');
