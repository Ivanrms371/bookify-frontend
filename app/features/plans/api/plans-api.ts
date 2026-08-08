import { httpClient } from '@/core/http/httpClient';
import type { Plan } from '../types/plans.type';

export const plansApi = {
  getPlans: () => httpClient.get<Plan[]>('/plans'),
};
