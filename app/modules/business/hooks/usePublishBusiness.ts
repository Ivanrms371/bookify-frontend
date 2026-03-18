import { useMutation, useQueryClient } from "@tanstack/react-query";
import { businessApi } from "../api/business.api";

export const usePublishBusiness = (businessId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => businessApi.publishBusiness(businessId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", businessId] });
    },
  });
};
