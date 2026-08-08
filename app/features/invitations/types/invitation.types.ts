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
}

// ── Response shapes ──────────────────────────────────────────────

export interface CreateInviteResponse {
  success: boolean;
}

export interface AcceptInviteResponse {
  message: string;
}
