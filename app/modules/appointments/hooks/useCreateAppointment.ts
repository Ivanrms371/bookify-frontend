import { useMutation, useQueryClient } from "@tanstack/react-query"
import { appointmentsApi } from "../api/appointments.api"
import { sileo } from "sileo"

export const useCreateAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ tenantId, payload }: { tenantId: string; payload: any }) =>
      appointmentsApi.createAppointment(tenantId, payload),
    onSuccess: () => {
      sileo.success({ title: "Turno agendado correctamente" })
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      })
    },
    onError: (error: any) => {
      sileo.error({ title: error?.response?.data?.message || "Ocurrió un error al agendar el turno" })
    },
  })
}
