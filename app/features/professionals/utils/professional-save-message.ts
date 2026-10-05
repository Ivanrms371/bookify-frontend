import type { CreateProfessionalValues } from '../schemas/create-professional-schema';
import type { ProfessionalWithDetails } from '../types/professional.types';

export function professionalSaveMessage(values: CreateProfessionalValues, details?: ProfessionalWithDetails) {
  if (!details) return values.giveAccess ? 'Profesional creado e invitación registrada.' : 'Profesional creado';
  const access = details.access;
  if (!access.canChange) return 'Profesional actualizado.';
  if (values.giveAccess) {
    if (access.status === 'NONE' || access.status === 'EXPIRED' || (access.status === 'PENDING' && values.email !== access.invitationEmail))
      return 'Profesional actualizado e invitación registrada.';
    if (access.status === 'DISABLED') return 'Profesional actualizado y acceso restaurado.';
  } else {
    if (access.status === 'ACTIVE') return 'Profesional actualizado y acceso desactivado.';
    if (access.status === 'PENDING') return 'Profesional actualizado e invitación cancelada.';
  }
  return 'Profesional actualizado.';
}
