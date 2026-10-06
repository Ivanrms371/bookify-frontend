import type { Permission } from '@/core/auth/permissions';
import type { Role } from '@/shared/types';

export interface UserSessionContext {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  phoneNumber?: string | null;
  phoneCountryCode?: string | null;
  activeTenant: ActiveTenant | null;
  hasMultipleTenants: boolean;
}

type OnboardingStatus =
  | 'WORKSPACE_TYPE'
  | 'BUSINESS_DETAILS'
  | 'SCHEDULE'
  | 'SERVICES'
  | 'TEAM_INVITE'
  | 'PROFESSIONAL_PROFILE'
  | 'CUSTOMIZE'
  | 'CONFIRM'
  | 'COMPLETED';

export interface ActiveTenant {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  role: Role;
  onboardingStatus: OnboardingStatus;
  professionalId: string | null;
  permissions?: readonly Permission[];
  timeZone?: string | null;
  subscription: Subscription | null;
}

type SubscriptionStatus = 'ACTIVE' | 'TRIAL' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED' | 'SUSPENDED' | 'PENDING_PAYMENT';

export interface Subscription {
  status: SubscriptionStatus;
  planName: string;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
}

export type SignupResponse =
  | ({ requiresEmailVerification: false } & UserSessionContext)
  | {
      requiresEmailVerification: true;
      user: { id: string; name: string; email: string; avatarUrl: string | null };
      activeTenant: null;
      hasMultipleTenants: false;
    };
