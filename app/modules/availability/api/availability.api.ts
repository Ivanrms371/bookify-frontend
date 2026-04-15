import { apiClient } from "@/shared/api/client"

export interface WorkingHourInput {
  dayOfWeek: number
  startTime: string // HH:MM
  endTime: string // HH:MM
  name?: string
}

export interface CreateWorkingHoursBulkInput {
  workingHours: WorkingHourInput[]
}

export const availabilityApi = {
  createHours: async (tenantId: string, data: CreateWorkingHoursBulkInput) => {
    const response = await apiClient.post(
      `/tenants/${tenantId}/working-hours/bulk`,
      data,
    )
    return response.data
  },

  getBaseConfig: async (staffId: string) => {
    const response = await apiClient.get(`/staffs/${staffId}/availability`)
    return response.data
  },

  getSlots: async (staffId: string, date: string | null) => {
    const endpoint = `/staffs/${staffId}/availability/slots`
    const url = date ? `${endpoint}?date=${date}` : endpoint
    const response = await apiClient.get(url)
    return response.data
  },
}
