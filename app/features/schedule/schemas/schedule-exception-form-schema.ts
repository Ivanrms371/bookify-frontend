import { z } from 'zod';

const intervalSchema = z
  .object({
    opensAt: z.string().min(1, 'Requerido'),
    closesAt: z.string().min(1, 'Requerido'),
  })
  .refine(({ opensAt, closesAt }) => opensAt < closesAt, {
    message: 'La hora de apertura debe ser anterior al cierre',
    path: ['closes'],
  });

export const scheduleExceptionFormSchema = z
  .object({
    startDate: z.string().min(1, 'La fecha de inicio es requerida'),
    endDate: z.string().min(1, 'La fecha de fin es requerida'),
    isClosed: z.boolean(),
    intervals: z.array(intervalSchema),
    professionalIds: z.array(z.string()).min(1, 'Selecciona al menos un profesional'),
    reason: z.string().optional(),
  })
  .refine(
    ({ isClosed, intervals }) => {
      if (!isClosed && intervals.length === 0) return false;
      return true;
    },
    {
      message: 'Debes agregar al menos un horario de atención',
      path: ['intervals'],
    },
  )
  .refine(({ startDate, endDate }) => startDate <= endDate, {
    message: 'La fecha de fin debe ser igual o posterior a la de inicio',
    path: ['endDate'],
  });

export type ScheduleExceptionFormData = z.infer<typeof scheduleExceptionFormSchema>;
