import { useEffect, useRef, useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { NotificationDropdown } from '@/features/notifications';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { useNotifications, useNotificationScope } from '../hooks/useNotifications';
import { useNotificationSubscription } from '../hooks/useNotificationSubscription';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';
import { Button } from '@/shared/components/ui';

export const NotificationToggle = () => {
  useNotificationSubscription();
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { unreadCount } = useNotifications();
  const { tenantId } = useNotificationScope();
  const tenantSlug = useAuthStore((state) => state.session?.activeTenant?.slug);
  const isMobile = useMediaQuery('(max-width: 1024px)');

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsVisible(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => setIsVisible(false), [tenantId]);

  const toggleOpen = () => setIsVisible((prev) => !prev);

  return (
    <div ref={ref} className="relative">
      <Button
        {...(isMobile && tenantSlug
          ? { to: `/${encodeURIComponent(tenantSlug)}/notifications` }
          : { type: 'button' as const, onClick: toggleOpen })}
        variant="ghost"
        size="icon"
        className="relative"
        aria-label="Notificaciones"
        aria-expanded={isMobile ? undefined : isVisible}
      >
        <BellIcon className="size-5 text-gray-700 " />
        {unreadCount > 0 && (
          <div className="absolute top-0 right-0 flex h-4.5 w-4.5 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[0.625rem] font-bold text-white">
              {unreadCount}
            </span>
          </div>
        )}
      </Button>

      {!isMobile && <NotificationDropdown onClose={() => setIsVisible(false)} isVisible={isVisible} />}
    </div>
  );
};
