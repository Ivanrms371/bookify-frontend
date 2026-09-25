import { CalendarIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/16/solid';
import { cn } from '@/shared/utils/cn';
import { Text } from '@/shared/components/typography';
import { Button, Card, StatusPlaceholder } from '@/shared/components/ui';
import { useDashboard } from '../hooks/useDashboard';
import type { UpcomingAppointment } from '../types/appointment.types';

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('es-UY', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

<div className="flex flex-1 flex-col items-center justify-center gap-3 py-12">
  <div className="rounded-full bg-gray-100 p-4 shadow-sm">
    <CalendarIcon className="size-6 text-gray-600 " />
  </div>
  <Text className="text-sm">No hay turnos próximos para hoy</Text>
  <Button variant="primary" icon={<PlusIcon className="size-4" />} iconPosition="left" type="button" size="sm">
    Nueva cita
  </Button>
</div>;

export const UpcomingAppointments = () => {
  const { data, isLoading } = useDashboard();
  const appointments: UpcomingAppointment[] = data?.upcomingAppointments ?? [];

  return (
    <Card className="flex h-full min-h-0 w-full flex-1 flex-col gap-5">
      {!isLoading && appointments.length === 0 ? (
        <StatusPlaceholder
          title="No tienes turnos programados"
          description="Los turnos aparecerán aquí cuando los clientes reserven uno."
          icon={<CalendarIcon className="size-6 text-gray-600 " />}
          action={() => {}}
          actionText="+ Nueva cita"
        />
      ) : (
        <>
          <Text className=" text-2xl text-gray-900">Próximos turnos</Text>
          <div className="max-h-[400px] overflow-y-auto pr-1">
            <table className="w-full text-left">
              <thead className="sticky top-0 z-10">
                <tr className="bg-white">
                  <th className="pr-2 pb-3 text-sm font-medium text-gray-600">Hora</th>
                  <th className="pr-2 pb-3 text-sm font-medium text-gray-600">Cliente</th>
                  <th className="hidden pr-2 pb-3 text-sm font-medium text-gray-600 xl:table-cell">Professional</th>
                  <th className="hidden pr-2 pb-3 text-sm font-medium text-gray-600 xl:table-cell">Duración</th>
                  <th className="pb-3 text-right text-sm font-medium text-gray-600">Total</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt, i) => (
                  <tr key={appt.id} className={cn('border-t border-gray-100 transition-colors', 'hover:bg-gray-50')}>
                    <td className="px-2 py-3">
                      <span className=" text-sm font-semibold text-gray-500">{formatTime(appt.startsAt)}</span>
                    </td>
                    <td className="px-2 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-800">{appt.customerName}</p>
                        <p className="truncate text-xs font-medium text-gray-400">+598 99 612 953 · #{appt.confirmationCode}</p>
                      </div>
                    </td>
                    <td className="hidden px-2 py-3 xl:table-cell">
                      <span className="text-sm text-gray-600">{appt.professional.name}</span>
                    </td>
                    <td className="hidden px-2 py-3 xl:table-cell">
                      <span className="text-sm text-gray-500">40 minutos</span>
                    </td>
                    <td className="px-2 py-3 text-right">
                      <span className=" text-sm font-semibold text-gray-800">$400</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Card>
  );
};

/* ─── Inline skeleton ─── */
const TableSkeleton = () => (
  <div className="flex flex-col gap-3 py-2">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-100 " />
        <div className="h-4 w-12 animate-pulse rounded bg-gray-100 " />
        <div className="h-4 w-20 animate-pulse rounded bg-gray-100 " />
        <div className="ml-auto h-4 w-14 animate-pulse rounded bg-gray-100 " />
        <div className="h-4 w-12 animate-pulse rounded bg-gray-100 " />
        <div className="size-8 animate-pulse rounded-full bg-gray-100 " />
      </div>
    ))}
  </div>
);
