import { httpClient } from "@/core/http/httpClient"
import type { Notification } from "../types/notification.types"

export interface GetNotificationsResponse {
  unreadCount: number
  notifications: Notification[]
}

export const notificationsService = {
  getAll: async (): Promise<GetNotificationsResponse> => {
    return await httpClient.get('/notifications')
  },
  markAsRead: async (notificationId: string) => {
    return await httpClient.patch(`/notifications/${notificationId}/read`)
  },
  markAllAsRead: async () => {
    return await httpClient.put('/notifications/read-all')
  },
}