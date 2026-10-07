import { useDashboard } from '../hooks/useDashboard';
import { StatsCard } from './StatsCard';
import { formatMonthlyTrend } from '../utils/format-monthly-trend';

const formatDailyTrend = (trend: string) => {
  if (trend === 'Igual que ayer') return '0 vs ayer';
  return trend.replace(/^(\d+) más que ayer$/, '+$1 vs ayer').replace(/^(\d+) menos que ayer$/, '−$1 vs ayer');
};
import { formatUYU, formatCompactUYU } from '@/shared/utils/currency';

export const StatsGrid = () => {
  const { data, isLoading } = useDashboard();

  if (isLoading || !data?.stats) {
    return (
      <div className="grid grid-cols-2 gap-2 md:gap-4 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[140px] w-full animate-pulse rounded-3xl bg-gray-100 dark:bg-gray-900/30" />
        ))}
      </div>
    );
  }

  const { stats } = data;

  return (
    <div className="grid grid-cols-2 gap-2 md:gap-4 lg:grid-cols-4">
      <StatsCard
        title="Ingresos este mes"
        value={formatCompactUYU(stats.revenue.current)}
        trend={formatMonthlyTrend(stats.revenue.trend)}
        color="indigo"
        className="order-1"
      />
      <StatsCard
        title="Turnos hoy"
        value={stats.appointmentsToday.current.toString()}
        trend={formatDailyTrend(stats.appointmentsToday.trend)}
        color="gray"
        className="order-2 lg:order-2"
      />
      <StatsCard
        title="Clientes nuevos"
        value={stats.newCustomers.current.toString()}
        trend={formatMonthlyTrend(stats.newCustomers.trend)}
        color="indigo"
        className="order-4 lg:order-3"
      />
      <StatsCard title="Clientes totales" value={stats.totalCustomers.current.toString()} color="gray" className="order-3 lg:order-4" />
    </div>
  );
};
