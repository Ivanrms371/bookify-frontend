import { z} from "zod"

export const serviceFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  price: z.string().min(1, "El precio es requerido"),
  initialActiveMinutes: z.coerce
    .number()
    .min(1, "Debe durar al menos 1 minuto"),
    image: z.file().optional(),
  passiveTimeMinutes: z.coerce.number().optional(),
  finalActiveMinutes: z.coerce.number().optional(),
  isActive: z.boolean().default(true),
  staffIds: z.array(z.string()).optional(),
});

export type ServiceFormInput = z.infer<typeof serviceFormSchema>;
  