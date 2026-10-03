import type { Plan } from '../../types/billing.types';
import { PlanCard } from './plan-card';

export function PlanGrid({
  plans,
  isAnnual,
  currentPlanId,
  canManage,
  pending,
  onSelect,
}: {
  plans: Plan[];
  isAnnual: boolean;
  currentPlanId?: string | null;
  canManage: boolean;
  pending: boolean;
  onSelect: (id: Plan['id']) => void;
}) {
  return (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          isAnnual={isAnnual}
          isCurrent={plan.id === currentPlanId}
          canManage={canManage}
          pending={pending}
          onSelect={() => onSelect(plan.id)}
        />
      ))}
    </div>
  );
}
