import { useModalStore } from '@/shared/store/useModalStore';
import { modalRegistry } from './modal-registry';

export function ModalRenderer() {
  const modals = useModalStore((state) => state.modals);
  const close = useModalStore((state) => state.close);

  return (
    <>
      {Object.entries(modals).map(([key, props]) => {
        const Component = modalRegistry[key];

        if (!Component) {
          if (import.meta.env.DEV) {
            console.warn(`[ModalRenderer] No component registered for modal "${key}"`);
          }
          return null;
        }

        return <Component key={key} {...props} onClose={() => close(key)} />;
      })}
    </>
  );
}
