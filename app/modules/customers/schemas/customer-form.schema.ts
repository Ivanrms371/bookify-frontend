import { z } from "zod"

export const customerFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  countryCode: z.string().min(1, "Selecciona un código de país"),
  phone: z
    .string()
    .min(6, "El teléfono debe tener al menos 6 números")
    .regex(/^[0-9]+$/, "Solo se permiten números"),
})

export type CustomerFormValues = z.infer<typeof customerFormSchema>
