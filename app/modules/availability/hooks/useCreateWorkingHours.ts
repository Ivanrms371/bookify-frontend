import { useMutation, useQueryClient } from "@tanstack/react-query";
import { availabilityApi } from "../api/availability.api";
import type { CreateWorkingHoursBulkInput } from "../api/availability.api";

export const useCreateWorkingHours = (businessId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkingHoursBulkInput) => {
      if (!businessId) throw new Error("Business ID is required");
      return availabilityApi.createHours(businessId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["working-hours", businessId] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-checklist", businessId] });
      queryClient.invalidateQueries({ queryKey: ["business"] });
    },
  });
};
