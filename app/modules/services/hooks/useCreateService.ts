import { useMutation, useQueryClient } from "@tanstack/react-query";
import { serviceApi } from "../api/service.api";
import type { CreateServiceData } from "../types/service.types";

export const useCreateService = (businessId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateServiceData) =>
      serviceApi.createService(businessId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services", businessId] });
      queryClient.invalidateQueries({ queryKey: ["business", businessId] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-checklist", businessId] });
    },
  });
};
