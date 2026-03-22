import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onboardingApi } from "../api/onboarding.api";

export const useCompleteOnboarding = (businessId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!businessId) throw new Error("Business ID is required");
      return onboardingApi.completeOnboarding(businessId);
    },
    onSuccess: () => {
      if (businessId) {
        queryClient.invalidateQueries({ queryKey: ["onboarding-checklist", businessId] });
        queryClient.invalidateQueries({ queryKey: ["business", businessId] });
        queryClient.invalidateQueries({ queryKey: ["business"] });
      }
    },
  });
};
