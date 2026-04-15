import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onboardingApi } from "@/modules/onboarding/api/onboarding.api";

export const usePublishTenant = (tenantId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!tenantId) throw new Error("Tenant ID is required");
      return onboardingApi.completeOnboarding(tenantId);
    },
    onSuccess: () => {
      if (tenantId) {
        queryClient.invalidateQueries({
          queryKey: ["onboarding-checklist", tenantId],
        });
        queryClient.invalidateQueries({ queryKey: ["tenant", tenantId] });
        queryClient.invalidateQueries({ queryKey: ["tenant"] });
      }
    },
  });
};
