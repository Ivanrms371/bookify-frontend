import { usePermissions } from '@/core/auth/use-permissions';
import { Link, useParams } from 'react-router';
import { cn } from '@/shared/utils';
import { useSubscriptionAccess } from '../hooks/use-billing-subscription';
import { useSubscriptionNotice } from '../hooks/use-subscription-notice';

export function SidebarSubscriptionCard() {
  const { slug } = useParams();
  const access = useSubscriptionAccess();
  const { can } = usePermissions();
  const notice = useSubscriptionNotice(access.data);

  if (!can('billing:read') || !slug || access.isPending) return null;
  if (access.isError || !access.data) return null;

  const isTrial = access.data.state === 'trial' && !notice?.needsPlan;
  if (!notice) return null;

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
      {can('billing:read') && (showPlans || access.data.canManageBilling) && (
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
