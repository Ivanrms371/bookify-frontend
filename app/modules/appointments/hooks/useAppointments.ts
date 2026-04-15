import { useQuery, type UseQueryOptions } from "@tanstack/react-query"
import { useTenant } from "@/shared/context/tenant.context"
import { appointmentsApi } from "../api/appointments.api"
import type {
  Appointment,
  GetAppointmentsParams,
} from "../types/appointment.types"

export const useAppointments = (
  params: GetAppointmentsParams = {},
  options?: Omit<UseQueryOptions<Appointment[]>, "queryKey" | "queryFn">,
) => {
  const { tenantId } = useTenant()

  return useQuery<Appointment[]>({
    queryKey: ["appointments", tenantId, params],
    queryFn: () => appointmentsApi.getAppointments(tenantId, params),
    enabled: !!tenantId && (options?.enabled ?? true),
    ...options,
  })
}
