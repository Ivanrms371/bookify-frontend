import { httpClient } from '@/core/http/httpClient';

export const subscriptionsService = {
  createSubscription: async (data: any) => await httpClient.post('/subscriptions/start', data),
};
