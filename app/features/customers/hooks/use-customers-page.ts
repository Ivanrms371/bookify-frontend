import { useEffect, useReducer } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useCustomers } from './use-customers';
import {
  customersPageParams,
  customersPageReducer,
  defaultCustomerFilters,
  initialCustomersState,
  lastCustomersPage,
  type CustomerFilters,
} from '../utils/customers-page-model';

export function useCustomersPage() {
  const [state, dispatch] = useReducer(customersPageReducer, initialCustomersState);
  const trimmedSearch = state.search.trim();
  const searchQuery = trimmedSearch.length >= 3 ? trimmedSearch : '';
  const debounced = useDebounce(searchQuery, 300);
  // Reconcile before requesting so committed searches always start on page zero.
  const effectiveQuery = searchQuery === '' ? '' : debounced === searchQuery ? debounced : state.query;
  const current = state.query === effectiveQuery ? state : customersPageReducer(state, { type: 'query', value: effectiveQuery });
  if (current !== state) dispatch({ type: 'query', value: effectiveQuery });
  const query = useCustomers(customersPageParams(current));
  const total = query.data?.meta.total ?? 0;
  const lastPage = lastCustomersPage(total);
  const recoveringPage = !!query.data && !query.isPlaceholderData && current.page > lastPage;
  useEffect(() => {
    if (recoveringPage) dispatch({ type: 'page', page: lastPage });
  }, [recoveringPage, lastPage]);
  const filtersActive = (Object.keys(defaultCustomerFilters) as (keyof CustomerFilters)[]).some(
    (key) => current[key] !== defaultCustomerFilters[key],
  );
  return {
    ...current,
    query,
    total,
    customers: query.data?.data ?? [],
    filtersActive,
    active: current.search !== '' || filtersActive,
    loading: query.isLoading || !query.isEnabled || effectiveQuery !== searchQuery || recoveringPage,
    applyFilters: (filters: CustomerFilters) => dispatch({ type: 'filters', filters }),
    setSearch: (value: string) => dispatch({ type: 'search', value }),
    setPage: (page: number) => dispatch({ type: 'page', page }),
    clear: () => dispatch({ type: 'clear' }),
  };
}
