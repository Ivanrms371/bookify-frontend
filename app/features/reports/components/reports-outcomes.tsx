import { Heading, Text } from '@/shared/components/typography';
import { Card } from '@/shared/components/ui/card';
import type { ReportsOutcomeKey } from '../types/reports.types';
import type { ReportsOutcomesProps } from '../types/reports-props.types';

const presentation: Record<ReportsOutcomeKey, { name: string; color: string }> = {
  completed: { name: 'Completadas', color: 'bg-indigo-500' },
  cancelled: { name: 'Canceladas', color: 'bg-rose-400' },
  noShow: { name: 'No asistieron', color: 'bg-amber-400' },
  pendingConfirmed: { name: 'Pendientes / confirmadas', color: 'bg-slate-400' },
};

export function ReportsOutcomes({ outcomes }: ReportsOutcomesProps) {
  const totalAppointments = outcomes.reduce((total, outcome) => total + outcome.count, 0);
  const items = outcomes.map((outcome) => ({ ...outcome, ...presentation[outcome.key] }));
  return (
    <Card as="section" aria-labelledby="reports-outcomes-heading">
      <Heading as="h2" id="reports-outcomes-heading" className="font-display text-xl md:text-2xl font-semibold text-gray-900">
        Resultado de las citas
      </Heading>
      <Text className="mt-1 font-sans text-base leading-relaxed tracking-normal font-normal text-gray-600">
        {totalAppointments} citas en total
      </Text>
      <div className="mt-5 flex h-3 overflow-hidden rounded-full" aria-hidden="true">
        {items.map((item) => (
          <div
            key={item.name}
            className={item.color}
            style={{ width: `${totalAppointments > 0 ? (item.count / totalAppointments) * 100 : 0}%` }}
          />
        ))}
      </div>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <li key={item.name} className="space-y-2">
            <p className="flex items-center gap-2 text-sm text-gray-600">
              <span aria-hidden="true" className={`size-2.5 shrink-0 rounded-full ${item.color}`} />
              {item.name}
            </p>
            <p className="text-2xl font-semibold text-gray-900">
              {item.count}
              <span className="ml-2 text-sm font-normal text-gray-500">
                {(totalAppointments > 0 ? (item.count / totalAppointments) * 100 : 0).toLocaleString('es-UY', { maximumFractionDigits: 1 })}
                %
              </span>
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
