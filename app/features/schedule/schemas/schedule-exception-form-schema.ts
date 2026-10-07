import { z } from 'zod';
import { intervalSchema } from './schedule-form-schema';
const dateSchema = z.iso.date('Selecciona una fecha válida');
export const scheduleExceptionIntervalsSchema = z
  .array(z.object({ opensAt: z.string(), closesAt: z.string() }))
  .superRefine((intervals, ctx) => {
    if (!intervals.length) ctx.addIssue({ code: 'custom', message: 'Debes agregar al menos un horario de atención', path: [] });
    intervals.forEach((interval, index) => {
      const parsed = intervalSchema.safeParse(interval);
      if (!parsed.success)
        for (const issue of parsed.error.issues) ctx.addIssue({ code: 'custom', message: issue.message, path: [index, ...issue.path] });
    });
    const sorted = [...intervals].sort((a, b) => a.opensAt.localeCompare(b.opensAt));
    if (sorted.some((interval, index) => index > 0 && interval.opensAt < sorted[index - 1].closesAt)) {
      ctx.addIssue({ code: 'custom', message: 'Los horarios no pueden superponerse', path: [] });
    }
  });
export const scheduleExceptionFormSchema = z
  .object({
    startDate: dateSchema,
    endDate: dateSchema,
    isClosed: z.boolean(),
    intervals: z.array(z.object({ opensAt: z.string(), closesAt: z.string() })),
    professionalIds: z.array(z.string()).min(1, 'Selecciona al menos un profesional'),
    reason: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startDate > data.endDate)
      ctx.addIssue({ code: 'custom', message: 'La fecha de fin debe ser igual o posterior a la de inicio', path: ['endDate'] });
    if (data.isClosed) return;
    const parsed = scheduleExceptionIntervalsSchema.safeParse(data.intervals);
    if (!parsed.success)
      for (const issue of parsed.error.issues) ctx.addIssue({ code: 'custom', message: issue.message, path: ['intervals', ...issue.path] });
  });
export type ScheduleExceptionFormData = z.infer<typeof scheduleExceptionFormSchema>;
