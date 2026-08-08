import { useMutation } from '@tanstack/react-query';
import { invitationsApi } from '../api/invitations-api';

export const useAcceptInvite = () => {
  return useMutation({
    mutationFn: (token: string) => invitationsApi.accept(token),
    onError: (error: unknown) => {
      console.error(error);
    },
  });
};
