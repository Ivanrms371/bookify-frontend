import type { GetAllServicesParams } from '../types/services.types';

export const SERVICES_PAGE_SIZE = 24;
export const defaultServiceFilters = { status: 'all', duration: 'all', discount: 'all', sort: 'name' };
export type ServiceFilters = typeof defaultServiceFilters;
export type ServicesPageState = ServiceFilters & { search: string; query: string; page: number };
export const initialServicesState: ServicesPageState = { ...defaultServiceFilters, search: '', query: '', page: 0 };
type Action =
  | { type: 'filters'; filters: ServiceFilters }
  | { type: 'search'; value: string }
  | { type: 'query'; value: string }
  | { type: 'page'; page: number }
  | { type: 'clear' };
export function servicesPageReducer(state: ServicesPageState, action: Action): ServicesPageState {
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
      return { ...initialServicesState };
  }
}
const sorts: Record<string, Pick<GetAllServicesParams, 'orderBy' | 'order'>> = {
  name: { orderBy: 'name', order: 'asc' },
  newest: { orderBy: 'createdAt', order: 'desc' },
  'price-asc': { orderBy: 'price', order: 'asc' },
  'price-desc': { orderBy: 'price', order: 'desc' },
  duration: { orderBy: 'durationMinutes', order: 'asc' },
};
export function servicesPageParams(state: ServicesPageState): GetAllServicesParams {
  return {
    query: state.query || undefined,
    isActive: state.status === 'all' ? undefined : state.status === 'active',
    duration: state.duration === 'all' ? undefined : (state.duration as GetAllServicesParams['duration']),
    discount: state.discount === 'all' ? undefined : (state.discount as GetAllServicesParams['discount']),
    ...sorts[state.sort],
    count: true,
    skip: state.page * SERVICES_PAGE_SIZE,
    take: SERVICES_PAGE_SIZE,
  };
}
export function canKeepServiceResults(
  tenantId: string | undefined,
  params: GetAllServicesParams | undefined,
  previousKey: readonly unknown[],
) {
  if (!tenantId || previousKey[1] !== tenantId || !params) return false;
  const previous = previousKey[2] as GetAllServicesParams | undefined;
  if (!previous) return false;
  return (['query', 'isActive', 'duration', 'discount', 'professionalId', 'orderBy', 'order', 'count', 'take'] as const).every(
    (key) => params[key] === previous[key],
  );
}
export function lastServicesPage(total: number) {
  return Math.max(0, Math.ceil(total / SERVICES_PAGE_SIZE) - 1);
}
