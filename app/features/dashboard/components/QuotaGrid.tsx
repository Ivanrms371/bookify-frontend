import { useDashboard } from '../hooks/useDashboard';
import { QuotaCard } from './QuotaCard';
import { EnvelopeIcon, ChatBubbleLeftRightIcon, CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export const QuotaGrid = () => {
  const { data, isLoading } = useDashboard();

  if (isLoading || !data?.quota) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 w-full animate-pulse rounded-3xl bg-gray-100 dark:bg-gray-900/30" />
        ))}
      </div>
    );
  }

  const { quota } = data;

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
      <QuotaCard title="Emails" quota={quota.emails} icon={EnvelopeIcon} />
      <QuotaCard title="WhatsApp" quota={quota.whatsapp} icon={ChatBubbleLeftRightIcon} />
      <QuotaCard title="Turnos" quota={quota.appointments} icon={CalendarIcon} />
      <QuotaCard title="Profesionales" quota={quota.professionals} icon={UserGroupIcon} />
    </div>
  );
};
