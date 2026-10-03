import { httpClient } from '@/core/http/httpClient';
import type { BillingSummary, Plan, SubscriptionAccess, CheckoutSelection, CheckoutEligibility } from '../types/billing.types';

export const billingApi = {
  getEligibility: (selection: CheckoutSelection) => httpClient.get<CheckoutEligibility>('/subscriptions/eligibility', { params: selection }),

  createCheckout: (selection: CheckoutSelection) => httpClient.post<{ url: string }>('/subscriptions/checkout', selection),

  getPlans: () => httpClient.get<Plan[]>('/subscriptions/plans'),

  getCurrentSubscription: () => httpClient.get<BillingSummary>('/subscriptions/current'),

  getAccess: () => httpClient.get<SubscriptionAccess>('/subscriptions/access'),
};
