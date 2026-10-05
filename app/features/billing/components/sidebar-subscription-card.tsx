import { CreditCardIcon } from '@heroicons/react/24/outline';
import { Link, useParams } from 'react-router';
import { cn } from '@/shared/utils';
import { useSubscriptionAccess } from '../hooks/use-billing-subscription';
import { useSubscriptionNotice } from '../hooks/use-subscription-notice';

export function SidebarSubscriptionCard() {
  const { slug } = useParams();
  const access = useSubscriptionAccess();
  const notice = useSubscriptionNotice(access.data);

  if (!slug || access.isPending) return null;
  if (access.isError || !access.data) return null;

  const isTrial = access.data.state === 'trial' && !notice?.needsPlan;
  if (!notice) {
    return access.data.canManageBilling ? <BillingLink slug={slug} /> : null;
  }

  const isUrgent = notice.tone === 'warning';
  const showPlans = isTrial || notice.needsPlan;

  return (
    <div
      className={cn(
        'mb-4 rounded-lg bg-linear-to-br from-indigo-50 to-indigo-200 p-4 shadow-sm transition-colors duration-300',
        isUrgent && 'from-amber-50 to-amber-200',
      )}
    >
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{isTrial ? 'Prueba gratuita' : notice.title}</h3>
      {isTrial && <p className="mb-2 text-sm font-semibold text-gray-800">{notice.title}</p>}
      <p className="mb-3 text-sm font-medium text-gray-700">
        {isTrial ? 'Explora las funcionalidades durante tus 14 días de prueba.' : notice.message}
      </p>
      {(showPlans || access.data.canManageBilling) && (
        <Link
          to={`/${slug}/billing${showPlans ? '/plans' : ''}`}
          className={cn(
            'btn btn-primary flex h-8 w-full items-center justify-center px-4 text-sm',
            isUrgent && 'bg-amber-500 hover:bg-amber-600',
          )}
        >
          {showPlans ? 'Ver planes' : 'Ir a facturación'}
        </Link>
      )}
    </div>
  );
}

function BillingLink({ slug }: { slug: string }) {
  return (
    <Link
      to={`/${slug}/billing`}
      className="flex items-center gap-2 rounded-lg px-4 h-10 font-medium text-gray-800 transition-colors duration-300 hover:bg-indigo-500 hover:text-white "
    >
      <CreditCardIcon aria-hidden="true" className="size-5" />
      Facturación
    </Link>
  );
}
