import { useQuery } from "@tanstack/react-query";
import { onboardingApi } from "../api/onboarding.api";

export const useGetChecklist = (tenantId: string | undefined) => {
  return useQuery({
    queryKey: ["onboarding-checklist", tenantId],
    queryFn: () => onboardingApi.getChecklist(tenantId!),
    enabled: !!tenantId,
  });
};
