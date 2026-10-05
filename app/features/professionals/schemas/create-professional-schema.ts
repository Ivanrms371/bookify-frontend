import { z } from 'zod';

export const professionalFields = {
  avatarUrl: z.string().url('Seleccioná una imagen válida.').nullable().optional(),
  avatarPublicId: z.string().nullable().optional(),
  colorTheme: z.string().nullable().optional(),
  name: z.string().trim().min(1, 'Ingresá el nombre.'),
  email: z.string().trim().toLowerCase().email('Ingresá un correo válido.'),
  phoneCountryCode: z
    .string()
    .trim()
    .regex(/^[1-9]\d{0,3}$/, 'Seleccioná un código de país.'),
  phoneNumber: z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s()-]/g, ''))
    .pipe(z.string().regex(/^\d{4,15}$/, 'Ingresá un teléfono válido.')),
  serviceIds: z.array(z.string().uuid()),
  giveAccess: z.boolean(),
};

export const createProfessionalSchema = z.object(professionalFields);

export type CreateProfessionalValues = z.infer<typeof createProfessionalSchema>;
