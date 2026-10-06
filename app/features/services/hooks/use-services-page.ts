import { useEffect, useReducer } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useServices } from './use-services';
import {
  defaultServiceFilters,
  initialServicesState,
  lastServicesPage,
  servicesPageParams,
  servicesPageReducer,
  type ServiceFilters,
} from '../utils/services-page-model';

export function useServicesPage() {
  const [state, dispatch] = useReducer(servicesPageReducer, initialServicesState);
  const trimmed = state.search.trim();
  const searchQuery = trimmed.length > 3 ? trimmed : '';
  const debounced = useDebounce(searchQuery, 300);
  // Reconcile before requesting, so a new search never fetches the previous page.
  const effectiveQuery = searchQuery === '' ? '' : debounced === searchQuery ? debounced : state.query;
  const current = state.query === effectiveQuery ? state : servicesPageReducer(state, { type: 'query', value: effectiveQuery });
  if (current !== state) dispatch({ type: 'query', value: effectiveQuery });
  const query = useServices(servicesPageParams(current));
  const total = query.data?.meta.total ?? 0;
  const lastPage = lastServicesPage(total);
  const recoveringPage = !!query.data && !query.isPlaceholderData && current.page > lastPage;
  useEffect(() => {
    if (recoveringPage) dispatch({ type: 'page', page: lastPage });
  }, [recoveringPage, lastPage]);
  const filtersActive = (Object.keys(defaultServiceFilters) as (keyof ServiceFilters)[]).some(
    (key) => current[key] !== defaultServiceFilters[key],
  );
  return {
    ...current,
    query,
    total,
    services: query.data?.data ?? [],
    filtersActive,
    active: current.search !== '' || filtersActive,
    loading: query.isLoading || !query.isEnabled || effectiveQuery !== searchQuery || recoveringPage,
    applyFilters: (filters: ServiceFilters) => dispatch({ type: 'filters', filters }),
    setSearch: (value: string) => dispatch({ type: 'search', value }),
    setPage: (page: number) => dispatch({ type: 'page', page }),
    clear: () => dispatch({ type: 'clear' }),
  };
}
