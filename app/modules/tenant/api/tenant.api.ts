import { apiClient } from "@/shared/api/client";
import type { Tenant } from "../types/tenant.types";
import type { WorkingHourData } from "../types/tenant.types";

export const tenantApi = {
  getById: async (tenantId: string): Promise<Tenant> => {
    const response = await apiClient.get(`/tenant/${tenantId}`);
    return response.data;
  },
  getCurrentTenant: async (tenantId: string): Promise<Tenant> => {
    const response = await apiClient.get(`/tenant/${tenantId}`);
    return response.data;
  },
  updateWorkingHours: async (
    tenantId: string,
    data: WorkingHourData | WorkingHourData[],
  ) => {
    const response = await apiClient.post(
      `/tenants/${tenantId}/working-hours`,
      data,
    );
    return response.data;
  },
};
