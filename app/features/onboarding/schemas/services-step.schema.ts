import z from 'zod';

export const servicesStepItemSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  durationMinutes: z.number().positive(),
});

export const servicesStepSchema = z.object({
  services: z.array(servicesStepItemSchema).min(1, 'Debe incluir al menos un servicio'),
});

export type ServicesStepPayload = z.infer<typeof servicesStepSchema>;
