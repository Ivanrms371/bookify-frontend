import { canManageAppointment } from '@/core/auth/permissions';
import type { ActiveTenant } from '@/features/auth/types/auth.types';
import type { Appointment } from '../types/appointments-types';

export function canReschedule(appointment: Appointment, tenant: ActiveTenant | null | undefined) {
  if (!tenant || appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED') return false;
  return canManageAppointment(tenant, 'reschedule', appointment.professionalId);
}
