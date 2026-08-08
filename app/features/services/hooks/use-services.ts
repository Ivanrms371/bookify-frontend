import { useQuery } from '@tanstack/react-query';
import { servicesApi } from '../api/services-api';
import type { GetAllServicesParams } from '../types/services.types';

export const useServices = (params?: GetAllServicesParams) => {
  return useQuery({
    queryKey: ['services', params],
    queryFn: () => servicesApi.getAll(params),
  });
};
