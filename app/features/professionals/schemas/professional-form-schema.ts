import { weeklyScheduleSchema } from '@/features/schedule/schemas/schedule-form-schema';
import { z } from 'zod';
import { ROLES } from '@/shared/types';

const intervalSchema = z
  .object({
    opensAt: z.string(),
    closesAt: z.string(),
  })
  .refine(({ opensAt, closesAt }) => opensAt < closesAt, {
    message: 'La hora de apertura debe ser anterior al cierre',
    path: ['closesAt'],
  });

export const professionalScheduleSchema = z.object({
  workingHours: z.array(
    z.object({
      dayOfWeek: z.string(),
      intervals: z.array(intervalSchema),
    })
  ),
});

export const professionalFormSchema = z.object({
  displayName: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('El email es requerido').optional(),
  phone: z.string().optional(),
  bio: z.string().nullish(),
  avatarUrl: z.string().optional(),
  role: z.enum(ROLES).optional(),

  commissionType: z.enum(['PERCENTAGE', 'FIXED']),
  commissionAmount: z.number(),

  serviceIds: z.array(z.string()).optional(),

  schedule: professionalScheduleSchema,

  slotIntervalMinutes: z.number().optional(),
  maxAdvancedDays: z.number().optional(),
  minAdvancedMinutes: z.number().optional(),
});

export type ProfessionalFormValues = z.infer<typeof professionalFormSchema>;
