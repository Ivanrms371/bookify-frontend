import { apiClient } from "@/shared/api/client";
import type { OnboardingInitInput } from "../schemas/onboarding-init.schema";
import type {
  AddTenantAddressInput,
  ChecklistResponse,
  OnboardingStatus,
  UpdateAssetsInput,
  UpdateAvailabilityInput,
} from "../types/onboarding.types";

export const onboardingApi = {
  addTenantAddress: async (tenantId: string, data: AddTenantAddressInput) => {
    const response = await apiClient.post(
      `/onboarding/tenants/${tenantId}/address`,
      data,
    );
    return response.data;
  },

  updateAvailability: async (
    tenantId: string,
    data: UpdateAvailabilityInput,
  ) => {
    const response = await apiClient.post(
      `/onboarding/tenants/${tenantId}/availability`,
      data,
    );
    return response.data;
  },

  getChecklist: async (tenantId: string): Promise<ChecklistResponse> => {
    const response = await apiClient.get(
      `/onboarding/tenants/${tenantId}/checklist`,
    );
    return response.data;
  },

  getOnboardingStatus: async (tenantId: string): Promise<OnboardingStatus> => {
    const response = await apiClient.get(`/onboarding/status`);
    return response.data;
  },
  getStatus: async () => {
    const response = await apiClient.get(`/onboarding/status`);
    return response.data;
  },
  setup: async (data: OnboardingInitInput) => {
    const response = await apiClient.post(`/onboarding/setup`, data);
    return response.data;
  },
  selectPlan: async (tenantId: string, plan: string) => {
    const response = await apiClient.post(
      `/onboarding/tenants/${tenantId}/select-plan`,
      {
        plan,
      },
    );
    return response.data;
  },
  completeOnboarding: async (tenantId: string) => {
    const response = await apiClient.post(
      `/onboarding/tenants/${tenantId}/complete`,
    );
    return response.data;
  },
  updateAssets: async (tenantId: string, data: UpdateAssetsInput) => {
    const formData = new FormData();
    if (data.logo) formData.append("logo", data.logo);
    if (data.banner) formData.append("banner", data.banner);

    const response = await apiClient.post(
      `/onboarding/tenants/${tenantId}/assets`,
      formData,
    );
    return response.data;
  },
};
