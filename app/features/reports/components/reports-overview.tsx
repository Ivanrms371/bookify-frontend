import { useState } from 'react';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { Button } from '@/shared/components/ui/button';
import { Text } from '@/shared/components/typography';
import { formatDateDMY } from '@/shared/utils/date';
import { ReportsFilters } from './reports-filters';
import { ReportsSummary } from './reports-summary';
import { ReportsDailyRevenue } from './reports-daily-revenue';
import { ReportsTopServices } from './reports-top-services';
import { ReportsProfessionals } from './reports-professionals';
import { ReportsOutcomes } from './reports-outcomes';
import { ReportsLoading } from './reports-loading';
import { useReportsOverview } from '../hooks/use-reports-overview';
import type { ReportsFilters as Filters } from '../types/reports.types';

const calendarLabel = (date: string) => formatDateDMY(`${date}T12:00:00`);

export function ReportsOverview() {
  const tenantId = useAuthStore((state) => state.session?.activeTenant?.id);
  return tenantId ? <ReportsContent key={tenantId} /> : null;
}

function ReportsContent() {
  const [filters, setFilters] = useState<Filters>({
    period: 'this-month', professionalId: 'all', serviceId: 'all', startDate: '', endDate: '',
  });
  const { options, overview, validationError } = useReportsOverview(filters);
  const data = overview.data;
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-6">
      <ReportsFilters
        value={filters}
        options={options.data ?? { services: [], professionals: [] }}
        optionsLoading={!options.data && (options.isPending || options.isError)}
        dateError={validationError}
        onChange={setFilters}
      />
      {options.isError && (
        <div role="alert" className="flex flex-wrap items-center gap-3 text-sm text-gray-700">
          No se pudieron cargar las opciones de filtros.
          <Button variant="secondary" size="sm" onClick={() => void options.refetch()}>Reintentar filtros</Button>
        </div>
      )}
      {overview.isError && !validationError && (
        <div role="alert" className="space-y-3 rounded-2xl bg-white p-5 text-gray-700">
          <Text>{overview.error.message || 'No se pudieron cargar los reportes.'}</Text>
          <Button variant="secondary" onClick={() => void overview.refetch()}>Reintentar</Button>
        </div>
      )}
      {!data && !validationError && !overview.isError && overview.isFetching && <ReportsLoading />}
      {data && (
        <div className="space-y-6" aria-busy={overview.isFetching}>
          <div className="space-y-1">
            <Text className="text-sm text-gray-500">
              {calendarLabel(data.period.startDate)} – {calendarLabel(data.period.endDate)} · Comparado con {calendarLabel(data.period.previousStartDate)} – {calendarLabel(data.period.previousEndDate)}
            </Text>
            {(overview.isFetching || overview.isPlaceholderData || validationError) && (
              <Text role="status" className="text-sm text-gray-500">
                {validationError ? 'Se muestran los últimos resultados. Completa un período válido para actualizar.' : 'Actualizando resultados…'}
              </Text>
            )}
          </div>
          <ReportsSummary summary={data.summary} currency={data.period.currency} />
          <ReportsDailyRevenue data={data.dailyRevenue} currency={data.period.currency} />
          <div className="grid min-w-0 gap-6 xl:grid-cols-2">
            <ReportsTopServices services={data.topServices} currency={data.period.currency} />
            <ReportsProfessionals professionals={data.professionals} currency={data.period.currency} />
          </div>
          <ReportsOutcomes outcomes={data.outcomes} />
        </div>
      )}
    </div>
  );
}
