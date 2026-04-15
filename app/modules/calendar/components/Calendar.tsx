import FullCalendar from "@fullcalendar/react"
import { calendarConfig, calendarPlugins } from "../config/calendarPlugins"
import "../styles/calendar.css"
import type { EventInput } from "@fullcalendar/core"
import { useModalStore } from "@/shared/store/useModalStore"

interface Props {
  events: EventInput[]
  handleDatesSet: (arg: any) => void
}

export const Calendar = ({ events, handleDatesSet }: Props) => {
  const { openModal } = useModalStore()

  return (
    <div className="flex gap-5 relative">
      <div className="flex-1 bg-white dark:bg-transparent dark:border dark:border-mist-900/70 rounded-4xl p-6 min-h-0">
        <FullCalendar
          plugins={calendarPlugins}
          {...calendarConfig}
          events={events}
          datesSet={handleDatesSet}
          eventClick={(info) => {
            info.jsEvent.preventDefault()
            openModal("appointmentDetail", {
              appointmentId: info.event.id,
            })
          }}
          eventContent={(arg) => {
            const meta = arg.event.extendedProps
            const isInactive = meta.status === "CANCELLED" || meta.status === "NO_SHOW"
            const isFreed = meta.isFreed

            if (isInactive) {
              const statusLabel = meta.status === "CANCELLED" ? "Cancelado" : "No asistió"

              return (
                <div
                  className="flex flex-col gap-0.5 overflow-hidden px-1 py-0.5 w-full"
                  style={{ color: arg.event.textColor }}
                >
                  <span className="font-semibold truncate text-xs leading-tight flex items-center gap-1">
                    {isFreed && <span className="fc-freed-badge">Libre</span>}
                    <span className="line-through opacity-60">{meta.customerName}</span>
                  </span>
                  <span className="truncate text-xs opacity-50 leading-tight">
                    {statusLabel}
                  </span>
                </div>
              )
            }

            return (
              <div
                className="flex flex-col gap-0.5 overflow-hidden px-1 py-0.5 w-full"
                style={{ color: arg.event.textColor }}
              >
                <span className="font-semibold truncate text-xs leading-tight">
                  {meta.customerName}
                </span>
                <span className="truncate text-xs opacity-70 leading-tight">
                  {meta.staffName}
                </span>
              </div>
            )
          }}
        />
      </div>
    </div>
  )
}
