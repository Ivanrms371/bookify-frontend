import { Link, useParams } from 'react-router';
import { ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { cn } from '@/shared/utils';
import { useSubscriptionNotice } from '../hooks/use-subscription-notice';
import type { SubscriptionAccess } from '../types/billing.types';

export function SubscriptionNotice({
  access,
  compact = false,
  showPlansLink = true,
}: {
  access: SubscriptionAccess;
  compact?: boolean;
  showPlansLink?: boolean;
}) {
  const { slug } = useParams();
  const notice = useSubscriptionNotice(access);
  if (!notice) return null;
  const Icon = notice.tone === 'warning' ? ExclamationTriangleIcon : ClockIcon;
  return (
    <div
      role="status"
      className={cn(
        'rounded-xl border p-4',
        compact ? 'mt-3' : 'mb-6',
        notice.tone === 'warning' ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-indigo-100 bg-indigo-50 text-indigo-900',
      )}
    >
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 size-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">{notice.title}</p>
          <p className="mt-1 text-sm">{notice.message}</p>
          {showPlansLink && (
            <Link to={`/${slug}/billing/plans`} className="mt-3 inline-block text-sm font-semibold underline underline-offset-4">
              {notice.needsPlan ? 'Seleccionar un plan' : 'Ver planes'}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
