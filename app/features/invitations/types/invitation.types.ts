export type InvitationRole = 'PROFESSIONAL' | 'ADMIN';
export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED';

// ── Domain types ──────────────────────────────────────────────────

export interface Invitation {
  id: string;
  email: string;
  name: string | null;
  phone?: string | null;
  role: InvitationRole;
  status: InvitationStatus;
  commissionType?: 'PERCENTAGE' | 'FIXED' | null;
  commissionPercent?: number | null;
  commissionFixed?: number | null;
  commissionValue?: number | null;
  serviceIds?: string[];
  createdAt: string;
  expiresAt: string;
}

// ── Request payloads ──────────────────────────────────────────────

export interface CreateInvitePayload {
  name: string;
  email: string;
  phone?: string;
  role: InvitationRole;
  serviceIds?: string[];
  commissionType?: 'PERCENTAGE' | 'FIXED';
  commissionValue?: number;
}

// ── Response shapes ──────────────────────────────────────────────

export interface CreateInviteResponse {
  success: boolean;
}

export interface AcceptInviteResponse {
  message: string;
}
