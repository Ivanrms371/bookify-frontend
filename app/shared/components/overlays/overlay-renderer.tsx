import { useAuthStore } from '@/core/auth/use-auth-store';
import { canOpenOverlay } from '@/core/auth/overlay-permissions';
import { useOverlayStore } from '@/shared/store/use-overlay-store';
import { overlayRegistry, type OverlayKey } from './overlay-registry';
import { useEffect, type ComponentType } from 'react';

export function OverlayRenderer() {
  const session = useAuthStore((state) => state.session);
  const tenant = session?.activeTenant;
  const overlays = useOverlayStore((state) => state.overlays);

  useEffect(() => {
    const view = overlays['view-appointment-drawer'];
    if (view?.isVisible && (view.props.accountId !== session?.id || !canOpenOverlay(tenant, 'view-appointment-drawer', view.props))) {
      useOverlayStore.getState().close('view-appointment-drawer');
    }
    const customerView = overlays['view-customer-modal'];
    if (customerView?.isVisible && (customerView.props.accountId !== session?.id || !canOpenOverlay(tenant, 'view-customer-modal', customerView.props))) {
      useOverlayStore.getState().close('view-customer-modal');
    }
  }, [overlays, session, tenant]);

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
