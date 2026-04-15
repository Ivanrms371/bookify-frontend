import { sileo } from "sileo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { serviceApi } from "../api/service.api";
import type { UpdateServiceInput } from "../types/service-update.type";
import { useTenant } from "@/shared/context/tenant.context";

export function useUpdateService(id: string) {
  const queryClient = useQueryClient();

  const { tenantId } = useTenant();

  return useMutation({
    mutationFn: (data: Partial<UpdateServiceInput>) =>
      serviceApi.updateService(tenantId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services", tenantId] });
      queryClient.invalidateQueries({ queryKey: ["service", tenantId, id] });
      sileo.success({ title: "Servicio actualizado exitosamente" });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Ocurrió un error al actualizar el servicio";
      sileo.error({ title: message });
    },
  });
}