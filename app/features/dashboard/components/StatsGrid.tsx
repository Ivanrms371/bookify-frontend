import { useDashboard } from '../hooks/useDashboard';
import { StatsCard } from './StatsCard';
import { formatUYU, formatCompactUYU } from '@/shared/utils/currency';

export const StatsGrid = () => {
  const { data, isLoading } = useDashboard();

  if (isLoading || !data?.stats) {
    return (
      <div className="grid grid-cols-2 gap-2 md:gap-4 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[140px] w-full animate-pulse rounded-3xl bg-mist-100 dark:bg-mist-900/30" />
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
        trend={stats.revenue.trend}
        color="indigo"
        className="order-1"
      />
      <StatsCard
        title="Turnos hoy"
        value={stats.appointmentsToday.current.toString()}
        trend={stats.appointmentsToday.trend}
        color="mist"
        className="order-2 lg:order-2"
      />
      <StatsCard
        title="Clientes nuevos"
        value={stats.newCustomers.current.toString()}
        trend={stats.newCustomers.trend}
        color="indigo"
        className="order-4 lg:order-3"
      />
      <StatsCard title="Clientes totales" value={stats.totalCustomers.current.toString()} color="mist" className="order-3 lg:order-4" />
    </div>
  );
};
