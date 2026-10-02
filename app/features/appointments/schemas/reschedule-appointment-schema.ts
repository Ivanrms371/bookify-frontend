import { z } from 'zod';

export const rescheduleAppointmentSchema = z.object({
  startsAt: z.iso.datetime({ offset: true }),
  rescheduleReason: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
});

export type RescheduleAppointmentInput = z.infer<typeof rescheduleAppointmentSchema>;
