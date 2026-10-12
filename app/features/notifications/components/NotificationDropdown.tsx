import { NOTIFICATIONS_PREVIEW_SIZE } from '../constants/notifications.constants';
import { Button } from '@/shared/components/ui/button';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { cn } from '@/shared/utils/cn';
import { useNotifications } from '../hooks/useNotifications';
import { useMarkAllAsRead } from '../hooks/useMarkAllAsRead';
import { NotificationItem } from './NotificationItem';
import { useEffect, useState } from 'react';

interface Props {
  onClose: () => void;
  isVisible: boolean;
}

export function NotificationDropdown({ onClose, isVisible }: Props) {
  const { notifications, unreadCount, isLoading, isError } = useNotifications();
  const { mutate: markAllAsRead, isPending } = useMarkAllAsRead();

  const tenantSlug = useAuthStore((state) => state.session?.activeTenant?.slug);
  const [show, setShow] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => setAnimate(true), 50);
      return () => clearTimeout(timer);
    }
    setAnimate(false);
    const timer = setTimeout(() => setShow(false), 200);
    return () => clearTimeout(timer);
  }, [isVisible]);

  if (!show) return null;

  return (
    <div
      className={cn(
        'z-50 w-80 overflow-hidden rounded-lg p-0 md:w-96 lg:w-120',
        'border border-gray-200',
        'bg-white shadow-lg shadow-gray-900/10',
        'absolute top-14 right-0',
        'transition-all duration-300',
        'hidden -translate-y-6 scale-95 opacity-0 md:block',
        animate && 'translate-y-0 scale-100 opacity-100',
      )}
    >
      <div className={cn('flex items-center justify-between gap-4 px-5 py-4', 'border-b border-gray-100 ')}>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-800 ">Notificaciones</span>
        </div>

        {unreadCount > 0 && (
          <Button
            isSubmitting={isPending}
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              markAllAsRead();
            }}
            className="cursor-pointer text-xs font-medium text-gray-600 transition-colors hover:text-gray-900 "
          >
            Marcar todo como leído
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="py-8 text-center">
          <p className="text-sm text-gray-400">Cargando notificaciones...</p>
        </div>
      ) : isError ? (
        <div className="py-8 text-center">
          <p className="text-sm text-gray-400">No se pudieron cargar las notificaciones.</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-gray-400 ">Sin notificaciones</p>
        </div>
      ) : (
        <ul className="max-h-96 divide-y divide-gray-100 overflow-y-auto overscroll-contain">
          {notifications.slice(0, NOTIFICATIONS_PREVIEW_SIZE).map((notification) => (
            <NotificationItem key={notification.id} notification={notification} onClose={onClose} />
          ))}
        </ul>
      )}

      {tenantSlug && notifications.length > 0 && (
        <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-4">
          <Button variant="primary" fullWidth size="sm" to={`/${encodeURIComponent(tenantSlug)}/notifications`} onClick={onClose}>
            Ver todas
          </Button>
        </div>
      )}
    </div>
  );
}
