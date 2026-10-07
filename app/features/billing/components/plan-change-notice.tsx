import { useState } from 'react';
import { Button } from '@/shared/components/ui';
import { usePlanChange } from '../hooks/use-plan-change';
import { formatBillingDate } from '../utils/billing-format';
import type { PlanChangeNoticeProps } from '../types/plan-change.types';

export function PlanChangeNotice({ summary }: PlanChangeNoticeProps) {
  const change = usePlanChange();
  const [confirmUndo, setConfirmUndo] = useState(false);
  const subscription = summary.subscription;
  if (!subscription?.pendingPlanId) return null;
  const freeChange = subscription.pendingPlanId === 'free';
  const downgrade = subscription.planId === 'pro_plus' && subscription.pendingPlanId === 'pro';
  const cycleChange = subscription.pendingPlanId === subscription.planId && subscription.pendingBillingCycle !== subscription.cycle;
  return (
    <section aria-label="Cambio de plan pendiente" className="rounded-xl border border-indigo-200 bg-indigo-50 p-5">
      <p className="text-sm text-indigo-950">
        {freeChange
          ? subscription.planChangeUndoRequestedAt
            ? 'Estamos confirmando que la renovación de tu plan de pago se ha reanudado.'
            : subscription.planChangesAt
              ? `Pasarás a Free el ${formatBillingDate(subscription.planChangesAt)}. La renovación está cancelada. Conservas los beneficios de tu plan hasta entonces; el negocio debe mantenerse dentro de 1 profesional y 10 servicios.`
              : 'Estamos confirmando la cancelación de la renovación con Lemon Squeezy. Tu cambio a Free aún no está confirmado.'
          : downgrade && subscription.planChangesAt
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
          {(downgrade ||
            cycleChange ||
            (freeChange && !subscription.planChangeUndoRequestedAt && new Date(subscription.planChangesAt ?? '') > new Date())) &&
            subscription.planChangesAt && (
              <Button
                variant="secondary"
                disabled={change.isPending}
                onClick={() => (freeChange ? setConfirmUndo(true) : change.mutate({ action: 'cancel' }))}
              >
                Cancelar cambio programado
              </Button>
            )}
        </div>
      )}
      {confirmUndo && freeChange && (
        <div className="mt-4 space-y-3 rounded-lg bg-white p-4">
          <p className="text-sm">
            Se cancelará el cambio a Free y se reanudará la renovación de tu plan de pago al precio y ciclo actuales.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              disabled={change.isPending}
              onClick={() => change.mutate({ action: 'cancel' }, { onSuccess: () => setConfirmUndo(false) })}
            >
              Conservar plan de pago
            </Button>
            <Button variant="secondary" disabled={change.isPending} onClick={() => setConfirmUndo(false)}>
              Volver
            </Button>
          </div>
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
