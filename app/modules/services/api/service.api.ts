import { apiClient } from "@/shared/api/client";

export interface CreateServiceData {
  name: string;
  image?: string;
  description?: string;
  price: number;
  discountPercentage?: number;
  discountFixed?: number;
  initialActiveMinutes: number;
  passiveTimeMinutes?: number;
  finalActiveMinutes?: number;
  isActive: boolean;
}

export const serviceApi = {
  createService: async (businessId: string, data: CreateServiceData) => {
    const response = await apiClient.post(
      `/business/${businessId}/services`,
      data,
    );
    return response.data;
  },
};
