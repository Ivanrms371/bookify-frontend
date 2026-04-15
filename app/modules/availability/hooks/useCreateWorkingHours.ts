import { useMutation, useQueryClient } from "@tanstack/react-query";
import { availabilityApi } from "../api/availability.api";
import type { CreateWorkingHoursBulkInput } from "../api/availability.api";

export const useCreateWorkingHours = (tenantId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkingHoursBulkInput) => {
      if (!tenantId) throw new Error("Tenant ID is required");
      return availabilityApi.createHours(tenantId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["working-hours", tenantId],
      });
      queryClient.invalidateQueries({
        queryKey: ["onboarding-checklist", tenantId],
      });
      queryClient.invalidateQueries({ queryKey: ["tenant"] });
    },
  });
};
