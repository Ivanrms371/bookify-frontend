export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

export interface TenantSummary {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  role: 'owner' | 'admin' | 'employee';
  membershipStatus: 'active' | 'expired' | 'cancelled';
  onboardingStatus?: string;
}
