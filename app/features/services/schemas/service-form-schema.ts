import z from 'zod';

export const serviceFormSchema = z
  .object({
    name: z.string().min(1, 'El nombre del servicio es requerido'),
    image: z.any().nullable().optional(),
    description: z.string().nullable().optional(),

    durationMinutes: z
      .number({ error: 'La duración del servicio es requerida' })
      .int('La duración debe ser un número entero')
      .positive('La duración debe ser mayor a 0'),

    price: z.number({ error: 'El precio es requerido' }).min(0, 'El precio no puede ser negativo'),

    discountPercentage: z
      .number({ error: 'Debe ser un número' })
      .min(0, 'El porcentaje no puede ser menor a 0')
      .max(100, 'El porcentaje no puede ser mayor a 100')
      .nullable()
      .optional(),

    discountFixed: z.number({ error: 'Debe ser un número' }).min(0, 'El descuento no puede ser negativo').nullable().optional(),

    professionalIds: z.array(z.string()),
  })
  .refine(
    (data) => {
      const hasPercentage = data.discountPercentage !== null && data.discountPercentage !== undefined && data.discountPercentage > 0;
      const hasFixed = data.discountFixed !== null && data.discountFixed !== undefined && data.discountFixed > 0;
      return !(hasPercentage && hasFixed);
    },
    {
      message: 'No puedes aplicar descuento porcentual y fijo simultáneamente',
      path: ['discountPercentage'], // El mensaje de error se asociará a este campo
    },
  );

export type ServiceFormData = z.infer<typeof serviceFormSchema>;
