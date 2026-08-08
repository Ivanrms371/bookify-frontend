import { normalizePhone } from '@/shared/utils';
import { z } from 'zod';

export const customerFormSchema = z.object({
  name: z.string().trim().min(2, {
    message: 'El nombre es requerido',
  }),

  email: z.email({
    message: 'El email es inválido',
  }),

  phoneCountryCode: z
    .string()
    .trim()
    .regex(/^\d{1,4}$/, {
      message: 'El prefijo es inválido',
    }),

  phone: z
    .string()
    .trim()
    .transform(normalizePhone)
    .refine((phone) => /^\d{8,14}$/.test(phone), {
      message: 'El teléfono es inválido',
    }),

  notes: z.string().optional(),
});

export type CustomerFormData = z.infer<typeof customerFormSchema>;
