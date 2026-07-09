import z from 'zod';
import { TENANT_TYPE_VALUES } from '@/shared/constants/tenant-type';

export const createBusinessSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  slug: z.string().min(1, 'La URL es requerida'),
  tenantType: z.enum(TENANT_TYPE_VALUES, {
    message: 'Selecciona un tipo de negocio válido',
  }),
});

export type CreateBusinessPayload = z.infer<typeof createBusinessSchema>;

export const createBusinessResponseSchema = z.object({
  id: z.string(),
});

export type CreateBusinessResponse = z.infer<typeof createBusinessResponseSchema>;
