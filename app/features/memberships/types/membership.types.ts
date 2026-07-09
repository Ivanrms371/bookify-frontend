type MembershipRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export type Membership = {
  id: string;
  userId: string;
  tenantId: string;
  role: MembershipRole;
  invitationToken: string;
  jointedAt: Date;
};

export type CreateInvitationInput = {
  email: string;
  role: MembershipRole;
  comissionType: 'FIXED' | 'PERCENTAGE';
  comissionPercent: number;
  comissionFixed: number;
};
