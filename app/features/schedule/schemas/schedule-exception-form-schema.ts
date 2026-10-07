import { z } from 'zod';
import { intervalSchema } from './schedule-form-schema';
const dateSchema = z.iso.date('Selecciona una fecha válida');
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
    if (!data.intervals.length)
      ctx.addIssue({ code: 'custom', message: 'Debes agregar al menos un horario de atención', path: ['intervals'] });
    data.intervals.forEach((interval, index) => {
      const parsed = intervalSchema.safeParse(interval);
      if (!parsed.success)
        for (const issue of parsed.error.issues)
          ctx.addIssue({ code: 'custom', message: issue.message, path: ['intervals', index, ...issue.path] });
    });
    const sorted = [...data.intervals].sort((a, b) => a.opensAt.localeCompare(b.opensAt));
    if (sorted.some((interval, index) => index > 0 && interval.opensAt < sorted[index - 1].closesAt)) {
      ctx.addIssue({ code: 'custom', message: 'Los horarios no pueden superponerse', path: ['intervals'] });
    }
  });
export type ScheduleExceptionFormData = z.infer<typeof scheduleExceptionFormSchema>;
