import { ChartBase } from '@/shared/components/ui/chart';
import { useDashboard } from '../hooks/useDashboard';

import { Card } from '@/shared/components/ui';
import { Heading, Text } from '@/shared/components/typography';
import { formatUYU, formatCompactUYU } from '@/shared/utils/currency';
import { formatDateFull, formatDateShort } from '@/shared/utils/date';
import { ChartBarIcon } from 'lucide-react';
export const RevenueChart = () => {
  const { data, isLoading, isError } = useDashboard();

  const totalRevenue = data?.chart?.reduce((acc, curr) => acc + curr.revenue, 0) ?? 0;

  if (isLoading) return <div className="h-full min-h-0 w-full flex-1 animate-pulse rounded-xl border border-slate-100 bg-slate-100/50" />;

  if (isError)
    return (
      <Card className="flex h-full min-h-0 w-full flex-1 flex-col gap-5">
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12">
          <div className="rounded-full bg-mist-100 p-4 dark:bg-mist-900/40">
            <ChartBarIcon className="size-6 text-mist-400 dark:text-mist-500" />
          </div>
          <Text>Ha ocurrido un error al cargar el gráfico</Text>
        </div>
      </Card>
    );

  return (
    <Card className="flex h-full min-h-0 w-full flex-1 flex-col">
      <div className="mb-4 shrink-0 sm:mb-6">
        <Text className="mb-2 text-sm font-medium text-mist-800">Ganancias últimos 30 días</Text>
        <Text className="font-mono text-4xl text-mist-900 dark:text-white">{formatCompactUYU(totalRevenue)}</Text>
      </div>

      <div className="min-h-0 flex-1">
        <ChartBase
          data={data?.chart ?? []}
          xKey="date"
          yKey="revenue"
          color="#6366f1"
          height="100%"
          formatXAxis={formatDateShort}
          formatYAxis={formatUYU}
          formatXAxisTooltip={formatDateFull}
        />
      </div>
    </Card>
  );
};
