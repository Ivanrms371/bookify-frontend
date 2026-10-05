export type InvitationValidation = {
  valid: boolean;
  status: 'VALID' | 'EXPIRED' | 'REVOKED' | 'ACCEPTED';
  email: string;
  businessName: string;
  tenantId: string;
  tenantSlug: string;
  hasExistingUser: boolean;
  professional: { id: string; name: string } | null;
};
export type InvitationAcceptance = { success: true; tenantId: string; tenantSlug: string };
