import z from 'zod';
import { TENANT_TYPE_VALUES } from '@/shared/constants/tenant-type';
import { WORKSPACE_TYPE_VALUES } from '@/shared/constants/workspace-type';
import { DAYS_OF_WEEK } from '@/shared/constants/week-days';
import { intervalSchema, workingHoursSchema } from '@/features/schedule/schemas/schedule-form-schema';

export const onboardingStepStatusSchema = z.object({
  id: z.string(),
  label: z.string(),
  status: z.enum(['PENDING', 'CURRENT', 'COMPLETED']),
});

export const onboardingSavedDataSchema = z.object({
  workspaceType: z.enum(WORKSPACE_TYPE_VALUES).nullable(),
  name: z.string().nullable(),
  slug: z.string().nullable(),
  type: z.enum(TENANT_TYPE_VALUES).nullable(),
  logoUrl: z.string().nullable(),
  coverUrl: z.string().nullable(),
  colorTheme: z.string().nullable(),
  workingHours: workingHoursSchema,
  services: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.unknown(),
      durationMinutes: z.number(),
    }),
  ),
});

export const onboardingStatusSchema = z.object({
  onboardingStatus: z.string(),
  workspaceType: z.string(),
  steps: z.array(onboardingStepStatusSchema),
  savedData: onboardingSavedDataSchema,
});

export type OnboardingStatusResponse = z.infer<typeof onboardingStatusSchema>;

export type OnboardingSavedData = z.infer<typeof onboardingSavedDataSchema>;

export type OnboardingStepStatus = z.infer<typeof onboardingStepStatusSchema>;
