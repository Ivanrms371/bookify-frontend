import { apiClient } from "@/shared/api/client";
import type { Business } from "../types/business.types";
import type { WorkingHourData } from "../types/business.types";

export const businessApi = {
  getById: async (businessId: string): Promise<Business> => {
    const response = await apiClient.get(`/business/${businessId}`);
    return response.data;
  },
  getCurrentBusiness: async (businessId: string): Promise<Business> => {
    const response = await apiClient.get(`/business/${businessId}`);
    return response.data;
  },
  updateWorkingHours: async (
    businessId: string,
    data: WorkingHourData | WorkingHourData[],
  ) => {
    const response = await apiClient.post(
      `/businesses/${businessId}/working-hours`,
      data,
    );
    return response.data;
  },
};
