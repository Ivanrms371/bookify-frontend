import z from 'zod';

export const teamStepSchema = z.object({
  invitations: z.array(z.unknown()).default([]),
});

export type TeamStepPayload = z.infer<typeof teamStepSchema>;
