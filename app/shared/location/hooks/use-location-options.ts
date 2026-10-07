import { useQuery } from '@tanstack/react-query';
import { locationApi } from '../api/location-api';
export function useLocationOptions() {
  return useQuery({
    queryKey: ['location-options'],
    queryFn: ({ signal }) => locationApi.getOptions(signal),
    staleTime: 24 * 60 * 60 * 1000,
  });
}
