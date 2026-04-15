import type { AppointmentDetail } from "../../types/calendar.types"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { formatCurrency } from "@/shared/utils/formatters"
import { Heading } from "@/shared/components/typography/Heading"
import {
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  UserIcon,
} from "@heroicons/react/24/outline"

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  CONFIRMED: {
    label: "Confirmada",
    className:
      "bg-blue-400/20 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  },
  COMPLETED: {
    label: "Completada",
    className:
      "bg-emerald-400/20 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  },
  CANCELLED: {
    label: "Cancelada",
    className:
      "bg-red-400/20 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  },
  NO_SHOW: {
    label: "No asistió",
    className:
      "bg-amber-400/20 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  },
}

interface Props {
  appointment: AppointmentDetail
}

const DetailRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) => (
  <div className="px-4 py-6 border-b border-mist-200 dark:border-mist-900">
    <div className="flex items-start gap-2">
      <Icon className="size-5 text-mist-500 dark:text-mist-400" />
      <div className="flex flex-col">
        <div className="text-mist-500 text-sm font-medium dark:text-mist-400 mb-2">
          {label}
        </div>
        <div className="text-mist-900 dark:text-mist-100">{value}</div>
      </div>
    </div>
  </div>
)

export const AppointmentDetailsPanel = ({ appointment }: Props) => {
  const timeFormatted = `${format(
    appointment.startTime,
    "d 'de' MMMM',' yyyy 'de' h:mm",
    { locale: es },
  )} - ${format(appointment.endTime, "h:mm")}`

  const status = STATUS_MAP[appointment.status] ?? {
    label: appointment.status,
    className: "bg-mist-200 text-mist-600 dark:bg-mist-800 dark:text-mist-400",
  }

  return (
    <div className="col-span-1 border-r border-mist-200 dark:border-mist-900">
      <div className="py-8 px-6 border-b border-mist-200 dark:border-mist-900 flex items-center justify-between">
        <Heading as="h3" className="font-medium text-2xl">
          Detalles de la cita
        </Heading>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <DetailRow
        icon={CalendarDaysIcon}
        label="Fecha & Hora"
        value={timeFormatted}
      />
      <DetailRow
        icon={ClockIcon}
        label="Duración"
        value={`${appointment.durationMinutes} min`}
      />
      <DetailRow
        icon={UserIcon}
        label="Profesional"
        value={appointment.staff?.displayName ?? "Sin asignar"}
      />
      <DetailRow
        icon={ClipboardDocumentCheckIcon}
        label="Servicio"
        value={appointment.service?.name ?? "—"}
      />
      <DetailRow
        icon={CurrencyDollarIcon}
        label="Total"
        value={formatCurrency(appointment.price)}
      />
      <DetailRow
        icon={DocumentTextIcon}
        label="Notas"
        value={appointment.notes ?? "Sin notas"}
      />
    </div>
  )
}
