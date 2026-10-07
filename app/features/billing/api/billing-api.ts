import type { PlanChangeEligibility, PlanChangeResult, PlanChangeSelection } from '../types/plan-change.types';
import { httpClient } from '@/core/http/httpClient';
import type { BillingSummary, Plan, SubscriptionAccess, CheckoutSelection, CheckoutEligibility } from '../types/billing.types';

import type { PaymentHistory, PaymentPagination } from '../types/payment.types';

export const billingApi = {
  getChangeEligibility: (selection: PlanChangeSelection, signal?: AbortSignal, tenantId?: string) =>
    httpClient.get<PlanChangeEligibility>('/subscriptions/change-eligibility', { params: selection, signal, expectedTenantId: tenantId }),
  changePlan: (selection: PlanChangeSelection, tenantId?: string) =>
    httpClient.post<PlanChangeResult>('/subscriptions/plan-change', selection, { expectedTenantId: tenantId, skipAuthRetry: true }),
  cancelPlanChange: (tenantId?: string) =>
    httpClient.delete<PlanChangeResult>('/subscriptions/plan-change', { expectedTenantId: tenantId, skipAuthRetry: true }),
  refreshPlanChange: (tenantId?: string) =>
    httpClient.post<PlanChangeResult>('/subscriptions/plan-change/refresh', undefined, { expectedTenantId: tenantId, skipAuthRetry: true }),

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
