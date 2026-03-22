import { cn } from "@/shared/lib/utils";
import { CalendarIcon } from "lucide-react";
import type { UpcomingAppointment } from "./UpcomingAppointments";

interface UpcomingAppointmentsTableProps {
  appointments: UpcomingAppointment[];
}

function formatTime(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleTimeString("es-UY", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0,
  }).format(value);
}

export const UpcomingAppointmentsTable = ({
  appointments,
}: UpcomingAppointmentsTableProps) => {
  const sorted = [...appointments].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  );

  return (
    <div
      className={cn(
        "col-span-5 flex flex-col rounded-4xl bg-white dark:bg-transparent dark:border dark:border-mist-900/70 p-6",
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-mist-500 dark:text-mist-400">
            Citas de hoy
          </p>
          <p className="text-2xl font-mono font-semibold text-mist-800 dark:text-mist-100 mt-1">
            {sorted.length} {sorted.length === 1 ? "cita" : "citas"}
          </p>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 gap-3">
          <div className="p-4 rounded-full bg-mist-100 dark:bg-mist-900/40">
            <CalendarIcon className="size-6 text-mist-400 dark:text-mist-500" />
          </div>
          <p className="text-sm text-mist-400 dark:text-mist-500 font-medium">
            No hay citas programadas para hoy
          </p>
        </div>
      ) : (
        <div className="overflow-y-auto max-h-[400px] pr-1">
          <table className="w-full text-left">
            <thead className="sticky top-0 z-10">
              <tr className="bg-white dark:bg-mist-950">
                <th className="text-xs uppercase tracking-wider font-semibold text-mist-400 dark:text-mist-500 pb-3 pr-2">
                  Hora
                </th>
                <th className="text-xs uppercase tracking-wider font-semibold text-mist-400 dark:text-mist-500 pb-3 pr-2">
                  Cliente
                </th>
                <th className="text-xs uppercase tracking-wider font-semibold text-mist-400 dark:text-mist-500 pb-3 pr-2 hidden xl:table-cell">
                  Staff
                </th>
                <th className="text-xs uppercase tracking-wider font-semibold text-mist-400 dark:text-mist-500 pb-3 pr-2 hidden xl:table-cell">
                  Duración
                </th>
                <th className="text-xs uppercase tracking-wider font-semibold text-mist-400 dark:text-mist-500 pb-3 text-right">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((appt, i) => (
                <tr
                  key={appt.id}
                  className={cn(
                    "border-t border-mist-100 dark:border-mist-800/50 transition-colors",
                    "hover:bg-mist-50 dark:hover:bg-mist-900/30",
                  )}
                >
                  <td className="py-3 px-2">
                    <span className="text-sm font-mono font-semibold text-mist-500 dark:text-mist-400">
                      {formatTime(appt.startTime)}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-mist-800 dark:text-mist-100 truncate">
                        {appt.customerName}
                      </p>
                      <p className="text-xs font-medium text-mist-400 dark:text-mist-500 truncate">
                        {appt.customerPhone} · #{appt.confirmationCode}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-2 hidden xl:table-cell">
                    <span className="text-sm text-mist-600 dark:text-mist-300">
                      {appt.staffName}
                    </span>
                  </td>
                  <td className="py-3 px-2 hidden xl:table-cell">
                    <span className="text-sm text-mist-500 dark:text-mist-400">
                      {formatDuration(appt.durationMinutes)}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="text-sm font-mono font-semibold text-mist-800 dark:text-mist-100">
                      {formatCurrency(appt.total)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
