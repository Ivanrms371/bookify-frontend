import z from "zod";

export const loginSchema = z.object({
    email: z.email("El email es requerido"),
    password: z.string().min(1, "La contraseña es requerida"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
