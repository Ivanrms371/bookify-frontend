import Decimal from 'decimal.js';

export const formatUYU = (val: number | string | Decimal): string => {
  const amount = typeof val === 'string' ? Number(val) : val instanceof Decimal ? val.toNumber() : val;

  return new Intl.NumberFormat('es-UY', {
    style: 'currency',
    currency: 'UYU',
    maximumFractionDigits: 0,
  }).format(amount);
};

export function formatCurrency(val: number | string | Decimal) {
  const amount = typeof val === 'string' ? Number(val) : val instanceof Decimal ? val.toNumber() : val;

  return new Intl.NumberFormat('es-UY', {
    style: 'currency',
    currency: 'UYU',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export const formatCompactUYU = (val: number | string): string => {
  const amount = typeof val === 'string' ? Number(val) : val;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
};
