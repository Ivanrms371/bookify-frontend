import type { Notification } from '../types/notification.types';

export function notificationActionUrl(notification: Notification, tenantSlug?: string): string | undefined {
  const action = notification.action;
  if (action?.version !== 1 || !tenantSlug) return notification.actionUrl;
  if (action.kind === 'TEAM') return `/${encodeURIComponent(tenantSlug)}/settings?notificationTab=team`;
  if (action.kind === 'BUSINESS') return `/${encodeURIComponent(tenantSlug)}`;
  if (action.kind === 'BILLING') return `/${encodeURIComponent(tenantSlug)}/billing${action.destination === 'PLANS' ? '/plans' : ''}`;
  const calendar = `/${encodeURIComponent(tenantSlug)}/calendar`;
  if (action.kind === 'APPOINTMENT') return `${calendar}?notificationAppointmentId=${encodeURIComponent(action.appointmentId)}`;
  if (action.kind === 'CALENDAR') {
    const params = new URLSearchParams();
    if (action.date) params.set('notificationDate', action.date);
    if (action.professionalId) params.set('notificationProfessionalId', action.professionalId);
    return params.size ? `${calendar}?${params}` : calendar;
  }
  return notification.actionUrl;
}
