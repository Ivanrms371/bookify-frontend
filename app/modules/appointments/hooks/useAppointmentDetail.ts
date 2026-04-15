import { useQuery } from "@tanstack/react-query"
import { appointmentsApi } from "../api/appointments.api"

export function useAppointmentDetail(
  tenantId: string | undefined,
  appointmentId: string | undefined,
) {
  return useQuery({
    queryKey: ["appointment", "detail", tenantId, appointmentId],
    queryFn: () => appointmentsApi.getAppointmentById(tenantId!, appointmentId!),
    enabled: !!tenantId && !!appointmentId,
  })
}
