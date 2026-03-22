import { cn } from "@/shared/lib/utils";
import { CalendarIcon } from "lucide-react";

export interface UpcomingAppointment {
  id: string;
  startTime: string; // ISO string
  customerName: string;
  customerPhone: string;
  staffName: string;
  confirmationCode: string;
  durationMinutes: number;
  total: number;
}

interface UpcomingAppointmentsProps {
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

export const UpcomingAppointments = ({
  appointments,
}: UpcomingAppointmentsProps) => {
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
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[400px] pr-1 custom-scrollbar">
          {sorted.map((appt, i) => (
            <div
              key={appt.id}
              className={cn(
                "flex items-center gap-4 p-3.5 rounded-2xl transition-colors",
                "bg-mist-50 dark:bg-mist-900/30",
                "hover:bg-mist-100 dark:hover:bg-mist-900/50",
              )}
            >
              {/* Time badge */}
              <div className="flex flex-col items-center min-w-[52px]">
                <span className="text-base font-mono font-semibold text-mist-500 dark:text-mist-400">
                  {formatTime(appt.startTime)}
                </span>
                <span className="text-[10px] text-mist-400 dark:text-mist-500 mt-0.5">
                  {formatDuration(appt.durationMinutes)}
                </span>
              </div>

              {/* Divider */}
              <div className="w-px h-9 bg-mist-200 dark:bg-mist-800" />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-mist-800 dark:text-mist-100 truncate">
                  {appt.customerName}
                </p>
                <p className="text-xs text-mist-400 dark:text-mist-500 truncate mt-0.5">
                  {appt.customerPhone} · {appt.staffName}
                </p>
              </div>

              {/* Code + price */}
              <div className="flex flex-col items-end shrink-0">
                <span className="text-sm font-mono font-semibold text-mist-800 dark:text-mist-100">
                  {formatCurrency(appt.total)}
                </span>
                <span className="text-[10px] text-mist-400 dark:text-mist-500 font-mono mt-0.5">
                  #{appt.confirmationCode}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
