import { useAuthStore } from '@/core/auth/use-auth-store';
import { canOpenOverlay } from '@/core/auth/overlay-permissions';
import { useCallback } from 'react';
import { useOverlayStore } from '@/shared/store/use-overlay-store';
import type { OverlayKey, OverlayPropsMap } from '@/shared/components/overlays/overlay-registry';

export function useOverlay<K extends OverlayKey>(key: K) {
  const overlayItem = useOverlayStore((state) => state.overlays[key]);
  const openOverlay = useOverlayStore((state) => state.open);
  const closeOverlay = useOverlayStore((state) => state.close);

  const open = useCallback(
    (props?: OverlayPropsMap[K]) => {
      if (canOpenOverlay(useAuthStore.getState().session?.activeTenant, key, props)) openOverlay(key, props);
    },
    [key, openOverlay],
  );

  const close = useCallback(() => {
    closeOverlay(key);
  }, [key, closeOverlay]);

  return {
    isOpen: Boolean(overlayItem?.shouldRender),
    shouldRender: Boolean(overlayItem?.shouldRender),
    isVisible: Boolean(overlayItem?.isVisible),
    props: overlayItem?.props as OverlayPropsMap[K] | undefined,
    open,
    close,
  };
}
