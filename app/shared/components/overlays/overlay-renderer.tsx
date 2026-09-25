import { useOverlayStore } from '@/shared/store/use-overlay-store';
import { overlayRegistry, type OverlayKey } from './overlay-registry';
import type { ComponentType } from 'react';

export function OverlayRenderer() {
  const overlays = useOverlayStore((state) => state.overlays);

  return (
    <>
      {(Object.keys(overlays) as OverlayKey[]).map((key) => {
        const item = overlays[key];

        if (!item?.shouldRender) return null;

        const Component = overlayRegistry[key] as ComponentType<any>;

        const props = item.props ?? {};

        return <Component key={key} {...props} />;
      })}
    </>
  );
}
