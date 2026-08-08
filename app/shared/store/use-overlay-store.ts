import { create } from 'zustand';
import type { OverlayKey, OverlayPropsMap } from '@/shared/components/overlays/overlay-registry';

const EXIT_MS = 300;

type OverlayItem<K extends OverlayKey> = {
  props: OverlayPropsMap[K];
  shouldRender: boolean;
  isVisible: boolean;
  closeTimer?: ReturnType<typeof setTimeout>;
};

type Overlays = Partial<{ [K in OverlayKey]: OverlayItem<K> }>;

interface ModalStore {
  overlays: Overlays;
  open: <K extends OverlayKey>(key: K, props?: OverlayPropsMap[K]) => void;
  close: (key: OverlayKey) => void;
  closeAll: () => void;
  isOpen: (key: OverlayKey) => boolean;
  getProps: <K extends OverlayKey>(key: K) => OverlayPropsMap[K] | undefined;
}

export const useOverlayStore = create<ModalStore>((set, get) => ({
  overlays: {},

  open: (key, props) => {
    const existing = get().overlays[key];
    if (existing?.closeTimer) {
      clearTimeout(existing.closeTimer);
    }

    set((state) => ({
      overlays: {
        ...state.overlays,
        [key]: {
          props: props as any,
          shouldRender: true,
          isVisible: false,
        },
      },
    }));

    requestAnimationFrame(() => {
      set((state) => {
        const item = state.overlays[key];
        if (!item) return state;
        return {
          overlays: {
            ...state.overlays,
            [key]: { ...item, isVisible: true },
          },
        };
      });
    });
  },

  close: (key) => {
    const item = get().overlays[key];
    if (!item) return;

    if (item.closeTimer) {
      clearTimeout(item.closeTimer);
    }

    set((state) => ({
      overlays: {
        ...state.overlays,
        [key]: { ...item, isVisible: false },
      },
    }));

    const timer = setTimeout(() => {
      set((state) => {
        const next = { ...state.overlays };
        delete next[key];
        return { overlays: next };
      });
    }, EXIT_MS);

    set((state) => {
      const current = state.overlays[key];
      if (!current) return state;
      return {
        overlays: {
          ...state.overlays,
          [key]: { ...current, closeTimer: timer },
        },
      };
    });
  },

  closeAll: () => {
    const state = get();
    // Inicia animación de salida para todos
    Object.keys(state.overlays).forEach((key) => {
      state.close(key as OverlayKey);
    });
  },

  isOpen: (key) => Boolean(get().overlays[key]?.shouldRender),

  getProps: (key) => get().overlays[key]?.props as any,
}));
