import { useQuery } from '@tanstack/react-query';
import { professionalApi } from '../api/professional-api';
import type { ProfessionalWithDetails } from '../types/professional.types';

export const useProfessionalDetails = (id: string) => {
  return useQuery<ProfessionalWithDetails, Error>({
    queryKey: ['professional', id, 'details'],
    queryFn: () => professionalApi.getByIdWithDetails(id),
    enabled: !!id,
  });
};
