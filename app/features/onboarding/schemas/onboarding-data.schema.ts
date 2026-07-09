import z from 'zod';

export const onboardingTenantSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  type: z.string(),
  onboardingCompleted: z.boolean().optional(),
  phone: z.string().nullable(),
  addressLine1: z.string().nullable(),
  addressLine2: z.string().nullable(),
  city: z.string().nullable(),
  province: z.string().nullable(),
  country: z.string().nullable(),
});

export const onboardingSubscriptionSchema = z
  .object({
    active: z.boolean().optional(),
    trial: z.boolean().optional(),
    plan: z.string().optional(),
  })
  .passthrough();

export const onboardingScheduleSchema = z.array(
  z.object({
    dayOfWeek: z.number(),
    opensAt: z.number(),
    closesAt: z.number(),
    isActive: z.boolean(),
  }),
);

export const onboardingServiceSchema = z.array(
  z.object({
    id: z.string().optional(),
    name: z.string(),
    image: z.string().nullable(),
    description: z.string().nullable(),
    durationMinutes: z.number(),
    price: z.number(),
    discountPercentage: z.number(),
    discountFixed: z.number(),
  }),
);

export const onboardingDataSchema = z.object({
  tenant: onboardingTenantSchema.nullable().optional(),
  subscription: onboardingSubscriptionSchema.nullable().optional(),
  schedules: z.array(onboardingScheduleSchema).nullable().optional(),
  invitations: z.any().optional(),
  services: z.array(onboardingServiceSchema).nullable().optional(),
});

export type OnboardingData = z.infer<typeof onboardingDataSchema>;

export type OnboardingDataResponse = {
  data: OnboardingData;
  currentStep: number;
  steps: Steps;
};

type Steps = {
  id: string;
  label: string;
}[];
