import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invitationsApi } from '../api/invitations-api';

export const useCancelInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => invitationsApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      queryClient.invalidateQueries({ queryKey: ['professionals'] });
    },
    onError: (error: unknown) => {
      console.error(error);
    },
  });
};
