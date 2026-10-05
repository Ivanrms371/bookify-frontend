import { Button } from '@/shared/components/ui';
import { usePlanChange } from '../hooks/use-plan-change';
import { formatBillingDate } from '../utils/billing-format';
import type { PlanChangeNoticeProps } from '../types/plan-change.types';

export function PlanChangeNotice({ summary }: PlanChangeNoticeProps) {
  const change = usePlanChange();
  const subscription = summary.subscription;
  if (!subscription?.pendingPlanId) return null;
  const downgrade = subscription.planId === 'pro_plus' && subscription.pendingPlanId === 'pro';
  const cycleChange = subscription.pendingPlanId === subscription.planId && subscription.pendingBillingCycle !== subscription.cycle;
  return (
    <section aria-label="Cambio de plan pendiente" className="rounded-xl border border-indigo-200 bg-indigo-50 p-5">
      <p className="text-sm text-indigo-950">
        {downgrade && subscription.planChangesAt
          ? `Tu cambio a Pro está programado para ${formatBillingDate(subscription.planChangesAt)}. Hasta entonces conservas todos los beneficios y límites de Pro+.`
          : cycleChange
            ? subscription.planChangesAt
              ? `El pago ${subscription.pendingBillingCycle === 'ANNUAL' ? 'anual' : 'mensual'} comenzará el ${formatBillingDate(subscription.planChangesAt)}. Tu plan y sus beneficios se mantienen hasta entonces.`
              : 'Estamos confirmando el cambio de ciclo con Lemon Squeezy. Tu ciclo actual se mantiene.'
            : subscription.pendingPlanId === subscription.planId
              ? 'Estamos confirmando la cancelación del cambio programado.'
              : 'Estamos confirmando el cambio con Lemon Squeezy. Tu plan actual se conserva hasta que el pago o el cambio sea confirmado.'}
      </p>
      {summary.access.canManageBilling && (
        <div className="mt-3 flex flex-wrap gap-3">
          <Button variant="secondary" disabled={change.isPending} onClick={() => change.mutate({ action: 'refresh' })}>
            Actualizar estado
          </Button>
          {(downgrade || cycleChange) && subscription.planChangesAt && (
            <Button variant="secondary" disabled={change.isPending} onClick={() => change.mutate({ action: 'cancel' })}>
              Cancelar cambio programado
            </Button>
          )}
        </div>
      )}
      {change.isPending && (
        <p role="status" className="mt-2 text-sm">
          Confirmando con el proveedor…
        </p>
      )}
      {change.isError && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {change.error.message}
        </p>
      )}
    </section>
  );
}
