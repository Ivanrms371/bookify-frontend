import { Heading, Text } from '@/shared/components/typography';
import { Card } from '@/shared/components/ui/card';
import { formatReportCurrency } from '../utils/report-currency';
import type { ReportsTopServicesProps } from '../types/reports-props.types';

export function ReportsTopServices({ services, currency = 'UYU' }: ReportsTopServicesProps) {
  const maxRevenue = Math.max(0, ...services.map((service) => service.revenue));
  return (
    <Card as="section" aria-labelledby="reports-services-heading" className="min-w-0">
      <Heading as="h2" id="reports-services-heading" className="font-display text-xl md:text-2xl font-semibold text-gray-900">
        Servicios destacados
      </Heading>
      <Text className="mt-1 font-sans text-base leading-relaxed tracking-normal font-normal text-gray-600">Ordenados por ingresos</Text>
      {services.length === 0 && <Text className="mt-6">No hay servicios con citas completadas en este período.</Text>}
      <ol className="mt-6 space-y-5">
        {services.map((item) => (
          <li key={item.id}>
            <div className="mb-2 flex flex-wrap justify-between gap-2 text-sm">
              <span className="text-base font-normal text-gray-700">{item.name}</span>
              <span className="font-medium text-gray-800">{formatReportCurrency(item.revenue, currency)}</span>
            </div>
            <div className="h-2 rounded-full bg-indigo-50" aria-hidden="true">
              <div
                className="h-full rounded-full bg-indigo-500"
                style={{ width: `${maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0}%` }}
              />
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
