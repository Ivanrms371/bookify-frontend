import { z } from 'zod';

export const createAppointmentSchema = z.object({
  serviceId: z.uuid(),
  professionalId: z.uuid(),
  startsAt: z.iso.datetime({ offset: true }),
  customerId: z.uuid().optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
