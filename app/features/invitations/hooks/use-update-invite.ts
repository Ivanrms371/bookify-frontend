import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invitationsApi } from '../api/invitations-api';
import type { CreateInvitePayload } from '../types/invitation.types';

export const useUpdateInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateInvitePayload }) => invitationsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      queryClient.invalidateQueries({ queryKey: ['professionals'] });
    },
    onError: (error: unknown) => {
      console.error(error);
    },
  });
};
