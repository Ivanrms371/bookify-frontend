import { useDebounce } from '@/shared/hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { customerApi } from '../api/customer-api';

export function useCustomerSearch(query: string) {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery({
    queryKey: ['customers', 'search', debouncedQuery],
    queryFn: () => customerApi.search(debouncedQuery),
    enabled: debouncedQuery.length > 1,
  });
}
