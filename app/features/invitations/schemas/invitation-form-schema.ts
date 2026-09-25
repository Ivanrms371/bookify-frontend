import { z } from 'zod';
import { ROLES } from '@/shared/types';

export const inviteProfessionalSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('El email es requerido'),
  phoneCountryCode: z.string().min(1, 'El código de país es requerido'),
  phoneNumber: z.string().min(1, 'El teléfono es requerido'),
  role: z.enum(ROLES),
  serviceIds: z.array(z.string()).optional(),
  commissionType: z.enum(['PERCENTAGE', 'FIXED']).optional(),
  commissionAmount: z.number().optional(),
});

export type InviteProfessionalFormData = z.infer<typeof inviteProfessionalSchema>;
