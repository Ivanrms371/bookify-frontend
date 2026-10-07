import { canManageAppointment } from '@/core/auth/permissions';
import type { ActiveTenant } from '@/features/auth/types/auth.types';
import type { Appointment } from '../types/appointments-types';

export function canCancel(appointment: Appointment, tenant: ActiveTenant | null | undefined) {
  if (!tenant || appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED') return false;
  return canManageAppointment(tenant, 'cancel', appointment.professionalId);
}
