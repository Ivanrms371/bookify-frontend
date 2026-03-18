import { useMutation, useQueryClient } from "@tanstack/react-query";
import { staffApi, type BulkInviteData } from "../api/staff.api";

export const useInviteStaff = (businessId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkInviteData) =>
      staffApi.inviteStaff(businessId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["business-invitations", businessId],
      });
      queryClient.invalidateQueries({ queryKey: ["business", businessId] });
    },
  });
};
