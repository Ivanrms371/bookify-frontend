import z from 'zod';

export const servicesStepItemSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  durationMinutes: z.number().int().positive(),
  imageUrl: z.string().optional(),
  imagePublicId: z.string().optional(),
});

export const servicesStepSchema = z.object({
  services: z.array(servicesStepItemSchema).min(1, 'Debe incluir al menos un servicio'),
});

export type ServicesStepPayload = z.infer<typeof servicesStepSchema>;
