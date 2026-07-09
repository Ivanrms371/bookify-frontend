import { create } from 'zustand';

type ModalProps = Record<string, unknown>;

interface ModalStore {
  modals: Record<string, ModalProps>;
  open: (key: string, props?: ModalProps) => void;
  close: (key: string) => void;
  closeAll: () => void;
  isOpen: (key: string) => boolean;
  getProps: <T extends ModalProps = ModalProps>(key: string) => T | undefined;
}

export const useModalStore = create<ModalStore>((set, get) => ({
  modals: {},

  open: (key, props = {}) =>
    set((state) => ({
      modals: { ...state.modals, [key]: props },
    })),

  close: (key) =>
    set((state) => {
      const next = { ...state.modals };
      delete next[key];
      return { modals: next };
    }),

  closeAll: () => set({ modals: {} }),

  isOpen: (key) => key in get().modals,

  getProps: <T extends ModalProps = ModalProps>(key: string) => get().modals[key] as T | undefined,
}));
