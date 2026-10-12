
export type NotificationType =
  | 'appointment.created'
  | 'appointment.cancelled'
  | 'appointment.rescheduled'
  | 'appointment.reminder'
  | 'tenant.created'
  | 'member.joined'
  | 'billing.trial.ends.7d'
  | 'billing.trial.ends.3d'
  | 'billing.renewal.3d'
  | 'payment.received'
  | 'professional.day-start'
  | 'professional.day-end';

export type NotificationAction = {
  version: 1;
  kind: 'APPOINTMENT';
  appointmentId: string;
} | { version: 1; kind: 'CALENDAR'; date?: string; professionalId?: string }
  | { version: 1; kind: 'BILLING'; destination: 'PLANS' | 'OVERVIEW' }
  | { version: 1; kind: 'BUSINESS' }
  | { version: 1; kind: 'TEAM' };

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  actionUrl?: string;
  actionLabel?: string | null;
  action?: NotificationAction | null;
  readAt: string | null;
  createdAt: string;
}
