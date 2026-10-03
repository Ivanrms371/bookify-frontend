import type { BillingSummary, CheckoutSelection } from '../types/billing.types';

export function getExpectedCheckout(plan: string | null, cycle: string | null): CheckoutSelection | null {
  if ((plan !== 'pro' && plan !== 'pro_plus') || (cycle !== 'MONTHLY' && cycle !== 'ANNUAL')) return null;
  return { planId: plan, cycle };
}

// Return parameters describe the expectation; only server state confirms activation.
export function isCheckoutConfirmed(summary: BillingSummary, selection: CheckoutSelection): boolean {
  return summary.subscription?.planId === selection.planId && summary.subscription.cycle === selection.cycle &&
    summary.subscription.status === 'ACTIVE' && summary.access.canUseApp === true;
}
