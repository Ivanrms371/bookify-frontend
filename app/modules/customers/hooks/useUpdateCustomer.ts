import { useMutation, useQueryClient } from "@tanstack/react-query"
import { customerApi } from "../api/customer.api"
import { useTenant } from "@/shared/context/tenant.context"
import { sileo } from "sileo"
import { useModalStore } from "@/shared/store/useModalStore"

export const useUpdateCustomer = () => {
  const { tenantId } = useTenant()
  const queryClient = useQueryClient()
  const { closeModal } = useModalStore()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      customerApi.updateCustomer(tenantId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers", tenantId] })
      sileo.success({ title: "Cliente actualizado exitosamente" })
      closeModal()
    },
    onError: (error: any) => {
      sileo.error({
        title: "Error al actualizar cliente",
        description: error?.response?.data?.message || "Ocurrió un error",
      })
    },
  })
}
