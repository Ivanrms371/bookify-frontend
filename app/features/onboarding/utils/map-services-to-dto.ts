import type { CreateServicePayload } from '@/features/services';
import type { ServicesStepPayload } from '../schemas/services-step.schema';

export function mapServicesToDto(services: CreateServicePayload[]): ServicesStepPayload {
  return {
    services: services.map(({ name, price, durationMinutes }) => ({
      name: name.trim(),
      price,
      durationMinutes,
    })),
  };
}
