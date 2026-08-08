import { useInvitations } from '../hooks/use-invitations';
import { Spinner } from '@/shared/components/ui/spinner';
import { InvitationsList } from './list/invitations-list';

export const Invitations = () => {
  const { data: invitations = [], isLoading } = useInvitations();

  if (isLoading) return <Spinner />;

  return <InvitationsList invitations={invitations} />;
};
