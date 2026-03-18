import { useQuery } from "@tanstack/react-query";
import { onboardingApi } from "../api/onboarding.api";

export const useGetOnboardingStatus = (businessId: string) => {
  return useQuery({
    queryKey: ["onboarding-status", businessId],
    queryFn: () => onboardingApi.getOnboardingStatus(businessId),
    enabled: !!businessId,
  });
};
