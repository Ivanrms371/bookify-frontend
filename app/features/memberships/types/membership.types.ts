import type { Role } from '@/shared/types';

export type Membership = {
  id: string;
  userId: string;
  tenantId: string;
  role: Role;
  invitationToken: string;
  jointedAt: Date;
};

export type CreateInvitationInput = {
  email: string;
  role: Role;
  comissionType: 'FIXED' | 'PERCENTAGE';
  comissionPercent: number;
  comissionFixed: number;
};
