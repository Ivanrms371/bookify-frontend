import z from "zod";

export const signupInputSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.email("El email no es válido"),
  phone: z
    .string()
    .min(1, "El teléfono es requerido")
    .length(9, "El teléfono debe tener 9 caracteres"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const signupResponseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
});

export type SignupInput = z.infer<typeof signupInputSchema>;
export type SignupResponse = z.infer<typeof signupResponseSchema>;
