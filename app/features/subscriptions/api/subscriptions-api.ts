import { httpClient } from '@/core/http/httpClient';

export const subscriptionsApi = {
  createSubscription: async (data: any) => await httpClient.post('/subscriptions/start', data),
};
