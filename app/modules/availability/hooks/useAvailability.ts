import { useQuery, type UseQueryOptions } from "@tanstack/react-query"
import { availabilityApi } from "../api/availability.api"

export const useAvailabilityConfig = (
  staffId: string,
  options?: Omit<UseQueryOptions<any>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: ["availability-config", staffId],
    queryFn: () => availabilityApi.getBaseConfig(staffId),
    enabled: !!staffId && (options?.enabled ?? true),
    ...options,
  })
}

export const useAvailabilitySlots = (
  staffId: string,
  date: string | null,
  options?: Omit<UseQueryOptions<any>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: ["availability-slots", staffId, date],
    queryFn: () => availabilityApi.getSlots(staffId, date),
    enabled: !!staffId && (options?.enabled ?? true),
    ...options,
  })
}
