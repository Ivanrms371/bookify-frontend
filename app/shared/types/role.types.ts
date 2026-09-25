export const ROLES = ['OWNER', 'ADMIN', 'STAFF'] as const;
export type Role = (typeof ROLES)[number];

export const ASSIGNABLE_ROLES = ['ADMIN', 'STAFF'] as const;
