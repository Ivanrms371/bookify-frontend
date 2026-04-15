import { useMutation, useQueryClient } from "@tanstack/react-query"
import { appointmentsApi } from "../api/appointments.api"
import { sileo } from "sileo"

export const useNoShowAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      tenantId,
      appointmentId,
    }: {
      tenantId: string
      appointmentId: string
    }) => appointmentsApi.markAsNoShow(tenantId, appointmentId),
    onSuccess: () => {
      sileo.success({ title: "Turno marcado como no asistió" })
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      })
    },
    onError: (error: any) => {
      sileo.error({
        title: error?.response?.data?.message ||
          "Ocurrió un error al marcar como no asistió"
      })
    },
  })
}
