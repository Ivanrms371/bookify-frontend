import type { AppointmentDetail } from "../../types/calendar.types"
import { getColor } from "@/shared/utils/colors"
import { getInitials } from "@/shared/utils/string"
import { WhatsappIcon } from "@/shared/icons/WhatsappIcon"
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline"

interface Props {
  appointment: AppointmentDetail
  isDark: boolean
}

export const CustomerPanel = ({ appointment, isDark }: Props) => {
  const history = appointment.customer

  return (
    <div className="col-span-1">
      <div className="flex flex-col items-center gap-4 border-b border-mist-200 dark:border-mist-900 px-4 py-8">
        <div className="flex flex-col items-center gap-2">
          <div
            className="size-12 rounded-full text-mist-900 font-medium dark:text-mist-100 flex items-center justify-center"
            style={{
              backgroundColor: getColor(appointment.staff?.colorTheme, isDark),
            }}
          >
            {getInitials(appointment.customerName)}
          </div>
          <span className="font-medium text-mist-800 dark:text-mist-300">
            {appointment.customerName}
          </span>
        </div>

        <div className="flex gap-1.5">
          <a
            href={`https://wa.me/${appointment.customerPhone}`}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium bg-[#25D366] text-white dark:bg-[#1a6634] dark:text-[#9fe1cb] hover:opacity-85 active:scale-[0.97] transition-all"
            target="_blank"
          >
            <WhatsappIcon className="size-4 fill-white dark:fill-[#9fe1cb]" />
            WhatsApp
          </a>
          <a
            href={`tel:${appointment.customerPhone}`}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium bg-mist-100 text-mist-800 border border-mist-200 dark:bg-transparent dark:border-mist-800/60 dark:text-mist-300 hover:opacity-85 active:scale-[0.97] transition-all"
          >
            <PhoneIcon className="size-4" />
            Llamar
          </a>
        </div>
      </div>

      {/* Contact info */}
      <div className="px-4 py-6 border-b border-mist-200 dark:border-mist-900">
        <div className="text-mist-900 dark:text-mist-100 mb-2 font-mono text-lg">
          Información de contacto
        </div>
        <div className="flex flex-col gap-2 divide-y dark:divide-mist-900 divide-mist-200">
          <ContactRow
            icon={EnvelopeIcon}
            label="Email"
            value={appointment.customerEmail ?? "—"}
          />
          <ContactRow
            icon={PhoneIcon}
            label="Teléfono"
            value={appointment.customerPhone}
          />
        </div>
      </div>

      {/* Customer history */}
      {history && (
        <div className="px-4 py-6 border-b border-mist-200 dark:border-mist-900">
          <div className="text-mist-900 dark:text-mist-100 mb-2 font-mono text-lg">
            Historial cliente
          </div>

          <div className="flex flex-col w-full gap-2 divide-y dark:divide-mist-900 divide-mist-200">
            <HistoryRow
              label="Citas totales"
              value={history.totalAppointments}
            />
            <HistoryRow
              label="Citas completadas"
              value={history.completedAppointments}
              labelClassName="text-green-400"
            />
            <HistoryRow
              label="Citas canceladas"
              value={history.cancelledAppointments}
              labelClassName="text-red-400"
            />
            <HistoryRow
              label="Citas no asistidas"
              value={history.noShowCount}
              labelClassName="text-orange-400"
            />
          </div>
        </div>
      )}
    </div>
  )
}

const ContactRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) => (
  <div className="flex justify-between gap-2 items-center py-2">
    <div className="flex items-center gap-2">
      <Icon className="size-4 text-mist-500 dark:text-mist-400" />
      <div className="text-sm font-medium text-mist-500 dark:text-mist-400">
        {label}
      </div>
    </div>
    <span className="text-mist-900 font-medium dark:text-mist-100 text-sm">
      {value}
    </span>
  </div>
)

const HistoryRow = ({
  label,
  value,
  labelClassName = "text-mist-500 dark:text-mist-400",
}: {
  label: string
  value: number
  labelClassName?: string
}) => (
  <div className="font-medium flex justify-between flex-row-reverse">
    <span className="text-lg text-mist-800 dark:text-mist-200">{value}</span>
    <span className={`text-sm ${labelClassName}`}>{label}</span>
  </div>
)
