import type { PlanChangeEligibility, PlanChangeResult } from '../types/plan-change.types';
import { httpClient } from '@/core/http/httpClient';
import type { BillingSummary, Plan, SubscriptionAccess, CheckoutSelection, CheckoutEligibility } from '../types/billing.types';

import type { PaymentHistory, PaymentPagination } from '../types/payment.types';

export const billingApi = {
  getChangeEligibility: (selection: CheckoutSelection, signal?: AbortSignal) =>
    httpClient.get<PlanChangeEligibility>('/subscriptions/change-eligibility', { params: selection, signal }),
  changePlan: (selection: CheckoutSelection) => httpClient.post<PlanChangeResult>('/subscriptions/plan-change', selection),
  cancelPlanChange: () => httpClient.delete<PlanChangeResult>('/subscriptions/plan-change'),
  refreshPlanChange: () => httpClient.post<PlanChangeResult>('/subscriptions/plan-change/refresh'),

  getCustomerPortal: () => httpClient.get<{ url: string }>('/subscriptions/portal'),

  getPayments: (pagination: PaymentPagination, signal?: AbortSignal) =>
    httpClient.get<PaymentHistory>('/payments', { params: pagination, signal }),

  getInvoice: (paymentId: string) => httpClient.get<{ url: string }>(`/payments/${paymentId}/invoice`),

  getEligibility: (selection: CheckoutSelection) =>
    httpClient.get<CheckoutEligibility>('/subscriptions/eligibility', { params: selection }),

  createCheckout: (selection: CheckoutSelection) => httpClient.post<{ url: string }>('/subscriptions/checkout', selection),

  getPlans: () => httpClient.get<Plan[]>('/subscriptions/plans'),

  getCurrentSubscription: () => httpClient.get<BillingSummary>('/subscriptions/current'),

  getAccess: () => httpClient.get<SubscriptionAccess>('/subscriptions/access'),
};
