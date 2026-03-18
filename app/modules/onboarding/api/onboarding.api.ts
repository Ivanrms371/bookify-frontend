import { apiClient } from "@/shared/api/client";
import type { OnboardingInitInput } from "../schemas/onboarding-init.schema";

export interface OnboardingStatus {
  workingHours: boolean;
  service: boolean;
  team: boolean;
  published: boolean;
}

export const onboardingApi = {
  getOnboardingStatus: async (
    businessId: string,
  ): Promise<OnboardingStatus> => {
    const response = await apiClient.get(
      `/business/${businessId}/onboarding/status`,
    );
    return response.data;
  },
  getStatus: async (): Promise<any> => {
    const response = await apiClient.get(`/business/onboarding/status`);
    return response.data;
  },
  setup: async (data: OnboardingInitInput): Promise<any> => {
    const response = await apiClient.post(`/business/onboarding/setup`, data);
    return response.data;
  },
  selectPlan: async (businessId: string, planType: string): Promise<any> => {
    const response = await apiClient.post(
      `business/${businessId}/onboarding/select-plan`,
      {
        planType,
      },
    );
    return response.data;
  },
};
