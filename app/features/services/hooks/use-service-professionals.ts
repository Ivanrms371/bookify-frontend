import { useQuery } from '@tanstack/react-query';
import { servicesApi } from '../api/services-api';

export const useServiceProfessionals = (serviceId: string | null) => {
  return useQuery({
    queryKey: ['services', serviceId, 'professionals'],
    queryFn: () => servicesApi.getAllProfessionals(serviceId!),
    enabled: !!serviceId,
  });
};
