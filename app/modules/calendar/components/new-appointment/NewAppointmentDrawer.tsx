import { Drawer } from "@/shared/components/_ui/Drawer"
import { useModalStore } from "@/shared/store/useModalStore"
import { AppointmentFormProvider } from "../../context/appointment-form.context"
import { AppointmentForm } from "./AppointmentForm"

export const NewAppointmentDrawer = () => {
  const { closeModal } = useModalStore()

  return (
    <Drawer
      onClose={closeModal}
      className="w-full max-w-3xl flex flex-col p-0 overflow-hidden"
    >
      <AppointmentFormProvider mode="create">
        <AppointmentForm title="Nueva Cita" />
      </AppointmentFormProvider>
    </Drawer>
  )
}
