import { useOverlayStore } from '@/shared/store/use-overlay-store';
import { overlayRegistry, type OverlayKey } from './overlay-registry';
import type { ComponentType } from 'react';

export function OverlayRenderer() {
  const overlays = useOverlayStore((state) => state.overlays);

  return (
    <>
      {(Object.keys(overlays) as OverlayKey[]).map((key) => {
        const item = overlays[key];

        // 1. Si no debe renderizarse, se omite
        if (!item?.shouldRender) return null;

        // 2. Casteo a ComponentType<any> para evitar que TS exija las props de todos los componentes juntos
        const Component = overlayRegistry[key] as ComponentType<any>;

        // 3. Fallback (item.props ?? {}) para evitar el error "Spread types may only be created from object types"
        const props = item.props ?? {};

        return <Component key={key} {...props} />;
      })}
    </>
  );
}
