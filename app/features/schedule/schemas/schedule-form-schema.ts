import { z } from 'zod';

export const intervalSchema = z
  .object({
    opens: z.string(),
    closes: z.string(),
  })
  .refine(({ opens, closes }) => opens < closes, {
    message: 'La hora de apertura debe ser anterior al cierre',
    path: ['closes'],
  });

export const dayScheduleSchema = z.object({
  isActive: z.boolean(),
  intervals: z.array(intervalSchema),
});

export const weeklyScheduleSchema = z.object({
  monday: dayScheduleSchema,
  tuesday: dayScheduleSchema,
  wednesday: dayScheduleSchema,
  thursday: dayScheduleSchema,
  friday: dayScheduleSchema,
  saturday: dayScheduleSchema,
  sunday: dayScheduleSchema,
});

export type WeeklyScheduleForm = z.infer<typeof weeklyScheduleSchema>;
