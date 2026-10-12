import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { NOTIFICATIONS_PAGE_SIZE } from '../constants/notifications.constants';
import { notificationsApi } from '../api/notifications-api';

export const notificationKeys = {
  list: (tenantId?: string, userId?: string) => ['notifications', tenantId, userId] as const,
};

export function useNotificationScope() {
  const tenantId = useAuthStore((s) => s.session?.activeTenant?.id);
  const userId = useAuthStore((s) => s.session?.id);
  return { tenantId, userId };
}

export function useNotifications() {
  const { tenantId, userId } = useNotificationScope();
  const query = useInfiniteQuery({
    queryKey: notificationKeys.list(tenantId, userId),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ signal, pageParam }) => notificationsApi.getAll(tenantId!, {
      ...(pageParam && { cursor: pageParam }),
      limit: NOTIFICATIONS_PAGE_SIZE,
    }, signal),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!tenantId && !!userId,
    retry: false,
  });
  // A rejected refresh must not leave previously cached sensitive content visible.
  const pages = tenantId && userId && !query.isError ? query.data?.pages : undefined;
  return {
    pages: pages ?? [],
    notifications: pages?.flatMap((page) => page.notifications) ?? [],
    unreadCount: pages?.[0]?.unreadCount ?? 0,
    total: pages?.[0]?.total ?? 0,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
