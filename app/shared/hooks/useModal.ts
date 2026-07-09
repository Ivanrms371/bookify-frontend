import { useCallback } from 'react';
import { useModalStore } from '@/shared/store/useModalStore';

export function useModal<T extends Record<string, unknown> = Record<string, unknown>>(key: string) {
  const isOpen = useModalStore((state) => key in state.modals);
  const props = useModalStore((state) => state.modals[key] as T | undefined);
  const openModal = useModalStore((state) => state.open);
  const closeModal = useModalStore((state) => state.close);

  const open = useCallback((modalProps?: T) => openModal(key, modalProps), [key, openModal]);
  const close = useCallback(() => closeModal(key), [key, closeModal]);

  return {
    isOpen,
    props,
    open,
    close,
  };
}
