import { Link, useParams } from 'react-router';
import type { BillingSummary } from '../types/billing.types';
import { Card } from '@/shared/components/ui';
import { Heading, Text } from '@/shared/components/typography';

function UsageItem({ label, used, limit }: { label: string; used: number; limit?: number }) {
  const available = limit === undefined ? undefined : Math.max(0, limit - used);
  return (
    <div>
      <div className="mb-3 flex justify-between text-sm">
        <Text variant="default" size="base" className="font-medium text-gray-700e">
          {label}
        </Text>
        <span className="text-gray-500">
          <strong className="text-gray-900">{used}</strong>
          {limit !== undefined && ` / ${limit}`}
        </span>
      </div>
      {limit !== undefined && (
        <div
          role="progressbar"
          aria-label={label}
          aria-valuenow={Math.min(used, limit)}
          aria-valuemin={0}
          aria-valuemax={limit}
          className="h-2 overflow-hidden rounded-full bg-gray-200"
        >
          <div className="h-full rounded-full bg-indigo-500" style={{ width: `${limit > 0 ? Math.min((used / limit) * 100, 100) : 0}%` }} />
        </div>
      )}
      <p className="mt-2 text-xs text-gray-500">
        {limit === undefined
          ? 'Límite del plan aún no definido'
          : used > limit
            ? `${used - limit} por encima del límite`
            : `${available} disponibles`}
      </p>
    </div>
  );
}

export function BillingPlanUsage({ summary }: { summary: BillingSummary }) {
  const { slug } = useParams();
  return (
    <Card as="section" aria-labelledby="plan-usage" className="p-6 sm:p-8">
      <Heading className="text-xl md:text-2xl font-semibold text-gray-900">Uso del plan</Heading>
      <Text variant="muted" size="base">
        Profesionales y servicios registrados en tu negocio.
      </Text>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 sm:gap-10">
        <UsageItem label="Profesionales" used={summary.usage.professionals} limit={summary.currentPlan?.limits.professionals} />
        <UsageItem label="Servicios" used={summary.usage.services} limit={summary.currentPlan?.limits.services} />
      </div>
    </Card>
  );
}
