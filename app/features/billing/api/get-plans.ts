import { useQuery } from '@tanstack/react-query';
import { httpClient } from '@/core/http/httpClient';
import type { Plan } from '../types/billing.types';

export const getPlansQueryKey = () => ['billing', 'plans'] as const;

export const getPlans = async (): Promise<Plan[]> => {
  const response = await httpClient.get<Plan[]>('/billing/plans');
  return response;
};

export const usePlans = () => {
  return useQuery({
    queryKey: getPlansQueryKey(),
    queryFn: getPlans,
    staleTime: 1000 * 60 * 60,
  });
};
