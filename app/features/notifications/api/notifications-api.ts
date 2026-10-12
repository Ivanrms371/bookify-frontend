import { httpClient } from '@/core/http/httpClient';
import type { Notification } from '../types/notification.types';

export interface GetNotificationsResponse {
  unreadCount: number;
  total: number;
  notifications: Notification[];
  nextCursor: string | null;
}

export const notificationsApi = {
  getAll: (tenantId: string, params: { cursor?: string; limit?: number }, signal?: AbortSignal): Promise<GetNotificationsResponse> =>
    httpClient.get('/notifications', { params, expectedTenantId: tenantId, signal }),
  markAsRead: (tenantId: string, notificationId: string) =>
    httpClient.patch(`/notifications/${notificationId}/read`, undefined, { expectedTenantId: tenantId }),
  markAllAsRead: (tenantId: string) =>
    httpClient.put('/notifications/read-all', undefined, { expectedTenantId: tenantId }),
};
