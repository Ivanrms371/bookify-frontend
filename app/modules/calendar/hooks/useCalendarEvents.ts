import { useAppointments } from "@/modules/appointments/hooks/useAppointments"
import type { GetAppointmentsParams } from "../types/calendar.types"

export function useCalendarAppointments(params: GetAppointmentsParams) {
  return useAppointments(
    {
      startDate: params.startDate,
      endDate: params.endDate,
      staffId: params.staffId,
      status: params.status,
    },
    {
      enabled: !!params.startDate && !!params.endDate,
    },
  )
}
