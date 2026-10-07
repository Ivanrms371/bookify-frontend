import type { TeamMemberRecord } from './team-invitation.types';
import type { Role } from '@/shared/types';

export type TeamRole = 'ADMIN' | 'STAFF';
export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: Role;
  hasAccess: boolean;
}
export interface TeamActor {
  id: string;
  role: Role;
}
export type TeamAction =
  | { type: 'invite'; email: string; role: TeamRole }
  | { type: 'role'; id: string; role: TeamRole }
  | { type: 'access'; id: string; isActive: boolean }
  | { type: 'resend'; id: string }
  | { type: 'cancel'; id: string };
export const roleLabels: Record<Role, string> = { OWNER: 'Propietario', ADMIN: 'Administrador', STAFF: 'Personal' };
export function canManage(actor: TeamActor, target: { id?: string; userId?: string; role: Role }) {
  return (
    (target.userId ?? target.id) !== actor.id &&
    target.role !== 'OWNER' &&
    (actor.role === 'OWNER' || (actor.role === 'ADMIN' && target.role === 'STAFF'))
  );
}
export function toTeamMember(member: TeamMemberRecord): TeamMember {
  return {
    id: member.id,
    userId: member.userId,
    name: member.user.name ?? member.user.email,
    email: member.user.email,
    role: member.role,
    hasAccess: member.isActive,
  };
}

export function filterMembers(members: TeamMember[], query: string, filter: string) {
  const search = query.trim().toLocaleLowerCase();
  return members.filter(
    (member) =>
      `${member.name} ${member.email}`.toLocaleLowerCase().includes(search) &&
      (filter === 'all' || member.hasAccess === (filter === 'active')),
  );
}
