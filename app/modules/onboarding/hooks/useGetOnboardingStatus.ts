import { useQuery } from "@tanstack/react-query";
import { onboardingApi } from "../api/onboarding.api";

export const useGetOnboardingStatus = (tenantId: string) => {
  return useQuery({
    queryKey: ["onboarding-status", tenantId],
    queryFn: () => onboardingApi.getOnboardingStatus(tenantId),
    enabled: !!tenantId,
  });
};
