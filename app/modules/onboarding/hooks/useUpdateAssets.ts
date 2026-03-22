import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onboardingApi } from "../api/onboarding.api";
import type { UpdateAssetsInput } from "../types/onboarding.types";

export const useUpdateAssets = (businessId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAssetsInput) => {
      if (!businessId) throw new Error("Business ID is required");
      return onboardingApi.updateAssets(businessId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding-checklist", businessId] });
      queryClient.invalidateQueries({ queryKey: ["business"] });
    },
  });
};
