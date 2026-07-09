import { usePlans } from '../hooks/usePlans';
import { PlanCard } from './PlanCard';
import { ToggleBillingCycle } from './ToggleBillingCycle';

export const PlanGrid = () => {
  const { plans, isLoading, billingCycle, setBillingCycle } = usePlans();
  return (
    <>
      <ToggleBillingCycle billingCycle={billingCycle} onChange={setBillingCycle} />

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-4">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </>
  );
};
