import { cn } from '@/shared/utils/cn';
import { formatRelativeTime } from '@/shared/utils/date';
import { useMarkAsRead } from '../hooks/useMarkAsRead';
import type { Notification } from '../types/notification.types';
import { notificationIcon, notificationColor } from '../utils/notification.utils';

interface Props {
  notification: Notification;
  onClose: () => void;
}

export function NotificationItem({ notification, onClose }: Props) {
  const { mutate: markAsRead } = useMarkAsRead();

  const handleClick = () => {
    if (!notification.readAt) markAsRead(notification.id);
    onClose();
  };

  return (
    <li
      className={cn('flex gap-2 px-4 py-2 transition-colors duration-200 hover:bg-gray-100 ', !notification.readAt && 'cursor-pointer')}
      onClick={handleClick}
    >
      <div className={cn('mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md', notificationColor(notification.type))}>
        {notificationIcon(notification.type)}
      </div>

      <div className="flex flex-1 flex-col">
        <p className={cn('text-sm font-semibold text-gray-800 ')}>{notification.title}</p>
        <p className={cn('mt-0.5 line-clamp-2 text-sm leading-relaxed font-medium text-gray-600 ')}>{notification.message}</p>

        {notification.actionUrl && (
          <button onClick={handleClick} className="mt-2 w-fit rounded-lg bg-indigo-600 px-2 py-1 text-sm font-medium text-gray-50">
            Empezar Onboarding
          </button>
        )}
      </div>
      <div className="flex flex-col items-end gap-1">
        <p className="mt-1 text-xs font-medium whitespace-nowrap text-gray-400">{formatRelativeTime(notification.createdAt)}</p>
        {!notification.readAt && (
          <div className="relative mr-4">
            <div className="absolute mt-2 size-2.5 animate-ping rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            <div className="absolute mt-2 size-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
          </div>
        )}
      </div>
    </li>
  );
}
