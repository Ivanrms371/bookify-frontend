import { useEffect, useRef, useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { NotificationDropdown } from '@/features/notifications';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';

export const NotificationToggle = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { unreadCount } = useNotifications();
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

  const toggleOpen = () => setIsVisible((prev) => !prev);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggleOpen}
        className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-mist-200 transition-colors hover:bg-mist-300"
      >
        <BellIcon className="size-5 text-mist-700 " />
        {unreadCount > 0 && (
          <div className="absolute top-0 right-0 flex h-4.5 w-4.5 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[0.625rem] font-bold text-white">
              {unreadCount}
            </span>
          </div>
        )}
      </button>

      {isMobile ? <></> : <NotificationDropdown onClose={() => setIsVisible(false)} isVisible={isVisible} />}
    </div>
  );
};
