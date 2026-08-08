import { useQuery } from '@tanstack/react-query';
import { professionalApi } from '../api/professional-api';

export const useProfessionals = () => {
  return useQuery({
    queryKey: ['professionals'],
    queryFn: () => professionalApi.getAll(),
  });
};
