import { useQuery } from '@tanstack/react-query';
import { invitationsApi } from '../api/invitations-api';

export const useInvitations = () => {
  return useQuery({
    queryKey: ['invitations'],
    queryFn: () => invitationsApi.getAll(),
  });
};
