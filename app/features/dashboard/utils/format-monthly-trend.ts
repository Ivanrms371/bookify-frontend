export function formatMonthlyTrend(trend: string): string {
  if (!trend) return '';
  const percentage = Number(trend.replace('%', ''));
  if (!Number.isFinite(percentage)) return trend;
  if (percentage === 0) return '0% vs mes pasado';
  const amount = Math.abs(percentage).toLocaleString('es-UY', { maximumFractionDigits: 2 });
  return `${percentage > 0 ? '+' : '−'}${amount}% vs mes pasado`;
}
