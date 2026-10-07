import type { BillingSummary } from '../types/billing.types';

export function hasFreeResourceLimit(summary: BillingSummary | undefined, resource: 'professionals' | 'services') {
  // A scheduled Free downgrade already enforces Free caps in the API.
  if (summary?.subscription?.planId !== 'free' && summary?.subscription?.pendingPlanId !== 'free') return false;
  return summary.usage[resource] >= (resource === 'professionals' ? 1 : 10);
}
