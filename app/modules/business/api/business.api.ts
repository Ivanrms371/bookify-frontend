import { apiClient } from "@/shared/api/client";
import type { Business } from "../types/business.types";

export interface WorkingHourData {
  dayOfWeek: number;
  isActive: boolean;
  startMinutes: number;
  endMinutes: number;
}

export const businessApi = {
  getById: async (businessId: string): Promise<Business> => {
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
  publishBusiness: async (businessId: string) => {
    const response = await apiClient.patch(`/business/${businessId}`, {
      isPublic: true,
    });
    return response.data;
  },
};
