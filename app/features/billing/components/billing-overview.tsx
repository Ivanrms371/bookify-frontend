import { Link, useParams } from 'react-router';
import { SubscriptionNotice } from './subscription-notice';
import { Button } from '@/shared/components/ui';
import { useBillingSummary } from '../hooks/use-billing-subscription';
import { BillingCurrentPlan } from './billing-current-plan';
import { BillingPlanUsage } from './billing-plan-usage';
import { BillingPaymentHistory } from './billing-payment-history';

export function BillingOverview() {
  const query = useBillingSummary();
  const { slug } = useParams();
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Facturación</h1>
        <p className="mt-2 text-sm text-gray-500">Tu suscripción, el uso de tu plan y tus pagos en un solo lugar.</p>
      </div>
      {query.isPending ? (
        <p role="status" className="py-8 text-gray-500">
          Cargando suscripción…
        </p>
      ) : query.isError ? (
        <div role="alert" className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="mb-3">No pudimos cargar tu suscripción. Comprueba que tienes acceso a facturación.</p>
          <Button variant="secondary" onClick={() => query.refetch()}>
            Reintentar
          </Button>
          <Link to={`/${slug}/billing/plans`} className="ml-4 text-sm text-indigo-600">
            Ver planes
          </Link>
        </div>
      ) : (
        <>
          <SubscriptionNotice access={query.data.access} />
          <BillingCurrentPlan summary={query.data} />
          <BillingPlanUsage summary={query.data} />
          <BillingPaymentHistory />
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
            <p className="text-xs text-gray-500">La gestión de pagos se conectará con Lemon Squeezy.</p>
            <Button variant="ghost" size="sm" disabled title="Conexión con Lemon Squeezy pendiente">
              Cancelar suscripción
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
