import { useCheckout } from '../../hooks/use-checkout';
import { PlanCheckout } from './plan-checkout';
import type { Plan } from '../../types/billing.types';
import { SubscriptionNotice } from '../subscription-notice';
import { useState } from 'react';
import { Heading } from '@/shared/components/typography';
import { Button } from '@/shared/components/ui';
import { useSubscriptionAccess } from '../../hooks/use-billing-subscription';
import { useBillingPlans } from '../../hooks/use-billing-plans';
import { BillingCycleToggle } from './billing-cycle-toggle';
import { PlanGrid } from './plan-grid';

export function Plans() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState<Plan['id'] | null>(null);
  const query = useBillingPlans();
  const access = useSubscriptionAccess();
  const checkout = useCheckout();
  return (
    <>
      <Heading className="mb-6 text-center text-4xl font-semibold md:text-5xl">Selecciona un plan</Heading>
      {access.isPending && (
        <p role="status" className="mb-4 text-center text-sm text-gray-500">
          Consultando tu suscripción…
        </p>
      )}

      <BillingCycleToggle
        isAnnual={isAnnual}
        disabled={checkout.isPending}
        onChange={(annual) => {
          checkout.reset();
          setIsAnnual(annual);
        }}
      />
      {query.isPending ? (
        <p role="status" className="text-center text-gray-500">
          Cargando planes…
        </p>
      ) : query.isError ? (
        <div role="alert" className="text-center">
          <p className="mb-3 text-gray-500">No pudimos cargar los planes.</p>
          <Button variant="secondary" onClick={() => query.refetch()}>
            Reintentar
          </Button>
        </div>
      ) : query.data.length === 0 ? (
        <p className="text-center text-gray-500">No hay planes disponibles.</p>
      ) : (
        <PlanGrid
          plans={query.data}
          isAnnual={isAnnual}
          currentPlanId={access.data?.effectivePlanId}
          canManage={Boolean(access.data?.canManageBilling)}
          pending={checkout.isPending}
          onSelect={(id) => {
            checkout.reset();
            setSelectedPlanId(id);
          }}
        />
      )}
      {selectedPlanId && (
        <PlanCheckout
          key={`${selectedPlanId}-${isAnnual}`}
          selection={{ planId: selectedPlanId, cycle: isAnnual ? 'ANNUAL' : 'MONTHLY' }}
          canManage={Boolean(access.data?.canManageBilling)}
          checkoutPending={checkout.isPending}
          checkoutError={checkout.isError ? checkout.error.message : undefined}
          onCheckout={() => checkout.mutate({ planId: selectedPlanId, cycle: isAnnual ? 'ANNUAL' : 'MONTHLY' })}
        />
      )}
      {access.data && !access.data.canManageBilling && (
        <p className="mt-6 text-center text-sm text-gray-500">Solo el propietario puede gestionar la suscripción.</p>
      )}
    </>
  );
}
