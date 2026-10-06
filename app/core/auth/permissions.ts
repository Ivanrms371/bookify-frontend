import type { ActiveTenant } from '@/features/auth/types/auth.types';

export type Permission =
  | `appointment:${'create' | 'create_others' | 'read' | 'read_others' | 'update' | 'update_others' | 'delete' | 'delete_others' | 'cancel' | 'cancel_others' | 'reschedule' | 'reschedule_others'}`
  | `professional:${'read' | 'create' | 'update' | 'update_self' | 'delete'}`
  | `service:${'read' | 'create' | 'update' | 'delete'}`
  | `customer:${'read' | 'create' | 'update' | 'delete' | 'block'}`
  | `team:${'read' | 'invite' | 'update' | 'delete'}`
  | `schedule:${'read' | 'update' | 'update_self'}`
  | 'schedule_exception:update'
  | `tenant:${'read' | 'update' | 'delete'}`
  | 'report:read' | 'billing:read' | 'billing:manage';

// Permissions come from the backend session; missing/old sessions deny access.
export function can(tenant: ActiveTenant | null | undefined, permission: Permission): boolean {
  return tenant?.permissions?.includes(permission) === true;
}

export function canManageAppointment(
  tenant: ActiveTenant | null | undefined,
  action: 'create' | 'read' | 'update' | 'delete' | 'cancel' | 'reschedule',
  professionalId: string | null | undefined,
): boolean {
  return can(tenant, `appointment:${action}`) && (
    can(tenant, `appointment:${action}_others`) ||
    Boolean(tenant?.professionalId && professionalId && tenant.professionalId === professionalId)
  );
}

export function canAccessArea(tenant: ActiveTenant | null | undefined, area: string): boolean {
  switch (area) {
    case '': case 'reports': return can(tenant, 'report:read');
    case 'calendar': return can(tenant, 'appointment:read');
    case 'services': return can(tenant, 'service:read');
    case 'customers': return can(tenant, 'customer:read');
    case 'professionals': return can(tenant, 'professional:read');
    case 'settings': return can(tenant, 'tenant:read');
    case 'billing': return can(tenant, 'billing:read');
    case 'profile': return Boolean(tenant);
    default: return false;
  }
}
