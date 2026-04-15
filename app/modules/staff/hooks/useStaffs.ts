import { useQuery, type UseQueryOptions } from "@tanstack/react-query"
import { staffApi } from "../api/staff.api"
import { useTenant } from "@/shared/context/tenant.context"
import type { Staff } from "../types/staff.type"
import type { StaffQueryParams } from "../types/staff-params.type"

type UseStaffsOptions = Omit<UseQueryOptions<Staff[]>, "queryKey" | "queryFn">

export function useStaffs(
  params?: StaffQueryParams,
  options?: UseStaffsOptions,
) {
  const { tenantId } = useTenant()
  return useQuery({
    queryKey: ["staffs", tenantId, JSON.stringify(params)],
    queryFn: () => staffApi.getStaffs(tenantId, params),
    enabled: !!tenantId && (options?.enabled ?? true),
    ...options,
  })
}
