import z from 'zod';

export const createServiceSchema = z.object({
  name: z.string().min(1, 'El nombre del servicio es requerido'),
  image: z.file().nullable(),
  description: z.string().nullable(),
  durationMinutes: z.number({ error: 'Seleccioná una duración' }).positive('Seleccioná una duración válida'),
  price: z.number({ error: 'El precio es requerido' }).positive('El precio debe ser mayor a 0'),
  discountPercentage: z.number(),
  discountFixed: z.number(),
});

export type CreateServicePayload = z.infer<typeof createServiceSchema>;
