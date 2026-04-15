import { useMutation, useQueryClient } from "@tanstack/react-query"
import { appointmentsApi } from "../api/appointments.api"
import { sileo } from "sileo"

export const useCancelAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      tenantId,
      appointmentId,
      reason,
    }: {
      tenantId: string
      appointmentId: string
      reason?: string
    }) => appointmentsApi.markAsCancelled(tenantId, appointmentId, reason),
    onSuccess: () => {
      sileo.success({ title: "Turno cancelado correctamente" })
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      })
    },
    onError: (error: any) => {
      sileo.error({
        title:
          error?.response?.data?.message ||
          "Ocurrió un error al cancelar el turno",
      })
    },
  })
}
