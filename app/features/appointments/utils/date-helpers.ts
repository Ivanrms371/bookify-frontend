import { addDays, format, eachDayOfInterval, parseISO, subDays } from 'date-fns';
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

export function getStaffBookingDays(daysBefore: number = 7, daysAfter: number = 21): GeneratedDate[] {
  const today = new Date();

  const daysArray = eachDayOfInterval({
    start: subDays(today, daysBefore),
    end: addDays(today, daysAfter),
  });

  return daysArray.map((date) => {
    const rawShortDay = format(date, 'EEE', { locale: es });
    const cleanShortDay = rawShortDay.replace('.', '');

    return {
      date: format(date, 'yyyy-MM-dd'),
      dayNumber: format(date, 'd'),
      label: cleanShortDay,
    };
  });
}

export function getStaticStaffTimeSlots() {
  return Array.from({ length: 25 }, (_, index) => {
    const totalMinutes = 8 * 60 + index * 30;
    const hours = Math.floor(totalMinutes / 60)
      .toString()
      .padStart(2, '0');
    const minutes = (totalMinutes % 60).toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  });
}

export const formatDisplayDate = (date: string) => format(parseISO(date), "EEEE, d 'de' MMMM", { locale: es });

export const formatTime = (date: string) => format(parseISO(date), 'HH:mm');
