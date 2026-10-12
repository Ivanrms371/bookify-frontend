import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/notifications-api';
import { notificationKeys, useNotificationScope } from './useNotifications';
import { useAuthStore } from '@/core/auth/use-auth-store';

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  const { tenantId, userId } = useNotificationScope();
  return useMutation({
    mutationFn: (id: string) => {
      const session = useAuthStore.getState().session;
      if (!tenantId || !userId || session?.id !== userId || session.activeTenant?.id !== tenantId) {
        throw new Error('El espacio seleccionado cambió.');
      }
      return notificationsApi.markAsRead(tenantId, id);
    },
    onMutate: () => ({ tenantId, userId }),
    onSuccess: (_data, _variables, scope) => queryClient.invalidateQueries({
      queryKey: notificationKeys.list(scope.tenantId, scope.userId), exact: true,
    }),
  });
};
