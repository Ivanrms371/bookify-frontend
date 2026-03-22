import { apiClient } from "@/shared/api/client";
import type { OnboardingInitInput } from "../schemas/onboarding-init.schema";
import type {
  AddBusinessAddressInput,
  ChecklistResponse,
  OnboardingStatus,
  UpdateAssetsInput,
  UpdateAvailabilityInput,
} from "../types/onboarding.types";

export const onboardingApi = {
  addBusinessAddress: async (businessId: string, data: AddBusinessAddressInput) => {
    const response = await apiClient.post(
      `/business/${businessId}/onboarding/address`,
      data
    );
    return response.data;
  },
  updateAvailability: async (businessId: string, data: UpdateAvailabilityInput) => {
    const response = await apiClient.post(
      `/business/${businessId}/onboarding/availability`,
      data
    );
    return response.data;
  },
  getChecklist: async (businessId: string): Promise<ChecklistResponse> => {
    const response = await apiClient.get(
      `/business/${businessId}/onboarding/checklist`,
    );
    return response.data;
  },
  getOnboardingStatus: async (
    businessId: string,
  ): Promise<OnboardingStatus> => {
    const response = await apiClient.get(
      `/business/${businessId}/onboarding/status`,
    );
    return response.data;
  },
  getStatus: async () => {
    const response = await apiClient.get(`/business/onboarding/status`);
    return response.data;
  },
  setup: async (data: OnboardingInitInput) => {
    const response = await apiClient.post(`/business/onboarding/setup`, data);
    return response.data;
  },
  selectPlan: async (businessId: string, planType: string) => {
    const response = await apiClient.post(
      `/business/${businessId}/onboarding/select-plan`,
      {
        planType,
      },
    );
    return response.data;
  },
  completeOnboarding: async (businessId: string) => {
    const response = await apiClient.post(
      `/business/${businessId}/onboarding/complete`,
    );
    return response.data;
  },
  updateAssets: async (businessId: string, data: UpdateAssetsInput) => {
    const formData = new FormData();
    if (data.logo) formData.append("logo", data.logo);
    if (data.banner) formData.append("banner", data.banner);

    const response = await apiClient.post(
      `/business/${businessId}/onboarding/assets`,
      formData
    );
    return response.data;
  },
};
