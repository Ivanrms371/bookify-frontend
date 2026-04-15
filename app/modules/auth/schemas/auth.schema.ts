import z from "zod"

export const authResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  tenants: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
      logoUrl: z.string().nullable(),
      membership: z.string(),
      subscription: z.object({
        status: z.string(),
        plan: z.string(),
        trialEndsAt: z.string().nullable(),
        currentPeriodEnd: z.string().nullable(),
        cancelledAt: z.string().nullable(),
      }),
    }),
  ),
})

export type AuthResponse = z.infer<typeof authResponseSchema>
