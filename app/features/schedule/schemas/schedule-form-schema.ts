import { z } from 'zod';
import { DAYS_OF_WEEK } from '@/shared/constants/week-days';

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Hora inválida');

export const intervalSchema = z
  .object({ opensAt: timeSchema, closesAt: timeSchema })
  .refine(({ opensAt, closesAt }) => opensAt < closesAt, { message: 'La apertura debe ser anterior al cierre', path: ['closes'] });
export const scheduleWorkingHourSchema = z.object({
  dayOfWeek: z.enum(DAYS_OF_WEEK),
  isActive: z.boolean(),
  intervals: z.array(intervalSchema),
});

export const workingHoursSchema = z.object({
  workingHours: z.array(scheduleWorkingHourSchema).superRefine((workingHours, ctx) => {
    workingHours.forEach((dayOfWeek, index) => {
      if (dayOfWeek.isActive && dayOfWeek.intervals.length === 0) {
        ctx.addIssue({ code: 'custom', message: 'Debe existir al menos un horario', path: [index, 'intervals'] });
      }
    });
  }),
});

export type ScheduleWorkingHour = z.infer<typeof scheduleWorkingHourSchema>;
export type SaveWorkingHours = z.infer<typeof workingHoursSchema>;
