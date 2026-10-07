import { useAuthStore } from '@/core/auth/use-auth-store';
import { canOpenOverlay } from '@/core/auth/overlay-permissions';
import { useOverlayStore } from '@/shared/store/use-overlay-store';
import { overlayRegistry, type OverlayKey } from './overlay-registry';
import type { ComponentType } from 'react';

export function OverlayRenderer() {
  const tenant = useAuthStore((state) => state.session?.activeTenant);
  const overlays = useOverlayStore((state) => state.overlays);

  return (
    <>
      {(Object.keys(overlays) as OverlayKey[]).map((key) => {
        const item = overlays[key];

        if (!item?.shouldRender || !canOpenOverlay(tenant, key, item.props)) return null;

        const Component = overlayRegistry[key] as ComponentType<any>;

        const props = item.props ?? {};

        return <Component key={key} {...props} />;
      })}
    </>
  );
}
