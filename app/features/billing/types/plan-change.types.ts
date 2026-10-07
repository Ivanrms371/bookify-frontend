import type { BillingSummary, CheckoutEligibility } from './billing.types';
export interface PlanChangeEligibility extends CheckoutEligibility {
  kind: 'upgrade' | 'downgrade' | 'cycle' | 'undo' | 'free' | null;
  usage?: { professionals: number; services: number };
  limits?: { professionals: number; services: number };
  endsTrial?: boolean;
  effectiveAt: string | null;
  chargeImmediately: boolean;
}
export interface PlanChangeResult {
  state: 'confirmed' | 'pending';
  planId: string;
  pendingPlanId: string | null;
  pendingBillingCycle: 'MONTHLY' | 'ANNUAL' | null;
  planChangesAt: string | null;
}
export type PlanChangeSelection = { planId: 'free'; cycle?: never } | { planId: 'pro' | 'pro_plus'; cycle: 'MONTHLY' | 'ANNUAL' };
export type PlanChangeAction = { action: 'change'; selection: PlanChangeSelection } | { action: 'cancel' } | { action: 'refresh' };
export interface PlanChangeReviewProps {
  selection: PlanChangeSelection;
  canManage: boolean;
}
export interface PlanChangeNoticeProps {
  summary: BillingSummary;
}
