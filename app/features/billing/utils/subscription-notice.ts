import type { SubscriptionAccess } from '../types/billing.types';

export interface SubscriptionNoticeData {
  title: string;
  message: string;
  tone: 'info' | 'warning';
  needsPlan: boolean;
}

export function getSubscriptionNotice(access: SubscriptionAccess, now = Date.now()): SubscriptionNoticeData | null {
  const trialEnd = access.trialEndsAt ? Date.parse(access.trialEndsAt) : NaN;
  const accessEnd = access.accessEndsAt ? Date.parse(access.accessEndsAt) : NaN;
  if (access.reason === 'TRIAL_ENDED' || (access.state === 'trial' && Number.isFinite(trialEnd) && trialEnd <= now)) {
    return { title: 'Tu prueba ha finalizado', message: 'Selecciona un plan para seguir usando Bookify.', tone: 'warning', needsPlan: true };
  }
  if (access.state === 'trial') {
    if (!Number.isFinite(trialEnd)) return { title: 'Prueba gratuita', message: 'No hay una fecha de finalización disponible.', tone: 'info', needsPlan: false };
    const days = Math.ceil((trialEnd - now) / 86_400_000);
    return {
      title: days === 1 ? 'Te queda 1 día de prueba' : `Te quedan ${days} días de prueba`,
      message: `Tu prueba termina el ${new Intl.DateTimeFormat('es', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(trialEnd))}.`,
      tone: days <= 3 ? 'warning' : 'info', needsPlan: false,
    };
  }
  if (access.state === 'enabled' && Number.isFinite(accessEnd)) {
    return accessEnd <= now
      ? { title: 'Tu suscripción ha finalizado', message: 'Selecciona un plan para continuar.', tone: 'warning', needsPlan: true }
      : { title: 'Suscripción cancelada', message: `Conservas el acceso hasta el ${new Intl.DateTimeFormat('es', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(accessEnd))}.`, tone: 'info', needsPlan: false };
  }
  if (access.state === 'policy_pending') {
    return { title: access.reason === 'PAUSED' ? 'Suscripción pausada' : 'Pago pendiente', message: 'Revisa el estado de tu suscripción en Facturación.', tone: 'warning', needsPlan: false };
  }
  if (access.state === 'restricted') {
    if (access.reason === 'SUBSCRIPTION_REQUIRED') return { title: 'No tienes una suscripción', message: 'Explora los planes disponibles para tu negocio.', tone: 'warning', needsPlan: true };
    if (access.reason === 'SUBSCRIPTION_SUSPENDED') return { title: 'Suscripción suspendida', message: 'Revisa el estado de tu suscripción en Facturación.', tone: 'warning', needsPlan: false };
    return { title: 'Tu suscripción ha finalizado', message: 'Selecciona un plan para continuar.', tone: 'warning', needsPlan: true };
  }
  return null;
}
