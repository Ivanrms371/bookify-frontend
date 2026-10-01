import type { ActiveTenant } from '@/features/auth/types/auth.types';
import type { Appointment } from '../types/appointments-types';

export function canReschedule(appointment: Appointment, tenant: ActiveTenant | null | undefined) {
  if (!tenant || appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED') return false;
  return (
    tenant.role === 'OWNER' || tenant.role === 'ADMIN' || (tenant.role === 'STAFF' && tenant.professionalId === appointment.professionalId)
  );
}
