import { z } from 'zod';

export const inviteProfessionalSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Ingresá un correo válido'),
  phone: z.string().optional(),
  role: z.enum(['PROFESSIONAL', 'ADMIN']),
  serviceIds: z.array(z.string()),
  commissionType: z.enum(['PERCENTAGE', 'FIXED']).optional(),
  commissionValue: z.number().min(0, 'La comisión debe ser mayor o igual a 0').optional(),
});

export type InviteProfessionalFormData = z.infer<typeof inviteProfessionalSchema>;

