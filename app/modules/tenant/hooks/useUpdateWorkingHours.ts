import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantApi } from "../api/tenant.api";
import type { WorkingHourData } from "../types/tenant.types";

export const useUpdateWorkingHours = (tenantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WorkingHourData | WorkingHourData[]) =>
      tenantApi.updateWorkingHours(tenantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["working-hours", tenantId],
      });
      queryClient.invalidateQueries({ queryKey: ["tenant", tenantId] });
    },
  });
};
