import React from "react"
import { useModalStore } from "@/shared/store/useModalStore"

import { ServiceCreateModal } from "@/modules/services/components/ServiceCreateModal"
import { ServiceUpdateModal } from "@/modules/services/components/ServiceUpdateModal"
import { InviteTeamModal } from "@/modules/staff/components/modals/InviteTeamModal"
import { PublishTenantModal } from "@/modules/tenant/components/modals/PublishTenantModal"
import { AddressModal } from "@/modules/tenant/components/modals/AddressModal"
import { TenantImagesModal } from "@/modules/tenant/components/modals/TenantImagesModal"
import { AppointmentDetailDrawer } from "@/modules/calendar/components/appointment-detail/AppointmentDetailDrawer"
import { NewAppointmentDrawer } from "@/modules/appointments/components/drawers/NewAppointmentDrawer"
import { RescheduleAppointmentDrawer } from "@/modules/appointments/components/drawers/RescheduleAppointmentDrawer"
import { NewCustomerModal } from "@/modules/customers/components/NewCustomerModal"
import { DeleteCustomerModal } from "@/modules/customers/components/DeleteCustomerModal"
import { BlockCustomerModal } from "@/modules/customers/components/BlockCustomerModal"
import { UpdateCustomerModal } from "@/modules/customers/components/UpdateCustomerModal"
import { CustomerProfileModal } from "@/modules/customers/components/CustomerProfileModal"
import { AddCustomerNoteModal } from "@/modules/customers/components/AddCustomerNoteModal"
import { AvailabilityModal } from "@/modules/availability/components/AvailabilityModal"

const MODAL_COMPONENTS: Record<string, React.ComponentType<any>> = {
  serviceCreate: ServiceCreateModal,
  serviceUpdate: ServiceUpdateModal,
  inviteTeam: InviteTeamModal,
  publishTenant: PublishTenantModal,
  availability: AvailabilityModal,
  address: AddressModal,
  tenantImages: TenantImagesModal,
  appointmentDetail: AppointmentDetailDrawer,
  newAppointment: NewAppointmentDrawer,
  rescheduleAppointment: RescheduleAppointmentDrawer,
  newCustomer: NewCustomerModal,
  deleteCustomer: DeleteCustomerModal,
  updateCustomer: UpdateCustomerModal,
  blockCustomer: BlockCustomerModal,
  customerProfile: CustomerProfileModal,
  addCustomerNote: AddCustomerNoteModal,
}

export const GlobalModalProvider = () => {
  const { type, isOpen, props } = useModalStore()

  if (!isOpen || !type) return null

  const ModalComponent = MODAL_COMPONENTS[type]

  if (!ModalComponent) {
    console.error(`Modal component for type "${type}" not found`)
    return null
  }

  // Simplified provider: Let the modales/drawers handle their own backdrops and layouts
  // Most components in this app use useModalStore's isVisible for animations
  return <ModalComponent {...props} />
}
