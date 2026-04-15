import { useQuery } from "@tanstack/react-query"
import { calendarApi } from "../api/calendar.api"

export function useAppointmentDetail(
  tenantId: string | undefined,
  appointmentId: string | undefined,
) {
  return useQuery({
    queryKey: ["appointment", "detail", tenantId, appointmentId],
    queryFn: () => calendarApi.getAppointmentById(tenantId!, appointmentId!),
    enabled: !!tenantId && !!appointmentId,
  })
}
