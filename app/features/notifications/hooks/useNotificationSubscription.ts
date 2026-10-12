import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { notificationKeys, useNotificationScope } from './useNotifications';

export function useNotificationSubscription() {
  const { tenantId, userId } = useNotificationScope();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!tenantId || !userId) return;
    // Socket.IO namespaces live at the origin, outside the HTTP /api prefix.
    const origin = new URL(import.meta.env.VITE_API_URL, window.location.origin).origin;
    const socket = io(`${origin}/notifications`, {
      withCredentials: true,
      auth: { tenantId },
    });
    const refresh = () => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.list(tenantId, userId), exact: true });
    };
    socket.on('connect', refresh);
    socket.on('notifications.changed', (event: { tenantId?: string } | null) => {
      if (event?.tenantId === tenantId) refresh();
    });
    return () => { socket.disconnect(); };
  }, [tenantId, userId, queryClient]);
}
