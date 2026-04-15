import { useMutation, useQueryClient } from "@tanstack/react-query"
import { customerApi } from "../api/customer.api"
import { useTenant } from "@/shared/context/tenant.context"
import { sileo } from "sileo"

export function useDeleteCustomer() {
  const { tenantId } = useTenant()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => customerApi.deleteCustomer(tenantId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers", tenantId] })
      sileo.success({ title: "Cliente eliminado correctamente" })
    },
    onError: (error: any) => {
      sileo.error({
        title: "Error al eliminar el cliente",
        description: error?.response?.data?.message || "Ocurrió un error",
      })
    },
  })
}
