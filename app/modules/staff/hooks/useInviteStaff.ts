import { useMutation, useQueryClient } from "@tanstack/react-query";
import { staffApi, type BulkInviteData } from "../api/staff.api";

export const useInviteStaff = (tenantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkInviteData) => staffApi.inviteStaff(tenantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tenant-invitations", tenantId],
      });
      queryClient.invalidateQueries({ queryKey: ["tenant", tenantId] });
    },
  });
};
