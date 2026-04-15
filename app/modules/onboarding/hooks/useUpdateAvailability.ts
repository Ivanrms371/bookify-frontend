import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onboardingApi } from "../api/onboarding.api";
import type { UpdateAvailabilityInput } from "../types/onboarding.types";

export const useUpdateAvailability = (tenantId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAvailabilityInput) => {
      if (!tenantId) throw new Error("Tenant ID is required");
      return onboardingApi.updateAvailability(tenantId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["onboarding-checklist", tenantId],
      });
      queryClient.invalidateQueries({ queryKey: ["tenant"] });
    },
  });
};
