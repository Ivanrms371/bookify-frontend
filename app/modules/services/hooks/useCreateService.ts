import { useMutation, useQueryClient } from "@tanstack/react-query";
import { serviceApi } from "../api/service.api";
import type { CreateServiceInput } from "../types/service-create.type";

export const useCreateService = (tenantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateServiceInput) =>
      serviceApi.createService(tenantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services", tenantId] });
      queryClient.invalidateQueries({ queryKey: ["tenant", tenantId] });
      queryClient.invalidateQueries({
        queryKey: ["onboarding-checklist", tenantId],
      });
    },
  });
};
