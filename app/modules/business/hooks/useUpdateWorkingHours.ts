import { useMutation, useQueryClient } from "@tanstack/react-query";
import { businessApi } from "../api/business.api";
import type { WorkingHourData } from "../types/business.types";

export const useUpdateWorkingHours = (businessId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WorkingHourData | WorkingHourData[]) =>
      businessApi.updateWorkingHours(businessId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["working-hours", businessId],
      });
      queryClient.invalidateQueries({ queryKey: ["business", businessId] });
    },
  });
};
