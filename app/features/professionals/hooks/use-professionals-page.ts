import { useEffect, useReducer } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useProfessionalsListing } from './use-professionals-listing';
import {
  professionalsPageParams,
  professionalsPageReducer,
  defaultProfessionalFilters,
  initialProfessionalsState,
  lastProfessionalsPage,
  type ProfessionalFilters,
} from '../utils/professionals-page-model';

export function useProfessionalsPage() {
  const [state, dispatch] = useReducer(professionalsPageReducer, initialProfessionalsState);
  const trimmed = state.search.trim();
  const searchQuery = trimmed.length > 3 ? trimmed : '';
  const debounced = useDebounce(searchQuery, 300);
  // Reconcile before requesting so committed searches always start on page zero.
  const effectiveQuery = searchQuery === '' ? '' : debounced === searchQuery ? debounced : state.query;
  const current = state.query === effectiveQuery ? state : professionalsPageReducer(state, { type: 'query', value: effectiveQuery });
  if (current !== state) dispatch({ type: 'query', value: effectiveQuery });
  const query = useProfessionalsListing(professionalsPageParams(current));
  const total = query.data?.meta.total ?? 0;
  const lastPage = lastProfessionalsPage(total);
  const recoveringPage = !!query.data && !query.isPlaceholderData && current.page > lastPage;
  useEffect(() => {
    if (recoveringPage) dispatch({ type: 'page', page: lastPage });
  }, [recoveringPage, lastPage]);
  const filtersActive = (Object.keys(defaultProfessionalFilters) as (keyof ProfessionalFilters)[]).some(
    (key) => current[key] !== defaultProfessionalFilters[key],
  );
  return {
    ...current,
    query,
    total,
    professionals: query.data?.data ?? [],
    filtersActive,
    active: current.search !== '' || filtersActive,
    loading: query.isLoading || !query.isEnabled || effectiveQuery !== searchQuery || recoveringPage,
    applyFilters: (filters: ProfessionalFilters) => dispatch({ type: 'filters', filters }),
    setSearch: (value: string) => dispatch({ type: 'search', value }),
    setPage: (page: number) => dispatch({ type: 'page', page }),
    clear: () => dispatch({ type: 'clear' }),
  };
}
