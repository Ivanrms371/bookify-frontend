import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onboardingApi } from "../api/onboarding.api";
import type { UpdateAssetsInput } from "../types/onboarding.types";

export const useUpdateAssets = (tenantId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAssetsInput) => {
      if (!tenantId) throw new Error("Tenant ID is required");
      return onboardingApi.updateAssets(tenantId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["onboarding-checklist", tenantId],
      });
      queryClient.invalidateQueries({ queryKey: ["tenant"] });
    },
  });
};
