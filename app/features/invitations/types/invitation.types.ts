import type { Role } from '@/shared/types';

export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED';

// ── Domain types ──────────────────────────────────────────────────

export interface Invitation {
  id: string;
  email: string;
  name: string;
  phoneCountryCode: string;
  phoneNumber: string;
  role: Role;
  status: InvitationStatus;
  commissionType?: 'PERCENTAGE' | 'FIXED' | null;
  commissionAmount?: number | null;
  serviceIds?: string[];
  createdAt: string;
  expiresAt: string;
}

// ── Request payloads ──────────────────────────────────────────────

export interface CreateInvitePayload {
  name: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  role: Role;
  serviceIds?: string[];
  commissionType?: 'PERCENTAGE' | 'FIXED';
  commissionAmount?: number;
}

// ── Response shapes ──────────────────────────────────────────────

export interface CreateInviteResponse {
  success: boolean;
}

export type AcceptInviteResponse = import('./invitation-journey.types').InvitationAcceptance;
