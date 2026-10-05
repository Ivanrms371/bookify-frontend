import { z } from 'zod';

export const customizeStepSchema = z.object({
  logoUrl: z.string().nullable().optional(),
  coverUrl: z.string().nullable().optional(),
  logoPublicId: z.string().nullable().optional(),
  coverPublicId: z.string().nullable().optional(),
  colorTheme: z.string().regex(/^#[0-9a-f]{6}$/i).nullable().optional(),
});

export type CustomizeStepPayload = z.infer<typeof customizeStepSchema>;
