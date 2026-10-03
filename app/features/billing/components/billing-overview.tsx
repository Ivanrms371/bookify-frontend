import { Link, useParams } from 'react-router';
import { SubscriptionNotice } from './subscription-notice';
import { Button } from '@/shared/components/ui';
import { useBillingSummary } from '../hooks/use-billing-subscription';
import { BillingCurrentPlan } from './billing-current-plan';
import { BillingPlanUsage } from './billing-plan-usage';
import { BillingPaymentHistory } from './billing-payment-history';
import { CustomerPortalButton } from './customer-portal-button';
import { useBillingReturnRefresh } from '../hooks/use-customer-portal';
import { Heading, Text } from '@/shared/components/typography';

export function BillingOverview() {
  const query = useBillingSummary();
  useBillingReturnRefresh();
  const { slug } = useParams();
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <Heading>Facturación</Heading>
        <Text size="base" weight="medium" variant="subtle">
          Tu suscripción, el uso de tu plan y tus pagos en un solo lugar.
        </Text>
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
          {query.data.access.canManageBilling && query.data.allowedActions.manageSubscription && (
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
              <p className="text-xs text-gray-500">
                Gestiona tu método de pago y tu suscripción en Lemon Squeezy. Los cambios se reflejarán al volver.
              </p>
              {query.data.allowedActions.cancelSubscription && <CustomerPortalButton label="Cancelar suscripción" variant="danger" />}
            </div>
          )}
        </>
      )}
    </div>
  );
}
