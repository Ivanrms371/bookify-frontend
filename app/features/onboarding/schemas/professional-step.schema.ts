import { z } from 'zod';
export const professionalStepSchema = z.discriminatedUnion('attendsClients', [
  z.object({ attendsClients: z.literal(false) }),
  z.object({
    attendsClients: z.literal(true),
    name: z.string().trim().min(1, 'Ingresá tu nombre'),
    email: z.email('Ingresá un correo válido'),
    phoneCountryCode: z.string().regex(/^\+?\d{1,4}$/, 'Ingresá el código de país'),
    phoneNumber: z.string().regex(/^[\d ()-]{4,20}$/, 'Ingresá un teléfono válido'),
    profession: z.string().optional(),
    serviceIds: z.array(z.string().uuid()).min(1, 'Seleccioná al menos un servicio'),
  }),
]);
export type ProfessionalStepPayload = z.infer<typeof professionalStepSchema>;
