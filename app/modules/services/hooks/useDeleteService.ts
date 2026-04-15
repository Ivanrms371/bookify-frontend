import { useMutation, useQueryClient } from "@tanstack/react-query";
import { serviceApi } from "../api/service.api";
import { sileo } from "sileo";
import { useTenantStore } from "@/modules/tenant/store/tenant.store";

export function useDeleteService() {
  const queryClient = useQueryClient();
  const currentTenant = useTenantStore((s) => s.currentTenant);

  return useMutation({
    mutationFn: (serviceId: string) => {
      if (!currentTenant?.id) throw new Error("No tenant selected");
      return serviceApi.deleteService(currentTenant.id, serviceId);
    },
    onSuccess: () => {
      sileo.success({ title: "Servicio eliminado correctamente" });
      queryClient.invalidateQueries({ queryKey: ["services", currentTenant?.id] });
    },
    onError: () => {
      sileo.error({ title: "Ocurrió un error al intentar eliminar el servicio" });
    },
  });
}

