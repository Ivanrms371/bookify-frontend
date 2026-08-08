import { z } from 'zod';

export const createAppointmentSchema = z.object({
  customerId: z.string(),
  serviceId: z.string(),
  professionalId: z.string(),
  date: z.string(),
  time: z.string(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
