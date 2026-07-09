
export const formatUYU = (val: number | string): string => {
  const amount = typeof val === 'string' ? Number(val) : val;
  
  return new Intl.NumberFormat('es-UY', {
    style: 'currency',
    currency: 'UYU',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCompactUYU = (val: number | string): string => {
  const amount = typeof val === 'string' ? Number(val) : val;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
};