import z from 'zod';

export const signupSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().min(1, 'El email es requerido'),
  phoneNumber: z.string().min(1, 'El teléfono es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
