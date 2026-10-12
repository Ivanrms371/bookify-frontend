import { ArrowRightIcon } from '@heroicons/react/16/solid';
import { notificationActionUrl } from '../utils/notification-action-url';
import { cn } from '@/shared/utils/cn';
import { formatRelativeTime } from '@/shared/utils/date';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { useMarkAsRead } from '../hooks/useMarkAsRead';
import type { Notification } from '../types/notification.types';
import { notificationIcon, notificationColor } from '../utils/notification.utils';
import { Button } from '@/shared/components/ui';

interface Props {
  notification: Notification;
  onClose?: () => void;
}

export function NotificationItem({ notification, onClose }: Props) {
  const { mutate: markAsRead } = useMarkAsRead();
  const tenantSlug = useAuthStore((state) => state.session?.activeTenant?.slug);
  const actionHref = notificationActionUrl(notification, tenantSlug);

  const isUnread = !notification.readAt;
  const handleClick = () => {
    if (isUnread) markAsRead(notification.id);
    onClose?.();
  };

  return (
    <li className={cn('px-5 py-5 transition-colors duration-200', isUnread && 'hover:bg-gray-50')}>
      <button
        type="button"
        onClick={handleClick}
        className="flex w-full items-start gap-3 rounded text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
      >
        <span className={cn('mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md', notificationColor(notification.type))}>
          {notificationIcon(notification.type)}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-gray-800">{notification.title}</span>
          <span className="mt-1.5 block text-sm leading-relaxed text-gray-600">{notification.message}</span>
        </span>
        <span className="flex flex-col items-end gap-1">
          <span className="mt-1 text-xs font-medium whitespace-nowrap text-gray-400">{formatRelativeTime(notification.createdAt)}</span>
          {isUnread && (
            <span className="relative mr-4">
              <span className="absolute mt-2 size-2.5 animate-ping rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
              <span className="absolute mt-2 size-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            </span>
          )}
        </span>
      </button>
      {actionHref && (
        <div className="mt-4 flex justify-end">
          <Button
            to={actionHref}
            onClick={(event) => {
              event.stopPropagation();
              handleClick();
            }}
            size="sm"
            variant="secondary"
          >
            {notification.actionLabel || 'Ver detalles'}
            <ArrowRightIcon className="size-3.5" aria-hidden="true" />
          </Button>
        </div>
      )}
    </li>
  );
}
