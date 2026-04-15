import { apiClient } from "@/shared/api/client"
import type { Staff } from "../types/staff.type"
import type { StaffQueryParams } from "../types/staff-params.type"

export interface StaffInvitation {
  email: string;
  role: string;
  commission: number | null;
}

export interface BulkInviteData {
  invitations: StaffInvitation[]
}

export const staffApi = {
  getStaffs: async (
    tenantId: string,
    params?: StaffQueryParams,
  ): Promise<Staff[]> => {
    const response = await apiClient.get(`/tenants/${tenantId}/staffs`, {
      params,
    })
    return response.data
  },

  getStaffsByServiceId: async (
    tenantId: string,
    serviceId: string,
  ): Promise<Staff[]> => {
    const response = await apiClient.get(
      `/tenants/${tenantId}/staffs/service/${serviceId}`,
    )
    return response.data
  },

  inviteStaff: async (tenantId: string, data: BulkInviteData) => {
    const response = await apiClient.post(
      `/tenants/${tenantId}/staffs/invitations/bulk`,
      data,
    )
    return response.data
  },
}
