import { useQuery } from '@tanstack/react-query';
import { availabilityApi } from '../api/availability-api';
import type { GetAvailabilityProfessionalParams } from '../types/availability-types';

export const useAvailabilityProfessional = (professionalId: string | null, params: GetAvailabilityProfessionalParams) => {
  return useQuery({
    queryKey: ['availability', 'professional', professionalId, params],
    queryFn: () => availabilityApi.getAvailabilityProfessional(professionalId!, params),
    enabled: !!professionalId,
  });
};
