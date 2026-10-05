import type { BillingSummary, CheckoutEligibility, CheckoutSelection } from './billing.types';
export interface PlanChangeEligibility extends CheckoutEligibility {
  kind: 'upgrade' | 'downgrade' | 'cycle' | 'undo' | null;
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
export type PlanChangeAction = { action: 'change'; selection: CheckoutSelection } | { action: 'cancel' } | { action: 'refresh' };
export interface PlanChangeReviewProps {
  selection: CheckoutSelection;
  canManage: boolean;
}
export interface PlanChangeNoticeProps {
  summary: BillingSummary;
}
