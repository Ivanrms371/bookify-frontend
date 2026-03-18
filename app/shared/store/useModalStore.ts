import { create } from "zustand";

export type ModalType =
  | "serviceCreate"
  | "serviceUpdate"
  | "availability"
  | "businessImages"
  | "inviteTeam"
  | "address"
  | "publishBusiness"
  | null;

interface ModalState {
  isOpen: boolean;
  isVisible: boolean;
  type: ModalType;
  modalProps?: Record<string, any>;
  openModal: (type: ModalType, props?: Record<string, any>) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  isVisible: false,
  type: null,
  modalProps: {},
  openModal: (type, modalProps = {}) => {
    set({ isOpen: true, type, modalProps });

    setTimeout(() => {
      set({ isVisible: true });
    }, 50);
  },
  closeModal: () => {
    set({ isVisible: false });
    setTimeout(() => {
      set({ isOpen: false, type: null, modalProps: {} });
    }, 300);
  },
}));
