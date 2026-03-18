import { useMutation, useQueryClient } from "@tanstack/react-query";
import { businessApi, type WorkingHourData } from "../api/business.api";

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
