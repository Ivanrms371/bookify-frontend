import type { InvitationRole } from '@/features/invitations';

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  PROFESSIONAL: 'Profesional',
};

export const formatRoleLabel = (role?: string | null): string => {
  if (!role) return '';
  return ROLE_LABELS[role] ?? role;
};
