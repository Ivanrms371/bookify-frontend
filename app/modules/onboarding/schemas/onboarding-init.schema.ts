import { z } from "zod";

export const onboardingInitSchema = z.object({
  name: z.string().nonempty("El nombre de la barbería es requerido"),
  slug: z
    .string()
    .nonempty("La URL de la barbería es requerida")
    .regex(
      /^[a-z0-9-]+$/,
      "La URL solo puede contener letras minúsculas, números y guiones",
    ),
});

export type OnboardingInitInput = z.infer<typeof onboardingInitSchema>;
