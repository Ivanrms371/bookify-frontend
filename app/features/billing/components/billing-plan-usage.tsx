import { Link, useParams } from 'react-router';
import type { BillingSummary } from '../types/billing.types';

function UsageItem({ label, used, limit, to }: { label: string; used: number; limit?: number; to: string }) {
  const available = limit === undefined ? undefined : Math.max(0, limit - used);
  return (
    <div>
      <div className="mb-3 flex justify-between text-sm">
        <Link to={to} className="font-medium text-gray-700 hover:text-indigo-600">
          {label}
        </Link>
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
          className="h-2 overflow-hidden rounded-full bg-gray-100"
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
    <section aria-labelledby="plan-usage" className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 id="plan-usage" className="text-lg font-semibold text-gray-900">
        Uso del plan
      </h2>
      <p className="mt-1 text-sm text-gray-500">Profesionales y servicios registrados en tu negocio.</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 sm:gap-10">
        <UsageItem
          label="Profesionales"
          used={summary.usage.professionals}
          limit={summary.currentPlan?.limits.professionals}
          to={`/${slug}/professionals`}
        />
        <UsageItem label="Servicios" used={summary.usage.services} to={`/${slug}/services`} />
      </div>
    </section>
  );
}
