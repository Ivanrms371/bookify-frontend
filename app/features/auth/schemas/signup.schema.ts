import z from 'zod';

export const signupSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().min(1, 'El email es requerido').email('Email inválido'),
  phoneCountryCode: z.string().min(1, 'El código de país es requerido'),
  phoneNumber: z.string().min(1, 'El teléfono es requerido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
