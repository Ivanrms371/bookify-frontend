import z from "zod";

export const loginInputSchema = z.object({
  email: z.email("El email es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
