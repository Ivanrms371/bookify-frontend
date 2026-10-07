import type { ActiveTenant } from '@/features/auth/types/auth.types';
import type { OverlayKey, OverlayPropsMap } from '@/shared/components/overlays/overlay-registry';
import { can, canManageAppointment, type Permission } from './permissions';

const requiredPermissions: Partial<Record<OverlayKey, Permission>> = {
  'create-professional-modal': 'professional:create',
  'update-professional-drawer': 'professional:update',
  'delete-professional-modal': 'professional:delete',
  'update-professional-status-modal': 'professional:update',
  'create-service-modal': 'service:create',
  'update-service-modal': 'service:update',
  'toggle-service-status-modal': 'service:update',
  'delete-service-modal': 'service:delete',
  'create-customer-modal': 'customer:create',
  'update-customer-modal': 'customer:update',
  'delete-customer-modal': 'customer:delete',
  'view-customer-modal': 'customer:read',
  'block-customer-modal': 'customer:block',
  'unblock-customer-modal': 'customer:block',
  'view-appointment-drawer': 'appointment:read',
  'create-appointment-drawer': 'appointment:create',
  'reschedule-appointment-drawer': 'appointment:reschedule',
  'cancel-appointment-modal': 'appointment:cancel',
  'create-invitation-drawer': 'team:invite',
  'update-invitation-drawer': 'team:update',
  'cancel-invitation-modal': 'team:delete',
  'team-action-modal': 'team:read',
  'add-exception-modal': 'schedule_exception:update',
  'update-exception-modal': 'schedule_exception:update',
  'delete-exception-modal': 'schedule_exception:update',
};

export function canOpenOverlay<K extends OverlayKey>(tenant: ActiveTenant | null | undefined, key: K, props?: OverlayPropsMap[K]) {
  const required = requiredPermissions[key];
  if (required && !can(tenant, required)) return false;
  if (key === 'view-customer-modal') {
    const view = props as OverlayPropsMap['view-customer-modal'] | undefined;
    return Boolean(view && view.tenantId === tenant?.id);
  }
  if (key === 'view-appointment-drawer') {
    const view = props as OverlayPropsMap['view-appointment-drawer'] | undefined;
    return Boolean(view && view.tenantId === tenant?.id && canManageAppointment(tenant, 'read', view.appointment.professionalId));
  }
  if (key === 'cancel-appointment-modal' || key === 'reschedule-appointment-drawer') {
    const appointment = (props as OverlayPropsMap['cancel-appointment-modal'] | undefined)?.appointment;
    return Boolean(appointment && canManageAppointment(tenant,
      key === 'cancel-appointment-modal' ? 'cancel' : 'reschedule', appointment.professionalId));
  }
  return true;
}
