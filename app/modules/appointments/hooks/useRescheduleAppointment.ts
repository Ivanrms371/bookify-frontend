import { useMutation, useQueryClient } from "@tanstack/react-query"
import { appointmentsApi } from "../api/appointments.api"
import { sileo } from "sileo"

export const useRescheduleAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      tenantId,
      appointmentId,
      payload,
    }: {
      tenantId: string
      appointmentId: string
      payload: { staffId: string; serviceId: string; date: string; reason?: string }
    }) => appointmentsApi.rescheduleAppointment(tenantId, appointmentId, payload),
    onSuccess: () => {
      sileo.success({ title: "Turno reagendado correctamente" })
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      })
    },
    onError: (error: any) => {
      sileo.error({
        title:
          error?.response?.data?.message ||
          "Ocurrió un error al reagendar el turno",
      })
    },
  })
}
