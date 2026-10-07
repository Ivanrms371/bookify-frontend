import { formatUYU, formatCompactUYU } from '@/shared/utils/currency';

export function formatReportCurrency(value: number, currency = 'UYU', compact = false): string {
  if (currency === 'UYU') return compact ? formatCompactUYU(value) : formatUYU(value);
  return new Intl.NumberFormat('es-UY', {
    style: 'currency', currency, maximumFractionDigits: compact ? 1 : 0,
    ...(compact ? { notation: 'compact' as const } : {}),
  }).format(value);
}
