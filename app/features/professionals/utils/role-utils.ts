import type { Role } from '@/shared/types';

export const ROLE_LABELS: Record<string, string> = {
  OWNER: 'Dueño',
  ADMIN: 'Admin',
  STAFF: 'Profesional',
};

export const formatRoleLabel = (role?: string | null): string => {
  if (!role) return '';
  return ROLE_LABELS[role] ?? role;
};
