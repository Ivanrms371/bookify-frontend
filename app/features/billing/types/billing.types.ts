export interface PlanPrice {
  amount: string;
  compareAtAmount: string | null;
  equivalentMonthlyAmount?: string;
}
export interface Plan {
  id: 'free' | 'pro' | 'pro_plus';
  title: string;
  description: string;
  features: string[];
  currency: 'USD';
  compatibleWorkspaces: ('INDIVIDUAL' | 'TEAM')[];
  limits: { professionals: number; services: number };
  pricing: { MONTHLY: PlanPrice; ANNUAL?: PlanPrice };
  isPopular: boolean;
  cta: string;
  availability: { MONTHLY: boolean; ANNUAL: boolean };
}

export interface SubscriptionAccess {
  state: 'trial' | 'enabled' | 'restricted' | 'policy_pending';
  reason: string | null;
  effectivePlanId: string | null;
  trialEndsAt: string | null;
  accessEndsAt: string | null;
  canUseApp: boolean | null;
  canManageBilling: boolean;
}
export interface BillingSummary {
  subscription: {
    id: string;
    planId: string;
    status: string;
    cycle: 'MONTHLY' | 'ANNUAL' | null;
    amount: string | null;
    currency: string;
    trialEndsAt: string | null;
    currentPeriodEnd: string | null;
    endsAt: string | null;
    cancelledAt: string | null;
    paymentMethod: string | null;
    pendingPlanId: string | null;
    pendingBillingCycle: 'MONTHLY' | 'ANNUAL' | null;
    planChangesAt: string | null;
  } | null;
  currentPlan: Plan | null;
  access: SubscriptionAccess;
  usage: { professionals: number; services: number; countBasis: 'non_deleted' };
  allowedActions: { explorePlans: boolean; manageSubscription: boolean; cancelSubscription: boolean };
}

export interface CheckoutSelection {
  planId: Plan['id'];
  cycle: 'MONTHLY' | 'ANNUAL';
}
export interface CheckoutEligibility {
  eligible: boolean;
  blockers: {
    code: string;
    message: string;
    resource?: 'professionals' | 'services' | 'workspace' | 'provider' | 'cycle';
    used?: number;
    limit?: number;
    excess?: number;
  }[];
}
