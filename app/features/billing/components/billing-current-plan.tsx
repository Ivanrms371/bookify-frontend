import { useSubscriptionNotice } from '../hooks/use-subscription-notice';
import { useNavigate, useParams } from 'react-router';
import { CustomerPortalButton } from './customer-portal-button';
import { CreditCardIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Button, Card } from '@/shared/components/ui';
import type { BillingSummary } from '../types/billing.types';
import { formatBillingDate, formatBillingMoney, subscriptionStatusLabel } from '../utils/billing-format';
import { Text } from '@/shared/components/typography';

export function BillingCurrentPlan({ summary }: { summary: BillingSummary }) {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { subscription, currentPlan } = summary;
  const notice = useSubscriptionNotice(summary.access);
  const status = subscription && notice?.needsPlan ? 'Finalizada' : subscription ? subscriptionStatusLabel(subscription.status) : null;
  const date = subscription?.status === 'TRIAL' ? subscription.trialEndsAt : (subscription?.endsAt ?? subscription?.currentPeriodEnd);
  const dateLabel =
    subscription?.status === 'TRIAL' ? 'Fin de la prueba' : subscription?.endsAt ? 'Fin del acceso' : 'Fin del período actual';

  return (
    <Card as="section" aria-labelledby="current-plan" className="p-0">
      <div className="flex relative flex-col justify-between gap-6 p-6 sm:flex-row sm:p-8">
        <div>
          <div className="absolute bg-indigo-500 text-white font-medium text-sm py-1 px-2 -top-2 rounded-lg">Tu plan actual</div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-semibold text-gray-900 font-display">{currentPlan?.title ?? 'Sin plan disponible'}</h2>
            {subscription && <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800">{status}</span>}
          </div>
          <Text className="mt-1" weight="medium" variant="subtle">
            {currentPlan?.description ?? 'Explora los planes disponibles para tu negocio.'}
          </Text>
        </div>
        <div className="sm:text-right">
          {subscription?.amount != null && (
            <p className="text-3xl font-display font-semibold text-gray-900">
              {formatBillingMoney(subscription.amount, subscription.currency)}{' '}
              <Text as="span" weight="medium" variant="subtle" size="base">
                {' '}
                {subscription.cycle === 'ANNUAL' ? '/ año' : subscription.cycle === 'MONTHLY' ? '/ mes' : ''}
              </Text>
            </p>
          )}
          {subscription?.status === 'TRIAL' && (
            <Text className="mt-1" weight="medium" variant="subtle">
              Sin cobro durante la prueba
            </Text>
          )}
          {date && (
            <Text className="mt-1" weight="medium" variant="subtle">
              {dateLabel}: {formatBillingDate(date)}
            </Text>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl px-6 py-4 sm:px-8">
        <p className="flex items-center gap-2 text-sm text-gray-800 font-medium">
          <CreditCardIcon className="size-4.5" />
          {subscription?.paymentMethod ?? 'Sin método de pago registrado'}
        </p>
        {summary.access.canManageBilling &&
          (summary.allowedActions.manageSubscription ? (
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" onClick={() => navigate(`/${slug}/billing/plans`)}>
                Cambiar plan
              </Button>
              <CustomerPortalButton
                variant="primary"
                label={subscription?.status === 'CANCELLED' ? 'Gestionar o reanudar suscripción' : 'Gestionar suscripción'}
              />
            </div>
          ) : summary.allowedActions.explorePlans ? (
            <div className="sm:text-right">
              <Button variant="primary" size="sm" onClick={() => navigate(`/${slug}/billing/plans`)}>
                Iniciar suscripción de pago
              </Button>
              <p className="mt-2 text-xs text-gray-500">Elige tu plan y el pago mensual o anual.</p>
            </div>
          ) : null)}
      </div>
    </Card>
  );
}
