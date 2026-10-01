import { Text } from '@/shared/components/typography';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export function AppointmentSelectionSummary({
  serviceName,
  professionalName,
  date,
  time,
}: {
  serviceName?: string | null;
  professionalName?: string | null;
  date: string;
  time?: string | null;
}) {
  return (
    <div className="mr-auto hidden min-w-0 flex-col sm:flex" aria-live="polite">
      <Text className="truncate text-base font-semibold text-gray-800">
        {serviceName ?? 'Sin servicio'} {professionalName ? `con ${professionalName}` : ''}
      </Text>
      <Text className="text-sm font-medium text-gray-500">
        {format(parseISO(date), "d 'de' MMMM", { locale: es })} {time ? `· ${time}` : '· Elegí un horario'}
      </Text>
    </div>
  );
}
