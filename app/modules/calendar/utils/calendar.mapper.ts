import type { EventInput } from "@fullcalendar/core"
import type { CalendarAppointment } from "../types/calendar.types"
import { getColor } from "@/shared/utils/colors"

const INACTIVE_STATUSES = ["CANCELLED", "NO_SHOW"]

export function mapAppointmentsToEvents(
  appointments: CalendarAppointment[],
  isDarkMode: boolean,
): EventInput[] {
  const now = new Date()

  return appointments.map((appt) => {
    const isInactive = INACTIVE_STATUSES.includes(appt.status)
    const isFuture = new Date(appt.startTime) > now
    const isFreed = isInactive && isFuture

    if (isInactive) {
      return {
        id: appt.id,
        title: appt.customerName,
        start: appt.startTime,
        end: appt.endTime,
        backgroundColor: "transparent",
        borderColor: isDarkMode
          ? "rgba(156, 163, 175, 0.4)"
          : "rgba(156, 163, 175, 0.5)",
        textColor: isDarkMode
          ? "rgba(156, 163, 175, 0.7)"
          : "rgba(107, 114, 128, 0.7)",
        classNames: ["fc-event--freed"],
        extendedProps: {
          staffId: appt.staff?.id,
          staffName: appt.staff?.displayName ?? "Sin asignar",
          staffColor: appt.staff?.colorTheme,
          customerName: appt.customerName,
          durationMinutes: appt.durationMinutes,
          status: appt.status,
          isFreed,
        },
      }
    }

    return {
      id: appt.id,
      title: appt.customerName,
      start: appt.startTime,
      end: appt.endTime,
      backgroundColor: getColor(appt.staff?.colorTheme ?? "BLUE", isDarkMode),
      textColor: isDarkMode ? "#f3f4f6" : "#374151",
      extendedProps: {
        staffId: appt.staff?.id,
        staffName: appt.staff?.displayName ?? "Sin asignar",
        staffColor: appt.staff?.colorTheme,
        customerName: appt.customerName,
        durationMinutes: appt.durationMinutes,
        status: appt.status,
        isFreed: false,
      },
    }
  })
}
