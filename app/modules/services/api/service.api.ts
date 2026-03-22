import { apiClient } from "@/shared/api/client";
import type { CreateServiceData } from "../types/service.types";

export const serviceApi = {
  createService: async (businessId: string, data: CreateServiceData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", String(data.price));
    formData.append("initialActiveMinutes", String(data.initialActiveMinutes));
    formData.append("isActive", String(data.isActive));

    if (data.description != null && data.description !== "") {
      formData.append("description", data.description);
    }
    if (data.passiveTimeMinutes != null) {
      formData.append("passiveTimeMinutes", String(data.passiveTimeMinutes));
    }
    if (data.finalActiveMinutes != null) {
      formData.append("finalActiveMinutes", String(data.finalActiveMinutes));
    }
    if (data.discountPercentage != null) {
      formData.append("discountPercentage", String(data.discountPercentage));
    }
    if (data.discountFixed != null) {
      formData.append("discountFixed", String(data.discountFixed));
    }
    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await apiClient.post(
      `/business/${businessId}/services`,
      formData,
    );
    return response.data;
  },
};
