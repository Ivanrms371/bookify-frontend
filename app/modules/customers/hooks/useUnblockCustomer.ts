import { useMutation, useQueryClient } from "@tanstack/react-query"
import { customerApi } from "../api/customer.api"
import { useTenant } from "@/shared/context/tenant.context"
import { sileo } from "sileo"

export const useUnblockCustomer = () => {
  const { tenantId } = useTenant()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (customerId: string) =>
      customerApi.unblockCustomer(tenantId, customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers", tenantId] })
      sileo.success({ title: "Cliente desbloqueado exitosamente" })
    },
    onError: (error: any) => {
      sileo.error({
        title: "Error al desbloquear cliente",
        description: error?.response?.data?.message || "Ocurrió un error",
      })
    },
  })
}
