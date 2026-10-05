import { Link, useParams } from 'react-router';
import { Button } from '@/shared/components/ui';
import { useChangeEligibility, usePlanChange } from '../../hooks/use-plan-change';
import { formatBillingDate } from '../../utils/billing-format';
import type { PlanChangeReviewProps } from '../../types/plan-change.types';

export function PlanChangeReview({ selection, canManage }: PlanChangeReviewProps) {
  const { slug } = useParams();
  const eligibility = useChangeEligibility(selection, canManage);
  const change = usePlanChange();
  if (!canManage) return null;
  return (
    <section aria-label="Cambio de plan" className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="font-semibold">Revisa el cambio a {selection.planId === 'pro_plus' ? 'Pro+' : 'Pro'}</h2>
      {eligibility.isPending || eligibility.isFetching ? (
        <p role="status" className="mt-3">
          Comprobando el cambio…
        </p>
      ) : eligibility.isError ? (
        <p role="alert" className="mt-3">
          No pudimos comprobar el cambio.
        </p>
      ) : (
        <>
          {eligibility.data.blockers.map((blocker) => (
            <div key={`${blocker.code}-${blocker.resource ?? 'selection'}`} className="mt-3 text-sm text-amber-800">
              <p>{blocker.message}</p>
              {blocker.resource === 'professionals' && (
                <Link className="underline" to={`/${slug}/professionals`}>
                  Ir a profesionales
                </Link>
              )}
              {blocker.resource === 'services' && (
                <Link className="underline" to={`/${slug}/services`}>
                  Ir a servicios
                </Link>
              )}
            </div>
          ))}
          {eligibility.data.eligible && (
            <>
              <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                {eligibility.data.kind === 'upgrade'
                  ? 'Lemon Squeezy cobrará ahora la diferencia proporcional. Tu nuevo plan se activará cuando el pago se confirme.'
                  : eligibility.data.kind === 'cycle'
                    ? `Cambiarás al pago ${selection.cycle === 'ANNUAL' ? 'anual' : 'mensual'} el ${formatBillingDate(eligibility.data.effectiveAt!)}. No se cobrará hoy. Tu plan y sus beneficios se mantienen.`
                    : eligibility.data.kind === 'undo'
                      ? 'Cancelarás el cambio programado y conservarás tu plan actual. No se cobrará una mejora nueva.'
                      : `Conservarás todos los beneficios y límites actuales hasta ${formatBillingDate(eligibility.data.effectiveAt!)}. Después se aplicará el plan seleccionado y su precio de renovación.`}
              </p>
              <Button
                variant="primary"
                className="mt-4"
                disabled={change.isPending}
                onClick={() => change.mutate({ action: 'change', selection })}
              >
                {change.isPending
                  ? 'Confirmando…'
                  : eligibility.data.kind === 'upgrade'
                    ? 'Confirmar mejora y pagar diferencia'
                    : eligibility.data.kind === 'cycle'
                      ? 'Programar cambio de ciclo'
                      : eligibility.data.kind === 'undo'
                        ? 'Cancelar cambio programado'
                        : 'Programar reducción'}
              </Button>
            </>
          )}
        </>
      )}
      {eligibility.isError && (
        <Button className="mt-4" variant="secondary" onClick={() => eligibility.refetch()}>
          Reintentar comprobación
        </Button>
      )}
      {change.isError && (
        <p role="alert" className="mt-3 text-red-700">
          {change.error.message}
        </p>
      )}
      {change.data && (
        <p role="status" className="mt-3">
          {change.data.state === 'confirmed' ? 'Cambio confirmado.' : 'Solicitud enviada. Consulta su estado en Facturación.'}
        </p>
      )}
      <Link to={`/${slug}/billing`} className="mt-4 block text-sm underline">
        Volver a Facturación
      </Link>
    </section>
  );
}
