import type { ServiceFormData } from '../schemas/service-form-schema';

/** True when the user has not started filling the service form. */
export function isServiceDraftEmpty(values: ServiceFormData): boolean {
  const hasName = values.name.trim().length > 0;
  const hasImage = values.image instanceof File;
  const hasPrice = typeof values.price === 'number' && !Number.isNaN(values.price);
  const hasDescription = Boolean(values.description?.trim());

  return !hasName && !hasImage && !hasPrice && !hasDescription;
}
