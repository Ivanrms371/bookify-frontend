import { useMutation, useQueryClient } from "@tanstack/react-query"
import { customerApi } from "../api/customer.api"
import { useTenant } from "@/shared/context/tenant.context"
import { sileo } from "sileo"
import { useModalStore } from "@/shared/store/useModalStore"

export const useCreateCustomer = () => {
  const { tenantId } = useTenant()
  const queryClient = useQueryClient()
  const { closeModal } = useModalStore()

  return useMutation({
    mutationFn: (data: any) => customerApi.createCustomer(tenantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers", tenantId] })
      sileo.success({ title: "Cliente creado exitosamente" })
      closeModal()
    },
    onError: (error: any) => {
      sileo.error({
        title: "Error al crear cliente",
        description: error?.response?.data?.message || "Ocurrió un error",
      })
    },
  })
}
