export const formatBillingMoney = (amount: string | number, currency: string) =>
  new Intl.NumberFormat('es', { style: 'currency', currency }).format(Number(amount));

export const formatBillingDate = (date: string) =>
  new Intl.DateTimeFormat('es', { dateStyle: 'long' }).format(new Date(date));

export const subscriptionStatusLabel = (status: string) => ({
  TRIAL: 'Prueba gratuita', ACTIVE: 'Activa', CANCELLED: 'Cancelada', EXPIRED: 'Finalizada',
  PAST_DUE: 'Pago pendiente', PAUSED: 'Pausada', SUSPENDED: 'Suspendida', PENDING_PAYMENT: 'Pago pendiente',
}[status] ?? status);
