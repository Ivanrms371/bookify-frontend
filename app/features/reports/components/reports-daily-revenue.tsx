import { Heading, Text } from '@/shared/components/typography';
import { Card } from '@/shared/components/ui/card';
import { ChartBase } from '@/shared/components/ui/chart';
import { formatReportCurrency } from '../utils/report-currency';
import { formatDateFull, formatDateShort } from '@/shared/utils/date';
import type { ReportsDailyRevenueProps } from '../types/reports-props.types';

export function ReportsDailyRevenue({ data, currency = 'UYU' }: ReportsDailyRevenueProps) {
  const totalRevenue = data.reduce((total, day) => total + day.revenue, 0);
  return (
    <Card as="section" aria-labelledby="reports-revenue-heading" className="min-w-0">
      <Heading as="h2" id="reports-revenue-heading" className="font-display text-xl md:text-2xl font-semibold text-gray-900">
        Ingresos por día
      </Heading>
      <Text className="mt-1 font-sans text-base leading-relaxed tracking-normal font-normal text-gray-600">Evolución de los ingresos</Text>
      <div
        className="mt-6 h-64 min-w-0 sm:h-80"
        role="img"
        aria-label={`Gráfico de ingresos diarios, con un total de ${formatReportCurrency(totalRevenue, currency)}`}
      >
        <ChartBase
          data={data.map((day) => ({ ...day, date: /^\d{4}-\d{2}-\d{2}$/.test(day.date) ? `${day.date}T12:00:00` : day.date }))}
          xKey="date"
          yKey="revenue"
          color="#6366f1"
          height="100%"
          formatXAxis={formatDateShort}
          formatYAxis={(value) => formatReportCurrency(value, currency)}
          formatXAxisTooltip={formatDateFull}
        />
      </div>
    </Card>
  );
}
