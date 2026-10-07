import type { Role } from '@/shared/types';
import type { TeamAction } from './team-model';

export interface TeamInvitationRecord {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'PENDING' | 'EXPIRED';
  expiresAt: string;
}
export type MemberAction = Extract<TeamAction, { type: 'role' | 'access' }>;
export type InvitationAction = Extract<TeamAction, { type: 'invite' | 'resend' | 'cancel' }>;

export interface TeamMemberRecord {
  id: string;
  userId: string;
  role: Role;
  isActive: boolean;
  user: { id: string; name: string | null; email: string; avatarUrl: string | null };
  professional: { id: string; name: string; avatarUrl: string | null; colorTheme: string | null } | null;
}
export interface TeamResponseRecord {
  members: TeamMemberRecord[];
  invitations: TeamInvitationRecord[];
}
