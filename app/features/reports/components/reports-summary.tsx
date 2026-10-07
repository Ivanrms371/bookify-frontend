import { StatsCard } from '@/features/dashboard/components/StatsCard';
import { formatReportCurrency } from '../utils/report-currency';
import type { ReportsSummaryProps } from '../types/reports-props.types';

function formatComparison(current: number, previous: number): string {
  if (previous <= 0) return '';
  const change = (current / previous - 1) * 100;
  const amount = Math.abs(change).toLocaleString('es-UY', { maximumFractionDigits: 1 });
  return `${change >= 0 ? '+' : '−'}${amount}% vs anterior`;
}

export function ReportsSummary({ summary, currency = 'UYU' }: ReportsSummaryProps) {
  const metrics = [
    {
      label: 'Ingresos',
      value: formatReportCurrency(summary.current.revenue, currency, true),
      previous: summary.previous.revenue,
      current: summary.current.revenue,
    },
    {
      label: 'Citas completadas',
      value: String(summary.current.completed),
      previous: summary.previous.completed,
      current: summary.current.completed,
    },
    {
      label: 'Ticket promedio',
      value: formatReportCurrency(summary.current.completed > 0 ? summary.current.revenue / summary.current.completed : 0, currency, true),
      previous: summary.previous.completed > 0 ? summary.previous.revenue / summary.previous.completed : 0,
      current: summary.current.completed > 0 ? summary.current.revenue / summary.current.completed : 0,
    },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric, index) => (
        <StatsCard
          key={metric.label}
          title={metric.label}
          value={metric.value}
          trend={formatComparison(metric.current, metric.previous)}
          trendDescription="Comparación con el período anterior"
          color={index === 1 ? 'gray' : 'indigo'}
          className="min-w-0"
        />
      ))}
    </div>
  );
}
