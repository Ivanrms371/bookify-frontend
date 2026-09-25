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
  const { notifications, unreadCount } = useNotifications();
  const { mutate: markAllAsRead } = useMarkAllAsRead();

  const [show, setShow] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      setTimeout(() => {
        setAnimate(true);
      }, 50);
    } else {
      setAnimate(false);
      setTimeout(() => setShow(false), 200);
    }
  }, [isVisible]);

  if (!show) return null;

  return (
    <div
      className={cn(
        'z-50 w-80 overflow-hidden rounded-lg p-0 md:w-96 lg:w-120',
        'border border-gray-200 ',
        'bg-gray-50 shadow-sm ',
        'absolute top-14 right-0',
        'transition-all duration-300',
        'hidden -translate-y-6 scale-95 opacity-0 md:block',
        animate && 'translate-y-0 scale-100 opacity-100',
      )}
    >
      <div className={cn('flex items-center justify-between px-3.5 py-3', 'border-b border-gray-100 ')}>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-800 ">Notificaciones</span>
        </div>

        {unreadCount > -1 && (
          <button
            onClick={(e) => {
              e.preventDefault();
              markAllAsRead();
            }}
            className="cursor-pointer text-xs font-medium text-gray-600 transition-colors hover:text-gray-900 "
          >
            Marcar todo como leído
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-gray-400 ">Sin notificaciones</p>
        </div>
      ) : (
        <ul className="max-h-80 divide-y divide-gray-200 overflow-y-auto ">
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} onClose={onClose} />
          ))}
        </ul>
      )}
    </div>
  );
}
