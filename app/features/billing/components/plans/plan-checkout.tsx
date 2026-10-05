import { Link, useParams } from 'react-router';
import { Button } from '@/shared/components/ui';
import { usePlanEligibility } from '../../hooks/use-checkout';
import type { CheckoutSelection } from '../../types/billing.types';

export function PlanCheckout({
  selection,
  canManage,
  checkoutPending,
  checkoutError,
  onCheckout,
}: {
  selection: CheckoutSelection;
  canManage: boolean;
  checkoutPending: boolean;
  checkoutError?: string;
  onCheckout: () => void;
}) {
  const { slug } = useParams();
  const eligibility = usePlanEligibility(selection, canManage);
  if (!canManage) return null;
  return (
    <section aria-label="Selección de plan" className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="font-semibold">
        Revisa tu selección · {selection.planId === 'pro_plus' ? 'Pro+' : 'Pro'} · {selection.cycle === 'ANNUAL' ? 'Anual' : 'Mensual'}
      </h2>
      {eligibility.isPending || eligibility.isFetching ? (
        <p role="status" className="mt-3 text-sm">
          Comprobando el plan…
        </p>
      ) : eligibility.isError ? (
        <p role="alert" className="mt-3 text-sm">
          No pudimos comprobar el plan.
        </p>
      ) : (
        <>
          {eligibility.data.blockers.map((blocker) => (
            <div key={`${blocker.code}-${blocker.resource ?? 'selection'}`} className="mt-3 text-sm text-amber-800">
              <p>{blocker.message}</p>
              {blocker.resource === 'services' && (
                <Link to={`/${slug}/services`} className="mt-1 inline-block underline">
                  Ir a servicios
                </Link>
              )}
              {blocker.resource === 'professionals' && (
                <Link to={`/${slug}/professionals`} className="mt-1 inline-block underline">
                  Ir a profesionales
                </Link>
              )}
            </div>
          ))}
          {eligibility.data.eligible && (
            <>
              <p className="mt-3 text-sm text-gray-500">Continuarás en Lemon Squeezy para revisar el precio final y completar el pago.</p>
              <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                Al completar el pago, se te cobrará de inmediato y comenzará tu suscripción de pago. Si aún tienes días de prueba gratuita,
                se perderán: no se suman al período de pago. Puedes esperar hasta que termine tu prueba para aprovecharlos.
              </p>
              <Button className="mt-4" variant="primary" disabled={checkoutPending} onClick={onCheckout}>
                {checkoutPending ? 'Abriendo pago…' : 'Continuar al pago'}
              </Button>
            </>
          )}
        </>
      )}
      {(eligibility.isError || (eligibility.data && !eligibility.data.eligible)) && (
        <Button
          className="mt-4"
          variant="secondary"
          disabled={eligibility.isFetching || checkoutPending}
          onClick={() => eligibility.refetch()}
        >
          Comprobar de nuevo
        </Button>
      )}
      {checkoutError && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {checkoutError}
        </p>
      )}
    </section>
  );
}
