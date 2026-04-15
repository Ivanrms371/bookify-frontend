import { useMutation, useQueryClient } from "@tanstack/react-query"
import { customerApi } from "../api/customer.api"
import { toast } from "sonner" 

export const useUpdateCustomerNotes = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ 
      tenantId, 
      customerId, 
      notes 
    }: { 
      tenantId: string, 
      customerId: string, 
      notes: string 
    }) => customerApi.updateCustomerNotes(tenantId, customerId, notes),
    onSuccess: (_, { tenantId, customerId }) => {
      // Corrected query keys to match useCustomer hook
      queryClient.invalidateQueries({ queryKey: ["customer", "detail", tenantId, customerId] })
      queryClient.invalidateQueries({ queryKey: ["customers"] })
    },
    onError: (error) => {
      console.error("Error updating customer notes:", error)
    }
  })
}
