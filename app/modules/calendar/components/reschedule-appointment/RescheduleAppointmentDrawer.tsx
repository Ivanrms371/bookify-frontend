import { Drawer } from "@/shared/components/_ui/Drawer"
import { useModalStore } from "@/shared/store/useModalStore"
import { useTenantStore } from "@/modules/tenant/store/tenant.store"
import { useAppointmentDetail } from "../../hooks/useAppointmentDetail"
import { AppointmentFormProvider } from "../../context/appointment-form.context"
import { AppointmentForm } from "../new-appointment/AppointmentForm"
import { LoadingSpinner } from "@/shared/components/_ui/LoadingSpinner"

export const RescheduleAppointmentDrawer = () => {
  const { closeModal, props } = useModalStore()
  const appointmentId = props?.appointmentId as string
  const { currentTenant } = useTenantStore()

  const { data: appointment, isPending } = useAppointmentDetail(
    currentTenant?.id,
    appointmentId,
  )

  return (
    <Drawer
      onClose={closeModal}
      className="w-full max-w-3xl flex flex-col p-0 overflow-hidden"
    >
      {isPending || !appointment ? (
        <div className="flex justify-center items-center h-full py-12">
          <LoadingSpinner size="md" />
        </div>
      ) : (
        <AppointmentFormProvider
          mode="reschedule"
          initialData={{
            appointmentId,
            appointment,
          }}
        >
          <AppointmentForm title="Reagendar Cita" />
        </AppointmentFormProvider>
      )}
    </Drawer>
  )
}
