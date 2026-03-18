import { useMutation, useQueryClient } from "@tanstack/react-query";
import { serviceApi, type CreateServiceData } from "../api/service.api";

export const useCreateService = (businessId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateServiceData) =>
      serviceApi.createService(businessId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services", businessId] });
      queryClient.invalidateQueries({ queryKey: ["business", businessId] });
    },
  });
};
