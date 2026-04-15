import { useQuery } from "@tanstack/react-query";
import { useTenant } from "@/shared/context/tenant.context";
import { serviceApi } from "../api/service.api";

export function useService(serviceId: string | undefined) {
  const { tenantId } = useTenant();
  return useQuery({
    queryKey: ["service", tenantId, serviceId],
    queryFn: () => serviceApi.getServiceById(tenantId!, serviceId!),
    enabled: !!tenantId && !!serviceId,
  });
}
