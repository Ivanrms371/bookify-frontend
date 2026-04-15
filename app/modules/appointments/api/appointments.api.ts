import { apiClient } from "@/shared/api/client"
import type { Appointment, GetAppointmentsParams, AppointmentDetail } from "../types/appointment.types"

export const appointmentsApi = {
  getAppointments: async (
    tenantId: string,
    params: GetAppointmentsParams = {},
  ): Promise<Appointment[]> => {
    const response = await apiClient.get(`/tenants/${tenantId}/appointments`, {
      params,
    })
    return response.data
  },

  createAppointment: async (tenantId: string, payload: any) => {
    const response = await apiClient.post(`/tenants/${tenantId}/appointments`, payload)
    return response.data
  },

  markAsNoShow: async (tenantId: string, appointmentId: string) => {
    const response = await apiClient.patch(`/tenants/${tenantId}/appointments/${appointmentId}/no-show`)
    return response.data
  },

  markAsCancelled: async (tenantId: string, appointmentId: string, reason?: string) => {
    const response = await apiClient.patch(`/tenants/${tenantId}/appointments/${appointmentId}/cancel`, { reason })
    return response.data
  },

  rescheduleAppointment: async (
    tenantId: string,
    appointmentId: string,
    payload: { staffId: string; serviceId: string; date: string; reason?: string },
  ) => {
    const response = await apiClient.patch(
      `/tenants/${tenantId}/appointments/${appointmentId}/reschedule`,
      payload,
    )
    return response.data
  },

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
