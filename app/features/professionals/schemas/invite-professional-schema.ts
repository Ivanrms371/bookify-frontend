import { z } from 'zod';
import { ASSIGNABLE_ROLES } from '@/shared/types';

export const inviteProfessionalSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Ingresá un correo válido'),
  phone: z.string().optional(),
  role: z.enum(ASSIGNABLE_ROLES),
  serviceIds: z.array(z.string()).min(1, 'Seleccioná al menos un servicio'),
});

export type InviteProfessionalFormData = z.infer<typeof inviteProfessionalSchema>;
