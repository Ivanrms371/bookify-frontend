export const ROLES = ['OWNER', 'ADMIN', 'PROFESSIONAL'] as const;
export type Role = typeof ROLES[number];

export const ASSIGNABLE_ROLES = ['ADMIN', 'PROFESSIONAL'] as const;
