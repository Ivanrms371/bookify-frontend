import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// API day keys are business calendar dates, not UTC timestamps.
export const formatChartDate = (day: string) => format(parseISO(day), 'd MMMM', { locale: es });
export const formatChartTooltipDate = (day: string) => {
  const label = format(parseISO(day), "eeee, dd 'de' MMMM", { locale: es });
  return label.charAt(0).toUpperCase() + label.slice(1);
};
