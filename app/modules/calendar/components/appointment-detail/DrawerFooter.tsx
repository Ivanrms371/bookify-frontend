import { Button } from "@/shared/components/form/Button"
import { useNoShowAppointment } from "@/modules/appointments/hooks/useNoShowAppointment"
import { useCancelAppointment } from "@/modules/appointments/hooks/useCancelAppointment"
import { useModalStore } from "@/shared/store/useModalStore"

interface Props {
  onClose: () => void
  status: string
  appointmentId: string
  tenantId: string
}

export const DrawerFooter = ({
  onClose,
  status,
  appointmentId,
  tenantId,
}: Props) => {
  const { mutate: markAsNoShow, isPending: isNoShowPending } = useNoShowAppointment()
  const { mutate: cancelAppointment, isPending: isCancelPending } = useCancelAppointment()
  const { openModal } = useModalStore()

  if (status === "CANCELLED" || status === "NO_SHOW") return null

  const handleNoShow = () => {
    markAsNoShow(
      { tenantId, appointmentId },
      {
        onSuccess: () => onClose(),
      },
    )
  }

  const handleCancel = () => {
    cancelAppointment(
      { tenantId, appointmentId },
      {
        onSuccess: () => onClose(),
      },
    )
  }

  const handleReschedule = () => {
    // Close detail drawer, then open reschedule drawer
    onClose()
    setTimeout(() => {
      openModal("rescheduleAppointment", { appointmentId })
    }, 350)
  }

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between">
        {status !== "COMPLETED" && (
          <>
            <div className="flex gap-2">
              <Button size="sm" className="button-secondary" onClick={handleReschedule}>
                Reagendar
              </Button>
              <Button
                size="sm"
                className="button-danger"
                onClick={handleCancel}
                isLoading={isCancelPending}
              >
                Cancelar
              </Button>
            </div>
            <Button size="sm" className="button-primary" onClick={onClose}>
              Completar
            </Button>
          </>
        )}

        {status === "COMPLETED" && (
          <>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="button-danger"
                onClick={handleNoShow}
                isLoading={isNoShowPending}
              >
                Marcar No Asistió
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
