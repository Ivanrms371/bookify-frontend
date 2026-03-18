import z from "zod";

export const authResponseSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  businesses: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
      logoUrl: z.string().nullable(),
      businessRole: z.string(),
    }),
  ),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
