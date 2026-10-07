import { z } from 'zod';
export const locationSchema = z.object({
  country: z.string().refine((value) => ['UY', 'AR', 'PE', 'CL', 'PY'].includes(value), 'Selecciona un país'),
  province: z.string().trim().min(1, 'Selecciona una provincia, departamento o región').max(100),
  city: z.string().trim().min(1, 'Ingresa una ciudad o localidad').max(100),
  addressLine1: z.string().trim().min(1, 'Ingresa la dirección').max(200),
  addressLine2: z.string().trim().max(200).optional(),
  phoneNumber: z
    .string()
    .trim()
    .refine((value) => !value || /^(?=(?:\D*\d){7,15}\D*$)\+?[\d ()-]+$/.test(value), 'Ingresa un teléfono válido')
    .optional(),
  currency: z.string(),
  timeZone: z.string(),
});
