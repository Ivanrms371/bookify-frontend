import { apiClient } from "@/shared/api/client"
import type { AppointmentDetail } from "../types/calendar.types"

export const calendarApi = {
  getAppointmentById: async (
    tenantId: string,
    appointmentId: string,
  ): Promise<AppointmentDetail> => {
    const response = await apiClient.get(
      `/tenants/${tenantId}/appointments/${appointmentId}`,
    )
    return response.data
  },
}
