import type { GetAllCustomersParams } from '../types/customer-types';

export const CUSTOMERS_PAGE_SIZE = 24;
export type CustomerSort = 'name' | 'newest' | 'last-visit' | 'spending';
export type CustomerStatus = NonNullable<GetAllCustomersParams['status']>;
export type BookingActivity = NonNullable<GetAllCustomersParams['bookingActivity']>;
export type CustomerFilters = { status: CustomerStatus; activity: BookingActivity; sort: CustomerSort };
export const defaultCustomerFilters: CustomerFilters = { status: 'all', activity: 'all', sort: 'name' };
export type CustomersPageState = CustomerFilters & { search: string; query: string; page: number };
export const initialCustomersState: CustomersPageState = { ...defaultCustomerFilters, search: '', query: '', page: 0 };
type Action =
  | { type: 'filters'; filters: CustomerFilters }
  | { type: 'search'; value: string }
  | { type: 'query'; value: string }
  | { type: 'page'; page: number }
  | { type: 'clear' };

export function customersPageReducer(state: CustomersPageState, action: Action): CustomersPageState {
  switch (action.type) {
    case 'filters':
      return { ...state, ...action.filters, page: 0 };
    case 'search':
      return { ...state, search: action.value };
    case 'query':
      return { ...state, query: action.value, page: 0 };
    case 'page':
      return { ...state, page: Math.max(0, action.page) };
    case 'clear':
      return { ...initialCustomersState };
  }
}

const sorts: Record<CustomerSort, Pick<GetAllCustomersParams, 'orderBy' | 'order'>> = {
  name: { orderBy: 'name', order: 'asc' },
  newest: { orderBy: 'createdAt', order: 'desc' },
  'last-visit': { orderBy: 'lastVisitAt', order: 'desc' },
  spending: { orderBy: 'totalSpent', order: 'desc' },
};

export function customersPageParams(state: CustomersPageState): GetAllCustomersParams {
  return {
    query: state.query || undefined,
    status: state.status,
    bookingActivity: state.activity,
    ...sorts[state.sort],
    skip: state.page * CUSTOMERS_PAGE_SIZE,
    take: CUSTOMERS_PAGE_SIZE,
  };
}

export function canKeepCustomerResults(
  tenantId: string | undefined,
  params: GetAllCustomersParams | undefined,
  previousKey: readonly unknown[],
) {
  if (!tenantId || previousKey[1] !== tenantId || !params) return false;
  const previous = previousKey[2] as GetAllCustomersParams | undefined;
  if (!previous) return false;
  return (['query', 'status', 'bookingActivity', 'orderBy', 'order', 'take'] as const).every(
    (key) => params[key] === previous[key],
  );
}

export function lastCustomersPage(total: number) {
  return Math.max(0, Math.ceil(total / CUSTOMERS_PAGE_SIZE) - 1);
}
