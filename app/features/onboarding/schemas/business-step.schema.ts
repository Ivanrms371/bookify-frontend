import z from 'zod';
import { TENANT_TYPE_VALUES } from '@/shared/constants/tenant-type';

export const businessStepSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  type: z.enum(TENANT_TYPE_VALUES, {
    message: 'Selecciona un tipo de negocio valido',
  }),
});

export type BusinessStepPayload = z.infer<typeof businessStepSchema>;
