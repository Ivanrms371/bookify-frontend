export function formatServicePrice(price: number): string {
  const amount = new Intl.NumberFormat('es-UY', {
    maximumFractionDigits: 0,
  }).format(price);

  return `$${amount}`;
}
