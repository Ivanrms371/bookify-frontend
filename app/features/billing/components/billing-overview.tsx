import { PlanChangeNotice } from './plan-change-notice';
import { Link, useParams } from 'react-router';
import { SubscriptionNotice } from './subscription-notice';
import { Button, Card } from '@/shared/components/ui';
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
          <PlanChangeNotice key={`${slug}-${query.data.subscription?.id}`} summary={query.data} />
          <BillingPlanUsage summary={query.data} />
          <BillingPaymentHistory />
          {query.data.access.canManageBilling && query.data.allowedActions.manageSubscription && (
            <Card as="section" aria-labelledby="billing-provider" className="py-6 px-0 sm:py-8 space-y-6">
              <div className="px-6 sm:px-8">
                <Heading id="billing-provider" className="text-xl font-semibold text-gray-900 md:text-2xl">
                  Gestión en Lemon Squeezy
                </Heading>
                <Text variant="muted" size="base">
                  Tu información de pago se gestiona de forma segura en el portal de Lemon Squeezy.
                </Text>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 px-6 sm:px-8">
                <div>
                  <Text variant="default" weight="semibold" size="base">
                    Método de pago
                  </Text>
                  <Text variant="muted" size="base">
                    Actualiza la tarjeta que usas para los cobros de tu suscripción.
                  </Text>
                </div>
                <div>
                  <Text variant="default" weight="semibold" size="base">
                    Datos de facturación
                  </Text>
                  <Text variant="muted" size="base">
                    Gestiona tus datos y tu dirección de facturación.
                  </Text>
                </div>
              </div>
              <div className=" border-t border-gray-100 px-6 sm:px-8 pt-6">
                <Text variant="muted" size="base">
                  Para acceder al portal, pulsa «Gestionar suscripción» en la tarjeta de tu plan actual.{' '}
                  {query.data.allowedActions.cancelSubscription && 'También puedes cancelar tu suscripción desde el portal. '}
                  Los cambios se reflejarán aquí al volver.
                </Text>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
