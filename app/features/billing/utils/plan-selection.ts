import type { Plan } from '../types/billing.types';
import type { PlanChangeSelection } from '../types/plan-change.types';

export function planSelection(planId: Plan['id'], annual: boolean): PlanChangeSelection {
  return planId === 'free' ? { planId: 'free' } : { planId, cycle: annual ? 'ANNUAL' : 'MONTHLY' };
}
