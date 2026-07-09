import { z } from 'zod';

export const customizeStepSchema = z.object({
  logoUrl: z.string().optional(),
  coverUrl: z.string().optional(),
  colorTheme: z.string().optional(),
});

export type CustomizeStepPayload = z.infer<typeof customizeStepSchema>;
