import type { OnboardingServiceForm } from '../types/service-form.types';
import type { ServicesStepPayload } from '../schemas/services-step.schema';

export function mapServicesToDto(services: OnboardingServiceForm[]): ServicesStepPayload {
  return {
    services: services.map(({ id, name, price, durationMinutes, imageUrl, imagePublicId }) => ({
      ...(id ? { id } : {}),
      name: name.trim(),
      price,
      durationMinutes,
      ...(imageUrl ? { imageUrl } : {}),
      ...(imagePublicId ? { imagePublicId } : {}),
    })),
  };
}
