import { z } from 'zod';
import { professionalFields } from './create-professional-schema';
export const updateProfessionalFormSchema = z.object(professionalFields);
export const updateProfessionalSchema = z
  .object(professionalFields)
  .partial()
  .extend({
    accessStatus: z.enum(['NONE', 'PENDING', 'EXPIRED', 'ACTIVE', 'DISABLED']).optional(),
  });
export type UpdateProfessionalValues = z.infer<typeof updateProfessionalSchema>;
