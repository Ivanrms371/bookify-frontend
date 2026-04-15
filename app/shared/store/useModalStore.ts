import { create } from "zustand"

export type ModalType =
  | "serviceCreate"
  | "serviceUpdate"
  | "availability"
  | "tenantImages"
  | "inviteTeam"
  | "address"
  | "publishTenant"
  | "appointmentDetail"
  | "newAppointment"
  | "rescheduleAppointment"
  | "newCustomer"
  | "updateCustomer"
  | "deleteCustomer"
  | "blockCustomer"
  | "customerProfile"
  | "addCustomerNote"
  | null

interface ModalState {
  isOpen: boolean
  isVisible: boolean
  type: ModalType
  props?: Record<string, any>
  openModal: (type: ModalType, props?: Record<string, any>) => void
  closeModal: () => void
}

export const useModalStore = create<ModalState>((set, get) => ({
  isOpen: false,
  isVisible: false,
  type: null,
  props: {},
  openModal: (type, props = {}) => {
    set({ isOpen: true, type, props })

    setTimeout(() => {
      set({ isVisible: true })
    }, 50)
  },
  closeModal: () => {
    set({ isVisible: false })
    setTimeout(() => {
      set({ isOpen: false, type: null, props: {} })
    }, 300)
  },
}))
