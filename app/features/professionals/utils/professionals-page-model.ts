import type { GetProfessionalsParams } from '../types/professional.types';

export const PROFESSIONALS_PAGE_SIZE = 24;
export type ProfessionalFilters = {
  status: 'all' | 'active' | 'inactive';
  serviceId: string;
  sort: 'name' | 'newest';
};
export const defaultProfessionalFilters: ProfessionalFilters = { status: 'all', serviceId: 'all', sort: 'name' };
export type ProfessionalsPageState = ProfessionalFilters & { search: string; query: string; page: number };
export const initialProfessionalsState: ProfessionalsPageState = { ...defaultProfessionalFilters, search: '', query: '', page: 0 };
type Action =
  | { type: 'filters'; filters: ProfessionalFilters }
  | { type: 'search'; value: string }
  | { type: 'query'; value: string }
  | { type: 'page'; page: number }
  | { type: 'clear' };

export function professionalsPageReducer(state: ProfessionalsPageState, action: Action): ProfessionalsPageState {
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
      return { ...initialProfessionalsState };
  }
}

export function professionalsPageParams(state: ProfessionalsPageState): GetProfessionalsParams {
  return {
    query: state.query || undefined,
    isActive: state.status === 'all' ? undefined : state.status === 'active',
    serviceId: state.serviceId === 'all' ? undefined : state.serviceId,
    orderBy: state.sort === 'name' ? 'name' : 'createdAt',
    sortOrder: state.sort === 'name' ? 'asc' : 'desc',
    skip: state.page * PROFESSIONALS_PAGE_SIZE,
    take: PROFESSIONALS_PAGE_SIZE,
  };
}

export function canKeepProfessionalResults(tenantId: string | undefined, params: GetProfessionalsParams, previousKey: readonly unknown[]) {
  if (!tenantId || previousKey[1] !== tenantId) return false;
  const previous = previousKey[2] as GetProfessionalsParams | undefined;
  if (!previous) return false;
  return (['query', 'isActive', 'serviceId', 'orderBy', 'sortOrder', 'take'] as const).every((key) => params[key] === previous[key]);
}

export function lastProfessionalsPage(total: number) {
  return Math.max(0, Math.ceil(total / PROFESSIONALS_PAGE_SIZE) - 1);
}
