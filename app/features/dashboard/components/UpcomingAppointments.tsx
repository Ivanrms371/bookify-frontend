import { CalendarIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/16/solid';
import { cn } from '@/shared/utils/cn';
import { Text } from '@/shared/components/typography';
import { Button, Card } from '@/shared/components/ui';
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

export const UpcomingAppointments = () => {
  const { data, isLoading } = useDashboard();
  const appointments: UpcomingAppointment[] = data?.upcomingAppointments ?? [];

  return (
    <Card className="flex h-full min-h-0 w-full flex-1 flex-col gap-5">
      {!isLoading && appointments.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12">
          <div className="rounded-full bg-mist-100 p-4 shadow-sm">
            <CalendarIcon className="size-6 text-mist-600 " />
          </div>
          <Text className="text-sm">No hay turnos próximos para hoy</Text>
          <Button variant="primary" icon={<PlusIcon className="size-4" />} iconPosition="left" type="button" size="sm">
            Nueva cita
          </Button>
        </div>
      ) : (
        <>
          <Text className="font-mono text-2xl text-mist-900 dark:text-white">Próximos turnos</Text>
          <div className="max-h-[400px] overflow-y-auto pr-1">
            <table className="w-full text-left">
              <thead className="sticky top-0 z-10">
                <tr className="bg-white dark:bg-mist-950">
                  <th className="pr-2 pb-3 text-sm font-medium text-mist-600 dark:text-mist-400">Hora</th>
                  <th className="pr-2 pb-3 text-sm font-medium text-mist-600 dark:text-mist-400">Cliente</th>
                  <th className="hidden pr-2 pb-3 text-sm font-medium text-mist-600 xl:table-cell dark:text-mist-400">Employee</th>
                  <th className="hidden pr-2 pb-3 text-sm font-medium text-mist-600 xl:table-cell dark:text-mist-400">Duración</th>
                  <th className="pb-3 text-right text-sm font-medium text-mist-600 dark:text-mist-400">Total</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt, i) => (
                  <tr
                    key={appt.id}
                    className={cn(
                      'border-t border-mist-100 transition-colors dark:border-mist-800/50',
                      'hover:bg-mist-50 dark:hover:bg-mist-900/30',
                    )}
                  >
                    <td className="px-2 py-3">
                      <span className="font-mono text-sm font-semibold text-mist-500 dark:text-mist-400">{formatTime(appt.startTime)}</span>
                    </td>
                    <td className="px-2 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-mist-800 dark:text-mist-100">{appt.customerName}</p>
                        <p className="truncate text-xs font-medium text-mist-400 dark:text-mist-500">
                          +598 99 612 953 · #{appt.confirmationCode}
                        </p>
                      </div>
                    </td>
                    <td className="hidden px-2 py-3 xl:table-cell">
                      <span className="text-sm text-mist-600 dark:text-mist-300">{appt.employee.displayName}</span>
                    </td>
                    <td className="hidden px-2 py-3 xl:table-cell">
                      <span className="text-sm text-mist-500 dark:text-mist-400">40 minutos</span>
                    </td>
                    <td className="px-2 py-3 text-right">
                      <span className="font-mono text-sm font-semibold text-mist-800 dark:text-mist-100">$400</span>
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
        <div className="h-4 w-24 animate-pulse rounded bg-mist-100 dark:bg-mist-800" />
        <div className="h-4 w-12 animate-pulse rounded bg-mist-100 dark:bg-mist-800" />
        <div className="h-4 w-20 animate-pulse rounded bg-mist-100 dark:bg-mist-800" />
        <div className="ml-auto h-4 w-14 animate-pulse rounded bg-mist-100 dark:bg-mist-800" />
        <div className="h-4 w-12 animate-pulse rounded bg-mist-100 dark:bg-mist-800" />
        <div className="size-8 animate-pulse rounded-full bg-mist-100 dark:bg-mist-800" />
      </div>
    ))}
  </div>
);
