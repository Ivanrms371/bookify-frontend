import type { Invitation } from '../../types/invitation.types';
import { InvitationCard } from './invitation-card';

interface Props {
  invitations: Invitation[];
}

export const InvitationsList = ({ invitations }: Props) => {
  return (
    <>
      {invitations.map((invitation) => (
        <InvitationCard key={invitation.id} invitation={invitation} />
      ))}
    </>
  );
};
