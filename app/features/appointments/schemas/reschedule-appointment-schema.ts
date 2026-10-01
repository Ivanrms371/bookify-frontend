import { z } from 'zod';

export const rescheduleAppointmentSchema = z.object({
  startsAt: z.iso.datetime({ offset: true }).refine((value) => new Date(value).getTime() > Date.now(), 'Elegí un horario futuro'),
  rescheduleReason: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
});

export type RescheduleAppointmentInput = z.infer<typeof rescheduleAppointmentSchema>;
