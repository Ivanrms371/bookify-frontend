import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onboardingApi } from "../api/onboarding.api";
import type { AddTenantAddressInput } from "../types/onboarding.types";

export const useAddTenantAddress = (tenantId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddTenantAddressInput) => {
      if (!tenantId) throw new Error("Tenant ID is required");
      return onboardingApi.addTenantAddress(tenantId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["onboarding-checklist", tenantId],
      });
      // Depending on global state, we might also invalidate 'current-tenant'
      queryClient.invalidateQueries({ queryKey: ["tenant"] });
    },
  });
};
