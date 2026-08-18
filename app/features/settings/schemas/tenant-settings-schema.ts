import { z } from 'zod';

export const tenantGeneralSettingsSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  slug: z.string().min(1, 'La URL es requerida'),
  timeZone: z.string().min(1, 'La zona horaria es requerida'),
  phone: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  country: z.string().optional(),
  logoFile: z.any().optional(),
  coverFile: z.any().optional(),
});

export type TenantGeneralSettingsFormValues = z.infer<typeof tenantGeneralSettingsSchema>;

export const appointmentSettingsSchema = z.object({
  slotIntervalMinutes: z.coerce.number().min(1, 'Debe ser al menos 1'),
  maxAdvancedDays: z.coerce.number().min(1, 'Debe ser al menos 1'),
  minAdvancedMinutes: z.coerce.number().min(0, 'No puede ser negativo'),
  cancellationWindowMinutes: z.coerce.number().min(0, 'No puede ser negativo'),
  maxPendingApptsPerClient: z.coerce.number().min(1, 'Debe ser al menos 1'),
  requireConfirmation: z.boolean(),
  holidayClosureAutoApply: z.boolean(),
  allowPassiveTimeBooking: z.boolean(),
});

export type AppointmentSettingsFormValues = z.infer<typeof appointmentSettingsSchema>;
