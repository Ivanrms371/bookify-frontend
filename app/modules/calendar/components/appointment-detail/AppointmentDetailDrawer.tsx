import { useModalStore } from "@/shared/store/useModalStore"
import { useAppointmentDetail } from "../../hooks/useAppointmentDetail"
import { useTenantStore } from "@/modules/tenant/store/tenant.store"
import { useDarkModeStore } from "@/shared/store/useDarkModeStore"
import { LoadingSpinner } from "@/shared/components/_ui/LoadingSpinner"
import { Drawer } from "@/shared/components/_ui/Drawer"
import { AppointmentDetailsPanel } from "./AppointmentDetailsPanel"
import { CustomerPanel } from "./CustomerPanel"
import { DrawerFooter } from "./DrawerFooter"

export const AppointmentDetailDrawer = () => {
  const { closeModal, props } = useModalStore()
  const appointmentId = props?.appointmentId as string
  const { currentTenant } = useTenantStore()
  const { isDark } = useDarkModeStore()

  const { data: appointment, isPending } = useAppointmentDetail(
    currentTenant?.id,
    appointmentId,
  )

  return (
    <Drawer onClose={closeModal}>
      {isPending || !appointment ? (
        <div className="flex justify-center items-center h-full py-12">
          <LoadingSpinner size="md" />
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="grid grid-cols-2 flex-1 border-b border-mist-200 dark:border-mist-900">
            <AppointmentDetailsPanel appointment={appointment} />
            <CustomerPanel appointment={appointment} isDark={isDark} />
          </div>
          <DrawerFooter
            onClose={closeModal}
            status={appointment.status}
            appointmentId={appointmentId}
            tenantId={currentTenant!.id}
          />
        </div>
      )}
    </Drawer>
  )
}
